import { useChat } from '@ai-sdk/react';
import SenderCom from '../../components/sender';
import BubbleList from '../../components/bubbleList';
import { HOST } from '../../../utils';
import WelcomCom from '../../components/welcome';
import { useSystemStore } from '../../store';
import { useEffect } from 'react';
import { eventBus } from '../../utils/eventBus';

export default function HomePage() {
  const { providerId } = useSystemStore();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
    stop,
  } = useChat({
    api: `${HOST}/llm/chat`,
    onError: (err) => {
      console.log('error', err);
    },
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
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setMessages={setMessages}
      ></SenderCom>
    </>
  );
}
