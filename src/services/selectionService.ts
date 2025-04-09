/**
 * 定时更新当前编辑器中的选择内容，编辑器目前没有提供实时的方法
 */

import { start } from 'repl';
import { WebviewMessageType } from '../utils/extType';
import WebBridge from './webBridge';

const hx = require('hbuilderx');
const Interval_MS = 2000;

const getSelection = () => {
  let editorPromise = hx.window.getActiveTextEditor();
  editorPromise.then(async (editor) => {
    let selection = editor.selection;
    let document = editor.document;
    let word = document.getText(selection);
    const startLine = await document.lineFromPosition(selection.start);
    const endLine = await document.lineFromPosition(selection.end);
    WebBridge.getInstance().postMessage({
      type: WebviewMessageType.FILE_INFO,
      data: {
        selection: word, // 选择的内容
        // fileContent: document.getText(), // 整个文件的内容
        fileName: document.fileName.split(/[\\/]/).pop(), // 文件名称
        startLine: startLine.lineNumber, // 开始行号
        endLine: endLine.lineNumber, // 结束行号
      },
    });
  });
};

const selectionService = () => {
  setInterval(() => {
    getSelection();
  }, Interval_MS);
};

export default selectionService;
