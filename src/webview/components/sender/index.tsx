import React, { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Textarea,
} from '@heroui/react';
import { CircleStop, SendHorizontal } from 'lucide-react';
import { useMemoizedFn } from 'ahooks';
import cx from 'classnames';
import CommandTip from './CommandTip';
import { COMMAND_LIST, createNewUserMessage } from '../../utils';
import { useUserStore } from '../../store';
import useSendMessage from '../../hooks/useSendMessage';
import { ExtMessageType } from '../../../utils/extType';
import ModelSelectCom from './ModelSelectCom';
import { eventBus } from '../../utils/eventBus';
import CodeDescription from './CodeDescription';
import { IFileInfo } from '../../types';
import { generateId, Message } from 'ai';

interface SenderComProps {
  content: string;
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  fileInfo: IFileInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: any, options: any) => void;
  setMessages: (messages: any[]) => void;
  append: (message: Message) => void;
  stop: () => void;
}

export default function SenderCom(props: SenderComProps) {
  const {
    status,
    content,
    fileInfo,
    handleInputChange,
    handleSubmit,
    setMessages,
    append,
    stop,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { token, userInfo } = useUserStore();
  const { sendHandler } = useSendMessage();

  const submitForbidden = useMemo(() => {
    return status === 'submitted' || status === 'streaming';
  }, [status]);

  const handleInput = useMemoizedFn(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      let matched = false;

      for (let i = 0; i < COMMAND_LIST.length; i++) {
        const keyword = COMMAND_LIST[i].command;
        if (
          inputValue &&
          inputValue.length <= keyword.length &&
          keyword.startsWith(inputValue)
        ) {
          matched = true;
          break;
        }
      }
      setIsOpen(matched);
      handleInputChange(e);
    },
  );

  const stopMessage = useMemoizedFn(() => {
    if (submitForbidden) {
      stop();
    }
  });
  const doSubmit = useMemoizedFn(() => {
    if (submitForbidden) {
      return;
    }
    if (token && userInfo) {
      const newMessage = createNewUserMessage(content, fileInfo);
      append(newMessage);
      handleInputChange({
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>);
      // handleSubmit();
    } else {
      sendHandler({
        type: ExtMessageType.SHOW_INFORMATION,
        data: {
          message: '请先登录',
        },
      });
    }
  });
  const handelKeyDown = useMemoizedFn(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          doSubmit();
        }
      }
    },
  );

  const renderInput = useMemoizedFn(() => {
    return (
      <div>
        <Textarea
          value={content}
          onChange={handleInput}
          onKeyDown={handelKeyDown}
          minRows={1}
          maxRows={12}
          variant="bordered"
          label={
            fileInfo ? (
              <CodeDescription fileInfo={fileInfo}></CodeDescription>
            ) : undefined
          }
          classNames={{
            inputWrapper: 'border-none text-sm my-2',
          }}
          placeholder="输入问题， Shift+Enter换行/Enter发送"
        />

        <div className="flex justify-between my-2 mx-2 text-xs">
          <ModelSelectCom></ModelSelectCom>
          <div className="flex gap-2">
            <span></span>
            {submitForbidden ? (
              <CircleStop
                className="size-4 cursor-pointer"
                onClick={stopMessage}
              ></CircleStop>
            ) : (
              <SendHorizontal
                className={'size-4 cursor-pointer'}
                onClick={doSubmit}
              />
            )}
          </div>
        </div>
      </div>
    );
  });

  const handleCommandClick = useMemoizedFn((command: string) => {
    if (command === '/clear') {
      eventBus.emit('new-chat');
    }
  });
  return (
    <div className="border-gray-300 bg-primary-400 rounded-md m-2 relative">
      {/* 还需要完善,先不开放 */}
      {/* {isOpen && <CommandTip onCommandClick={handleCommandClick}></CommandTip>} */}
      {renderInput()}
    </div>
  );
}
