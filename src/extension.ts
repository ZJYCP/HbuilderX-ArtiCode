import { registerGenerateCodeCommand } from './commands/registerGenerateCodeCommand';
import { registerWebView } from './commands/registerWebview';
import registerServices from './services';
//该方法将在插件激活的时候调用
async function activate(context: { subscriptions: any[] }) {
  registerWebView(context);

  registerGenerateCodeCommand(context);

  registerServices();
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
