import { CommandsEnum } from './enum';
import openWebviewCommand from './openWebviewCommand';

const CommandsMap: Record<CommandsEnum, any> = {
  [CommandsEnum.OPEN_WEBVIEW]: openWebviewCommand,
};

const registerCommands = (commandsList: string[]) => {
  commandsList.forEach((command) => {
    if (CommandsMap[command]) {
      CommandsMap[command]();
    }
  });
};

export default registerCommands;
