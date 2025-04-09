export interface IFileInfo {
  selection: string; // 选择的内容
  fileContent: string; // 整个文件的内容
  fileName: string; // 文件名称
  startLine: number; // 开始行号
  endLine: number; // 结束行号
}
