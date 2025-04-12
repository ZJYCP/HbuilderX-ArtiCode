import { CommandsEnum } from './enum';

const hx = require('hbuilderx');

const openWebviewCommand = () => {
  hx.commands.registerCommand(CommandsEnum.OPEN_WEBVIEW, () => {
    hx.window.showInformationMessage('Hello My First Extension.');

    hx.window.showView({
      viewId: 'articode.webview',
    });
  });
};

export default openWebviewCommand;
