import { UIMessage } from 'ai';
import React, { useEffect, useRef, useState } from 'react';
import UserBubble from './userBubble';
import AssistantBubble from './assistantBubble';
import { Spinner } from '@heroui/react';

interface BubbleListProps {
  messages: UIMessage[];
  status: string;
}

export default function BubbleList(props: BubbleListProps) {
  const { messages, status } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastMessageCount = useRef(messages.length);

  // 处理滚动行为
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // 如果用户手动滚动到非底部，则停止自动滚动
      setAutoScroll(scrollHeight - (scrollTop + clientHeight) < 30);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 自动滚动逻辑
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // 每轮回答结束后重置自动滚动
  useEffect(() => {
    if (messages.length !== lastMessageCount.current) {
      if (status !== 'submitted') {
        setAutoScroll(true);
      }
      lastMessageCount.current = messages.length;
    }
  }, [messages.length, status]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto border-b-1 border-gray-600 text-sm"
    >
      {messages.map((message) => (
        <div key={message.id} className="bg-primary m-2 rounded p-2">
          {message.role === 'user' ? (
            <UserBubble message={message}></UserBubble>
          ) : (
            <AssistantBubble message={message}></AssistantBubble>
          )}
        </div>
      ))}
      {status === 'submitted' && (
        <div className="flex justify-center items-center h-[50px]">
          <Spinner size="sm" color="success" />
        </div>
      )}
    </div>
  );
}
