import { AgentPubKey } from "@holochain/conductor-api";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  arrowBackSharp,
  informationCircleOutline,
  peopleCircleOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { ChatListMethods } from "../../components/Chat/types";
import Typing from "../../components/Chat/Typing";
import MessageInput from "../../components/MessageInput";
import { FilePayloadInput } from "../../redux/commons/types";
import {
  getLatestGroupVersion,
  indicateGroupTyping,
  sendGroupMessage,
} from "../../redux/group/actions";
import {
  GroupConversation,
  GroupMessage,
  GroupMessageInput,
} from "../../redux/group/types";
import { fetchId } from "../../redux/profile/actions";
import { RootState } from "../../redux/types";
import {
  base64ToUint8Array,
  Uint8ArrayToBase64,
  useAppDispatch,
} from "../../utils/helpers";
import MessageList from "./MessageList";
import styles from "./style.module.css";

interface GroupChatParams {
  group: string;
}

const GroupChat: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { group } = useParams<GroupChatParams>();
  const chatList = useRef<ChatListMethods>(null);

  // local states
  const [myAgentId, setMyAgentId] = useState<string>("");
  const [files, setFiles] = useState<object[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupConversation | undefined>();
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingLoading, setSendingLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  // Selectors
  const groupData = useSelector(
    (state: RootState) => state.groups.conversations[group]
  );

  const typing = useSelector((state: RootState) => state.groups.typing);

  // Handlers
  const handleOnSend = () => {
    let inputs: GroupMessageInput[] = [];
    if (files.length) {
      setSendingLoading(true);
      files.forEach((file: any) => {
        let filePayloadInput: FilePayloadInput = {
          type: "FILE",
          payload: {
            metadata: {
              fileName: file.metadata.fileName,
              fileSize: file.metadata.fileSize,
              fileType: file.metadata.fileType,
            },
            fileType: file.fileType,
            fileBytes: file.fileBytes,
          },
        };
        let groupMessage: GroupMessageInput = {
          groupHash: base64ToUint8Array(groupInfo!.originalGroupEntryHash),
          payloadInput: filePayloadInput,
          sender: Buffer.from(base64ToUint8Array(myAgentId).buffer),
          // TODO: handle replying to message here as well
          replyTo: undefined,
        };
        inputs.push(groupMessage);
      });
    }
    if (message.length) {
      inputs.push({
        groupHash: base64ToUint8Array(groupInfo!.originalGroupEntryHash),
        payloadInput: {
          type: "TEXT",
          payload: { payload: message },
        },
        sender: Buffer.from(base64ToUint8Array(myAgentId).buffer),
        // TODO: handle replying to message here as well
        replyTo: undefined,
      });
    }

    const messagePromises = inputs.map((groupMessage: any) =>
      // TODO: error handling
      dispatch(sendGroupMessage(groupMessage))
    );

    Promise.all(messagePromises).then((sentMessages: GroupMessage[]) => {
      sentMessages.forEach((msg: GroupMessage, i) => {
        setMessages([...messages!, msg.groupMessageEntryHash]);
      });
      setSendingLoading(false);
      chatList.current!.scrollToBottom();
    });
  };

  const handleOnBack = () => {
    history.push({
      pathname: `/home`,
    });
  };

  useEffect(() => {
    // setLoading(true);
    dispatch(fetchId()).then((res: AgentPubKey | null) => {
      if (res) setMyAgentId(Uint8ArrayToBase64(res));
    });
  }, [dispatch]);

  useEffect(() => {
    if (groupData) {
      setGroupInfo(groupData);
      setLoading(false);
    } else {
      dispatch(getLatestGroupVersion(group)).then((res: GroupConversation) => {
        setGroupInfo(res);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  useEffect(() => {
    setLoading(true);
    if (groupData) {
      setMessages([...messages!, ...groupData.messages]);
      setLoading(false);
    } else {
      dispatch(getLatestGroupVersion(group)).then((res: GroupConversation) => {
        setMessages([...messages!, ...res.messages]);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  return !loading && groupInfo && messages ? (
    <IonPage>
      <IonLoading
        isOpen={sendingLoading}
        message={intl.formatMessage({
          id: "app.groups.sending",
        })}
      />
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton
              onClick={() => handleOnBack()}
              className="ion-no-padding"
            >
              <IonIcon slot="icon-only" icon={arrowBackSharp} />
            </IonButton>
            <IonAvatar className="ion-padding">
              {/* TODO: proper picture for default avatar if none is set */}
              {groupInfo ? (
                groupInfo!.avatar ? (
                  <img src={groupInfo!.avatar} alt={groupInfo!.name} />
                ) : (
                  <img
                    className={styles.avatar}
                    src={peopleCircleOutline}
                    color="white"
                    alt={groupInfo!.name}
                  />
                )
              ) : (
                <img src={peopleCircleOutline} alt={groupInfo!.name} />
              )}
            </IonAvatar>
            <IonTitle className="ion-no-padding"> {groupInfo!.name}</IonTitle>
            <IonButton
              onClick={() => {
                history.push(`/g/${groupInfo.originalGroupEntryHash}/info`);
              }}
            >
              <IonIcon slot="icon-only" icon={informationCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {groupData ? (
          <MessageList
            groupId={groupInfo.originalGroupEntryHash}
            myAgentId={myAgentId}
            members={groupInfo!.members}
            messageIds={messages}
            chatList={chatList}
          />
        ) : (
          <IonLoading isOpen={loading} />
        )}
      </IonContent>

      <Typing
        profiles={
          typing[groupInfo.originalGroupEntryHash]
            ? typing[groupInfo.originalGroupEntryHash]
            : []
        }
      />
      <MessageInput
        onSend={handleOnSend}
        onChange={(message) => {
          if (message.length !== 0) {
            dispatch(
              indicateGroupTyping({
                groupId: base64ToUint8Array(groupInfo.originalGroupEntryHash),
                indicatedBy: Buffer.from(base64ToUint8Array(myAgentId).buffer),
                members: [
                  ...groupInfo.members.map((member) =>
                    Buffer.from(base64ToUint8Array(member).buffer)
                  ),
                  Buffer.from(base64ToUint8Array(groupInfo.creator).buffer),
                ],
                isTyping: true,
              })
            );
          } else {
            dispatch(
              indicateGroupTyping({
                groupId: base64ToUint8Array(groupInfo.originalGroupEntryHash),
                indicatedBy: Buffer.from(base64ToUint8Array(myAgentId).buffer),
                members: [
                  ...groupInfo.members.map((member) =>
                    Buffer.from(base64ToUint8Array(member).buffer)
                  ),
                  Buffer.from(base64ToUint8Array(groupInfo.creator).buffer),
                ],
                isTyping: false,
              })
            );
          }
          return setMessage(message);
        }}
        onFileSelect={(files) => setFiles(files)}
      />
    </IonPage>
  ) : (
    <IonLoading isOpen={loading} />
  );
};

export default GroupChat;
