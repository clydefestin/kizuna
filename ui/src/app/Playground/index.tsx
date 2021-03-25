import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChatList, Others, Me } from "../../components/Chat";
import MessageInput from "../../components/MessageInput";

import { FilePayload, Payload } from "../../redux/commons/types";
import { RootState } from "../../redux/types";
import { Uint8ArrayToBase64 } from "../../utils/helpers";

interface DataType {
  author: string;
  timestamp: Date;
  readList: {
    [key: string]: Date;
  };
  payload: Payload;
}

const Playground = () => {
  const { username } = useSelector((state: RootState) => state.profile);
  const [filesToUpload, setFilesToUpload] = useState<FilePayload[]>([]);
  const [data, setData] = useState<DataType[]>([
    {
      author: "neil",
      timestamp: new Date(Date.now() - 86400000 * 2),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello",
        },
      },
      readList: {
        tats: new Date(),
        akira: new Date(),
      },
    },
    {
      author: "akira",
      timestamp: new Date(Date.now() - 86400000 * 2),

      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 1",
        },
      },
      readList: {
        neil: new Date(),
        tats: new Date(),
      },
    },
    {
      author: "neil",
      timestamp: new Date(Date.now() - 86400000 * 2),

      payload: {
        type: "TEXT",
        payload: {
          payload: "hello",
        },
      },
      readList: {
        tats: new Date(),
        akira: new Date(),
      },
    },
    {
      author: "neil",
      timestamp: new Date(Date.now() - 86400000),

      payload: {
        type: "TEXT",
        payload: {
          payload: "hello",
        },
      },
      readList: {
        tats: new Date(),
        akira: new Date(),
      },
    },
    {
      author: "neil",
      timestamp: new Date(Date.now() - 86400000),

      payload: {
        type: "TEXT",
        payload: {
          payload: "hello",
        },
      },
      readList: {
        tats: new Date(),
        akira: new Date(),
      },
    },
    {
      author: "akira",
      timestamp: new Date(Date.now() - 86400000),

      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 1",
        },
      },
      readList: {
        neil: new Date(),
        tats: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "neil",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload:
            "Hello, my name is Neil and this is supposed to be a long ass message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload:
            "Hello, my name is Neil and this is supposed to be a long ass message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "neil",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload:
            "Hello, my name is Neil and this is supposed to be a long ass message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    {
      author: "tats",
      timestamp: new Date(),
      payload: {
        type: "TEXT",
        payload: {
          payload: "hello 3",
        },
      },
      readList: {
        neil: new Date(),
      },
    },
    // {
    //   author: "neil",
    //   timestamp: new Date(),
    //   payload: {
    //     type: "FILE",
    //     payload: {
    //       type: "FILE";
    // fileName: string;
    // fileSize: number;
    // fileType: "IMAGE" | "VIDEO" | "OTHER";
    // fileHash: FileBytesID;
    // thumbnail?: Uint8Array;

    //   },
    // },
  ]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar />
      </IonHeader>
      <IonContent>
        <ChatList type="group">
          {data.map((data, index) => {
            if (data.author === username) return <Me key={index} {...data} />;
            return <Others key={index} {...data} />;
          })}
        </ChatList>
      </IonContent>
      <MessageInput
        onFileSelect={(files) => {
          setFilesToUpload(
            files.map((file) => {
              const fileToAdd: FilePayload = {
                type: "FILE",
                fileName: file.metadata.fileName,
                fileType: file.metadata.fileType,
                fileSize: file.metadata.fileSize,
                fileHash: Uint8ArrayToBase64(file.fileBytes),
                thumbnail: file.fileType!.thumbnail!,
              };
              return fileToAdd;
            })
          );
        }}
        onSend={() => {
          filesToUpload.forEach((file) => {
            setData((currData) => {
              const dataToAdd = {
                author: "neil",
                timestamp: new Date(),
                readList: {
                  tats: new Date(),
                },
                payload: file,
              };
              currData.unshift(dataToAdd);
              return [...currData];
            });
          });
        }}
      />
    </IonPage>
  );
};

export default Playground;
