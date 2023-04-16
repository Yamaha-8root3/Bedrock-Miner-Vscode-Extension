import * as vscode from "vscode";
import * as path from "path";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  RevealOutputChannelOn,
} from "vscode-languageclient/node";
let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  //sample command
  console.log('Congratulations, your extension "addon-tools" is now active!');

  let disposable = vscode.commands.registerCommand("addon-tools.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from MCBE Addon Tools!");
  });
  context.subscriptions.push(disposable);
  //LSP
  /*1.初期化 */
  const serverModule = context.asAbsolutePath(path.join("out", "lsp", "mcfunction.server.js"));
  const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"], cwd: process.cwd() };
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };
  /*2.対象ファイル */
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "plaintext" },
      { scheme: "untitled", language: "plaintext" },
    ],
    diagnosticCollectionName: "sample",
    revealOutputChannelOn: RevealOutputChannelOn.Never,
  };
  /*3.実行 */
  try {
    client = new LanguageClient("Sample LSP Server", serverOptions, clientOptions);
  } catch (err) {
    vscode.window.showErrorMessage("The extension couldn't be started. See the output channel for details.");
    return;
  }
  client.registerProposedFeatures();

  client.start();
}

export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
