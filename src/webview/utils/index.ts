export const isDev = !window.hasOwnProperty('hbuilderx');

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
