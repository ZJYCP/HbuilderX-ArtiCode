import { generateId, JSONValue, Message } from 'ai';
import { IFileInfo } from '../types';

export const isDev = process.env.NODE_ENV === 'development';

export const COMMAND_LIST = [
  {
    command: '/clear',
    description: '清除当前会话',
    group: 'common',
  },
  {
    command: '/help',
    description: '学习如何使用',
    group: 'common',
  },
  {
    command: '/doc',
    description: '生成注释',
    group: 'ai',
  },
  {
    command: '/explain',
    description: '解释代码',
    group: 'ai',
  },
];

export const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('复制成功（回退方案）！');
  } catch (err) {
    console.error('回退方案失败:', err);
  }
  document.body.removeChild(textarea);
};

/**
 * 创建新的用户消息
 * @param content 消息内容
 * @param codeInfo 代码信息
 * @returns
 */
export const createNewUserMessage = (content: string, fileInfo?: IFileInfo) => {
  const newMessage: Message = {
    id: generateId(),
    role: 'user',
    content: content,
  };

  if (fileInfo && fileInfo.selection) {
    newMessage.annotations = [fileInfo as unknown as JSONValue];
  }
  return newMessage;
};
