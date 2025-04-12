import { CommandsEnum } from './enum';

const hx = require('hbuilderx');

const openWebviewCommand = () => {
  hx.commands.registerCommand(CommandsEnum.OPEN_WEBVIEW, () => {
    hx.window.showView({
      viewId: 'articode.webview',
    });
  });
};

export default openWebviewCommand;
