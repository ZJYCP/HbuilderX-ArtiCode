import React, { useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Textarea,
} from '@heroui/react';
import { SendHorizontal } from 'lucide-react';
import { useMemoizedFn } from 'ahooks';
import cx from 'classnames';
import CommandTip from './CommandTip';
import { COMMAND_LIST } from '../../utils';
import { useUserStore } from '../../store';
import useSendMessage from '../../hooks/useSendMessage';
import { ExtMessageType } from '../../../utils/extType';
import ModelSelectCom from './ModelSelectCom';

interface SenderComProps {
  content: string;
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  setMessages: (messages: any[]) => void;
}

export default function SenderCom(props: SenderComProps) {
  const { status, content, handleInputChange, handleSubmit, setMessages } =
    props;
  const [isOpen, setIsOpen] = React.useState(false);
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

  const doSubmit = useMemoizedFn(() => {
    if (token && userInfo && !submitForbidden) {
      handleSubmit();
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
          classNames={{
            inputWrapper: 'border-none text-sm my-2',
          }}
          // label={<div>label</div>}
          placeholder="输入问题， Shift+Enter换行/Enter发送"
        />

        <div className="flex justify-between my-2 mx-2 text-xs">
          <ModelSelectCom></ModelSelectCom>
          <div className="flex gap-2">
            <span></span>
            <SendHorizontal
              className={cx(
                'size-4',
                submitForbidden ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              onClick={doSubmit}
            />
          </div>
        </div>
      </div>
    );
  });

  const handleCommandClick = useMemoizedFn((command: string) => {
    if (command === '/clear') {
      setMessages([]);
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
