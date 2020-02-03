import * as path from 'path';
import * as vscode from 'vscode';
import { update } from 'tar';

import { Quiz } from './QuizModel'

const defaultQuizPanelState : QuizPanelState = { lastQuizPath: "/quiz-samples/quiz1.json" };

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('quiz.open', () => {
			QuizPanel.createOrShow(context, defaultQuizPanelState);
        })
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(QuizPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
            	QuizPanel.currentPanel = new QuizPanel(webviewPanel, context, state || defaultQuizPanelState);
			}
		});
	}
}

interface QuizPanelState {
    lastQuizPath: string
}

/**
 * Manages cat coding webview panels
 */
class QuizPanel {

    public static currentPanel: QuizPanel | undefined;

	public static readonly viewType = 'quiz';

    private readonly _context: vscode.ExtensionContext
	private readonly _panel: vscode.WebviewPanel;
	private _quizPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(context: vscode.ExtensionContext, state: QuizPanelState) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		if (QuizPanel.currentPanel) {
            QuizPanel.currentPanel._panel.reveal(column);
            QuizPanel.currentPanel.updateState(state);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(QuizPanel.viewType, 'Quiz', column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,
			}
		);

		QuizPanel.currentPanel = new QuizPanel(panel, context, state);
	}

	public constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, state: QuizPanelState) {
        this._context = context;
        this._panel = panel;

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState((_event: any) => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage((message: any) => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
        );
        this._quizPath = state.lastQuizPath;
        this._update();
	}

	public dispose() {
		QuizPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

    public updateState(state: QuizPanelState) {
        this._quizPath = state.lastQuizPath;
        this._update();
    }

    private sampleQuiz : Quiz = {
      title: "My first quiz",
      parts: [
        {
          title: "First part",
          qas: [
            {
              question: [
                  {
                    kind: "text",
                    src: "What is your name?"
                  },
                  {
                    kind: "markdown",
                    src: "Your *first* name, that is!"
                  }
                ],
              answer: {
                kind: "string"
              }
            }
          ]
        }
      ]
    };

	private _update() {
        this._panel.title = this._quizPath
        if (vscode.workspace.rootPath) {
            const workspaceFileUri = vscode.Uri.file(path.join(vscode.workspace.rootPath, this._quizPath));
            vscode.workspace.openTextDocument(workspaceFileUri).then((document) => {
                const quiz: Quiz = JSON.parse(document.getText());
                this._panel.webview.html = this._getHtmlForQuiz(quiz || this.sampleQuiz);                        
            });
        }
	}

    private getExtensionBuildUri(... segments : string[]) {
		const pathOnDisk = vscode.Uri.file(path.join(this._context.extensionPath, 'out', ...segments));
        const uri = pathOnDisk.with({ scheme: 'vscode-resource' });
        return pathOnDisk;
    }

	private _getHtmlForQuiz(quiz: any) {
//		const manifest = require(path.join(this._context.extensionPath, 'build', 'asset-manifest.json'));
		const styleUri = this.getExtensionBuildUri('style.css'); // manifest['main.css']);
		const scriptUri = this.getExtensionBuildUri('index.js'); // manifest['main.js'])
		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
                <title>React App</title>
                <!--
                <link rel="stylesheet" type="text/css" href="${styleUri}">
                -->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${this.getExtensionBuildUri()}/">
			</head>

            <body>
                <verbatim>${JSON.stringify(quiz)}</verbatim>
                <p>${scriptUri}</p>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
