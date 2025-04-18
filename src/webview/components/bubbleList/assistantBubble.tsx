import { Message } from 'ai';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Brain } from 'lucide-react';
import MarkdownCom from '../markdown';
import { useMemoizedFn } from 'ahooks';

interface AssistantBubbleProps {
  message: Message;
}
export default function AssistantBubble(props: AssistantBubbleProps) {
  const { message } = props;

  const renderContent = useMemoizedFn((content) => {
    return <MarkdownCom>{content}</MarkdownCom>;
  });

  const renderReasoning = useMemoizedFn((reasoning) => {
    return (
      <Accordion isCompact variant="bordered">
        <AccordionItem key="1" aria-label="深度思考" title="深度思考">
          {reasoning}
        </AccordionItem>
      </Accordion>
    );
  });

  return (
    <div>
      <div className="inline-flex gap-2">
        <Brain style={{ width: '18px', height: '18px' }}></Brain>
        ArtiCode
      </div>
      <div className="border-t-1 pt-1">
        {message.parts?.map((item) => {
          if (item.type === 'reasoning') {
            return renderReasoning(item.reasoning);
          }
          if (item.type === 'text') {
            return renderContent(item.text);
          }
        })}
      </div>
    </div>
  );
}
