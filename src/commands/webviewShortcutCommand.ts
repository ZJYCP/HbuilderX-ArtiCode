import WebBridge from '../services/webBridge';
import { WebviewMessageType } from '../utils/extType';
import { CommandsEnum } from './enum';

const hx = require('hbuilderx');

const IdeCommandHandler = (command: CommandsEnum, message: string) => {
  hx.commands.registerCommand(command, () => {
    // hx.window.showView({
    //   viewId: 'articode.webview',
    // });
    WebBridge.getInstance().postMessage({
      type: WebviewMessageType.IDE_COMMAND,
      data: message,
    });
  });
};

const webviewShortcutCommand = (command: CommandsEnum) => {
  console.log('注册命令', command);
  switch (command) {
    case CommandsEnum.OPTIMIZE_CODE:
      return IdeCommandHandler(CommandsEnum.OPTIMIZE_CODE, '优化此代码');
    case CommandsEnum.EXPLAIN_CODE:
      return IdeCommandHandler(CommandsEnum.EXPLAIN_CODE, '解释此代码');
    case CommandsEnum.COMMENT_CODE:
      return IdeCommandHandler(CommandsEnum.COMMENT_CODE, '为此代码添加注释');
    default:
      return () => {};
  }
};

export default webviewShortcutCommand;
