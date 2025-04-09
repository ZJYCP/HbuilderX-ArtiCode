import { useSystemStore, useUserStore } from '../store';
import { eventBus } from './eventBus';

export interface WebviewMessageHandler {
  handler(data: any): void;
}

/**
 * 由编辑器传入的token,因为webview插件和编辑器是两个进程，所以需要通过消息传递token.
 * IDE重启后webview里就没状态了
 */
export class TokenHandler implements WebviewMessageHandler {
  handler(data: any) {
    try {
      useUserStore.setState({ token: data });
      localStorage.setItem('token', data);
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * 获取编辑器主题并设置webview主题色
 */
export class ThemeHandler implements WebviewMessageHandler {
  convertColorScheme(colorScheme: string) {
    switch (colorScheme) {
      case 'Monokai':
        return 'monokai';
      case 'Atom One Dark':
        return 'dark';
      default:
        return 'light';
    }
  }
  handler(data: any) {
    const { updateSystemInfo } = useSystemStore();
    updateSystemInfo({
      theme: this.convertColorScheme(data.colorScheme),
    });
  }
}

export class FileInfoHandler implements WebviewMessageHandler {
  handler(data: any) {
    eventBus.emit('fileInfoPost', data);
  }
}
