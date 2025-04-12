import { CommandsEnum } from './enum';
import openWebviewCommand from './openWebviewCommand';
import webviewShortcutCommand from './webviewShortcutCommand';

const CommandsMap: Record<CommandsEnum, any> = {
  [CommandsEnum.OPEN_WEBVIEW]: openWebviewCommand,
  [CommandsEnum.EXPLAIN_CODE]: webviewShortcutCommand(
    CommandsEnum.EXPLAIN_CODE,
  ),
  [CommandsEnum.OPTIMIZE_CODE]: webviewShortcutCommand(
    CommandsEnum.OPTIMIZE_CODE,
  ),
  [CommandsEnum.COMMENT_CODE]: webviewShortcutCommand(
    CommandsEnum.COMMENT_CODE,
  ),
};

const registerCommands = (commandsList: string[]) => {
  commandsList.forEach((command) => {
    if (CommandsMap[command]) {
      CommandsMap[command]();
    }
  });
};

export default registerCommands;
