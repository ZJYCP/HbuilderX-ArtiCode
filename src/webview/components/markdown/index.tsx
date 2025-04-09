import React, { useMemo, memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  materialDark,
  solarizedlight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import PreCom from './PreCom';
import { useSystemStore } from '../../store';
import styles from './index.module.scss';
import cx from 'classnames';

const CodeBlock = memo(({ children, className, codeStyle }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  return match ? (
    <SyntaxHighlighter
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
      language={match[1]}
      style={codeStyle}
      customStyle={{ background: 'hsl(var(--heroui-primary-700))' }}
    />
  ) : (
    <code className={className}>{children}</code>
  );
});

const MarkdownCom = memo((props: any) => {
  const { systemInfo } = useSystemStore();

  const codeStyle = useMemo(() => {
    switch (systemInfo.theme) {
      case 'dark':
        return materialDark;
      case 'light':
        return solarizedlight;
      case 'monokai':
        return materialDark;
      default:
        return materialDark;
    }
  }, [systemInfo.theme]);

  return (
    <Markdown
      children={props.children}
      // remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children }) => (
          <pre className={cx('bg-primary-700 rounded', styles.markdownWrapper)}>
            <PreCom>{children}</PreCom>
            {children}
          </pre>
        ),
        code: (props) => <CodeBlock {...props} codeStyle={codeStyle} />,
        // code: () => <span>2</span>,
      }}
      skipHtml
      unwrapDisallowed
    />
  );
});

export default MarkdownCom;
