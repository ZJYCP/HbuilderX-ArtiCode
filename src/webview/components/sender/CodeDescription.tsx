import { Chip } from '@heroui/react';
import { FileCode } from 'lucide-react';
import { IFileInfo } from '../../types';

interface CodeDescriptionProps {
  fileInfo: IFileInfo;
}
export default function CodeDescription(props: CodeDescriptionProps) {
  const { fileInfo } = props;
  const content = `${fileInfo.fileName} ${fileInfo.startLine}-${fileInfo.endLine}`;
  return (
    <Chip
      startContent={<FileCode size={14}></FileCode>}
      color="warning"
      variant="faded"
    >
      {content}
    </Chip>
  );
}
