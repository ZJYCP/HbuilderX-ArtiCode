import { Message } from 'ai';
import React from 'react';
import { CircleUserRound } from 'lucide-react';
import MarkdownCom from '../markdown';
import { useUserStore } from '../../store';
import { useMemoizedFn } from 'ahooks';
import { Code } from '@heroui/react';
import { IFileInfo } from '../../types';

interface UserBubbleProps {
  message: Message;
}
export default function UserBubble(props: UserBubbleProps) {
  const { message } = props;
  const { userInfo } = useUserStore();
  const renderCodeFileInfo = useMemoizedFn(() => {
    if (message.annotations && message.annotations.length > 0) {
      const codeFileInfo = message.annotations[0] as unknown as IFileInfo;
      return (
        <div>
          <span>引用了以下代码</span>
          <Code size="sm">
            {`${codeFileInfo.fileName} ${codeFileInfo.startLine}:${codeFileInfo.endLine}`}
          </Code>
        </div>
      );
    } else {
      return null;
    }
  });
  return (
    <div>
      <div className="inline-flex gap-2">
        <CircleUserRound
          style={{ width: '18px', height: '18px' }}
        ></CircleUserRound>
        {userInfo?.email}
      </div>
      <div className="border-t-1 pt-1">
        {renderCodeFileInfo()}
        <MarkdownCom>{message.content}</MarkdownCom>
      </div>
    </div>
  );
}
