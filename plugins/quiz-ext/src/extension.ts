import * as path from 'path';
import * as vscode from 'vscode';
import { update } from 'tar';

const defaultQuizPanelState : QuizPanelState = { lastQuizPath: "/samples/test.quiz" };

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

    private readonly sampleQuiz: Quiz = {
        title: "Gitpod test",
        parts: [
            {
                title: "Part 1",
                qas: [
                    {
                        question: {
                            type: "text",
                            lang: "markdown",
                            src: "Isn't gitpod amazing?"
                        } as TextQuestion,
                        answer: {
                            type: "boolean",
                            value: undefined
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

	private _getHtmlForQuiz(quiz: any) {
		return `<!DOCTYPE html>
<html>
    <head>
        <title>Game</title>
        <meta charset="UTF-8"/>
        <link rel="stylesheet" href="Quiz.css">
        <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        <script src="../out/QuizComponent"></script>
    </head>
    <body>
        <div id="quizElement"></div>
        <script type="text/javascript">
        var quiz = ${quiz};
        ReactDOM.render(React.createElement(QuizComponent, quiz), document.getElementById('quizElement'));
        </script>
    </body>
</html>`;
	}
}
