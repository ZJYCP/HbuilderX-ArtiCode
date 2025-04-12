import { isDev } from '.';
import { IWebviewMessage, WebviewMessageType } from '../../utils/extType';
import {
  FileInfoHandler,
  IdeCommandHandler,
  TokenHandler,
  WebviewMessageHandler,
} from './receiveStrategy';

class MessageListener {
  handlers: Map<WebviewMessageType, WebviewMessageHandler> = new Map();

  static instance: MessageListener | null;
  constructor() {
    this.registerHandlers();
  }

  public static getInstance() {
    if (MessageListener.instance === null) {
      MessageListener.instance = new MessageListener();
    }

    return MessageListener.instance;
  }

  public registerHandlers() {
    this.handlers.set(WebviewMessageType.TOKEN, new TokenHandler());
    this.handlers.set(WebviewMessageType.FILE_INFO, new FileInfoHandler());
    this.handlers.set(WebviewMessageType.IDE_COMMAND, new IdeCommandHandler());
  }

  start() {
    if (!isDev) {
      try {
        // @ts-ignore
        window.hbuilderx.onDidReceiveMessage((msg: IWebviewMessage) => {
          console.log('webview: 接收到', msg);
          const handler = this.handlers.get(msg.type);
          if (handler) {
            handler.handler(msg.data);
          } else {
            console.warn('未找到对应的handler', msg.type);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default new MessageListener();
