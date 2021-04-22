import { IonContent, IonIcon, IonLabel, IonList, IonLoading } from "@ionic/react";
import { sadOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  FilePayload,
  isTextPayload,
  Payload,
} from "../../../../../redux/commons/types";
import { getNextBatchGroupMessages } from "../../../../../redux/group/actions";
import {
  GroupMessageBatchFetchFilter,
  GroupMessagesOutput,
  GroupMessage,
} from "../../../../../redux/group/types";
import {
  base64ToUint8Array,
  monthToString,
  useAppDispatch,
} from "../../../../../utils/helpers";
import FileIndex from "./FileIndex";

interface Props {
  groupId: string;
  fileMessages: GroupMessage[];
}

const File: React.FC<Props> = ({ groupId, fileMessages }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const [indexedFileMessages, setIndexedFileMessages] = useState<{
    [key: string]: GroupMessage[];
  }>({});

  const indexMedia: (
    fileMessages: GroupMessage[]
  ) => {
    [key: string]: GroupMessage[];
  } = (fileMessages) => {
    let indexedFiles: {
      [key: string]: GroupMessage[];
    } = {};
    if (fileMessages.length > 0) {
      let monthNumber = new Date(
        fileMessages[0].timestamp[0] * 1000
      ).getMonth();
      let month = monthToString(monthNumber, intl)!;
      indexedFiles[month] = [];
      fileMessages.forEach((fileMessage: GroupMessage) => {
        const currMonth = monthToString(
          new Date(fileMessage.timestamp[0] * 1000).getMonth(),
          intl
        );
        if (currMonth !== month) {
          month = currMonth!;
          indexedFiles[month] = [];
        }
        const currArr = indexedFiles[currMonth!];
        const payload: Payload = fileMessage.payload;
        if (!isTextPayload(payload) && payload.fileType === "OTHER") {
          currArr.push(fileMessage);
        }
      });
    }
    return indexedFiles;
  };

  useEffect(() => {
    if (fileMessages) {
      const indexedMedia: {
        [key: string]: GroupMessage[];
      } = indexMedia(fileMessages);
      setIndexedFileMessages(indexedMedia);
      setLoading(false);
    } else {
      let filter: GroupMessageBatchFetchFilter = {
        groupId: base64ToUint8Array(groupId),
        batchSize: 10,
        payloadType: { type: "FILE", payload: null },
      };
      dispatch(getNextBatchGroupMessages(filter)).then(
        (res: GroupMessagesOutput) => {
          let fileMessages: (GroupMessage | undefined)[] = Object.keys(
            res.groupMessagesContents
          ).map((key: any) => {
            if (!isTextPayload(res.groupMessagesContents[key].payload)) {
              let message = res.groupMessagesContents[key];
              return message;
            } else {
              return undefined;
            }
          });

          let fileMessagesCleaned = fileMessages.flatMap(
            (x: GroupMessage | undefined) => (x ? [x] : [])
          );

          const indexedMedia: {
            [key: string]: GroupMessage[];
          } = indexMedia(fileMessagesCleaned);
          setIndexedFileMessages(indexedMedia);
          setLoading(false);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loading ? (
    (Object.keys(indexedFileMessages).length !== 0) ? (<IonContent>
      <IonList>
        {Object.keys(indexedFileMessages).map((month: string) => {
          const fileMessages = indexedFileMessages[month];
          let files: FilePayload[] = [];
          fileMessages.forEach((fileMessage: GroupMessage) => {
            if (!isTextPayload(fileMessage.payload)) {
              files.push(fileMessage.payload);
            }
          });

          return (
            <FileIndex
              onCompletion={() => {
                return true;
              }}
              key={month}
              index={month}
              fileMessages={fileMessages}
              files={files}
            />
          );
        })}
      </IonList>
    </IonContent>) : (
      <IonContent>
        <IonIcon icon={sadOutline} />
        <IonLabel className="ion-padding ion-margin-bottom ">
          {intl.formatMessage({
            id: "app.groups.files.no-files",
          })}
        </IonLabel>
      </IonContent>
    )) : (
    <IonLoading isOpen={loading} />
  );
};

export default File;
