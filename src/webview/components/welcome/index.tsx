import { Kbd } from '@heroui/react';
import { Sparkles } from 'lucide-react';
import { eventBus } from '../../utils/eventBus';

export default function WelcomCom() {
  const functionItem = (title: string, desc: string) => {
    return (
      <div
        className="flex flex-col gap-1 items-start p-2  rounded bg-primary-500  cursor-pointer"
        onClick={() => {
          eventBus.emit('insert-input', desc, true);
        }}
      >
        <section>
          <span className="mr-2">
            <Sparkles className="text-pink-500 inline w-4 h-4"></Sparkles>
          </span>
          <span className="font-bold">{title}</span>
        </section>
        <span className="text-sm">{desc}</span>
      </div>
    );
  };

  return (
    <div className="flex-1  p-4  ">
      {/* 用户名和描述 */}
      <div className="mb-2 text-lg font-semibold">
        <h2>嗨</h2>
        <p>有什么可以帮你的</p>
      </div>

      {/* AI 搜索提示 */}
      <div className="mb-4 text-base  ">
        <p>你的 AI 编程助手，使用快捷键</p>
        <p>
          <Kbd keys={['command']}>U</Kbd>来与我对话吧！
        </p>
      </div>

      <div className="space-y-2">
        {functionItem('生成代码', '生成一个冒泡排序算法')}
        {functionItem('解释代码', '/explain 解释一下当前选中函数的功能')}
        {functionItem('注释代码', '/doc 为当前选中函数添加注释')}
        {functionItem('生成单测', '/test 为选中的函数生成单测')}
      </div>

      {/* 帮助链接 */}
      <div className="mt-4 ">
        <a href=" " className="text-base hover:underline">
          输入 /help 查更多参考说明
        </a>
      </div>
    </div>
  );
}
