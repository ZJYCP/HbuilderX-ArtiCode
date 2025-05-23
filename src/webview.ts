const path = require('path');

/**
 * @description 显示webview
 */

export class ArtiCodeViewProvider {
  public webview: any;
  constructor(webviewPanel: any) {
    // this._extensionUri = extensionUri
    this.resolveWebviewView(webviewPanel);
  }

  resolveWebviewView(webviewPanel: any) {
    this.webview = webviewPanel.webView;
    const scriptPath = path.join(__dirname, 'webview/bundle.js');
    this.webview.html = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <title>ArtiCode</title>
      <script defer="defer" src="${scriptPath}"></script>
    </head>
    <body>
      <div id="root"></div>

    </body>
    </html>
  `;
  }
}
