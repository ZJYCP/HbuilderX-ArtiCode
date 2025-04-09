import { useChat } from '@ai-sdk/react';
import SenderCom from '../../components/sender';
import BubbleList from '../../components/bubbleList';
import { HOST } from '../../../utils';
import WelcomCom from '../../components/welcome';
import { useSystemStore } from '../../store';
import { useEffect, useState } from 'react';
import { eventBus } from '../../utils/eventBus';
import { IFileInfo } from '../../types';
import { createNewUserMessage } from '../../utils';

export default function HomePage() {
  const { providerId } = useSystemStore();
  const [fileInfo, setFileInfo] = useState<IFileInfo | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
    append,
    stop,
  } = useChat({
    api: `${HOST}/llm/chat`,
    onError: (err) => {
      console.log('error', err);
    },
    sendExtraMessageFields: true,
    body: {
      providerId: providerId,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  useEffect(() => {
    const handler = () => {
      setMessages([]);
    };
    eventBus.on('new-chat', handler);
    return () => {
      eventBus.off('new-chat', handler);
    };
  }, [setMessages]);

  useEffect(() => {
    const hander = (data: string, sendImmediate: boolean = true) => {
      if (sendImmediate) {
        const newMessage = createNewUserMessage(data, fileInfo);
        append(newMessage);
      } else {
        handleInputChange({
          target: {
            value: data,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    eventBus.on('insert-input', hander);
    return () => {
      eventBus.off('insert-input', hander);
    };
  }, [handleInputChange]);

  useEffect(() => {
    eventBus.on('fileInfoPost', (fileInfo: IFileInfo) => {
      if (fileInfo && fileInfo.selection) {
        setFileInfo(fileInfo);
      } else {
        setFileInfo(null);
      }
    });
  }, []);

  return (
    <>
      {messages.length === 0 ? (
        <WelcomCom></WelcomCom>
      ) : (
        <BubbleList messages={messages} status={status}></BubbleList>
      )}
      <SenderCom
        content={input}
        status={status}
        fileInfo={fileInfo}
        append={append}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setMessages={setMessages}
      ></SenderCom>
    </>
  );
}
