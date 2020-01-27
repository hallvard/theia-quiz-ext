import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('quiz.open', () => {
			QuizPanel.createOrShow({ lastQuizPath: "/samples/test.quiz"});
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(QuizPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
				QuizPanel.revive(webviewPanel, state as QuizPanelState);
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

	private readonly _panel: vscode.WebviewPanel;
	private readonly _quizPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(state: QuizPanelState) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		if (QuizPanel.currentPanel) {
			QuizPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(QuizPanel.viewType, 'Quiz', column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,
			}
		);

		QuizPanel.currentPanel = new QuizPanel(panel, state);
	}

	public static revive(panel: vscode.WebviewPanel, state: QuizPanelState) {
		QuizPanel.currentPanel = new QuizPanel(panel, state);
	}

	private constructor(panel: vscode.WebviewPanel, state: QuizPanelState) {
		this._panel = panel;
		this._quizPath = state.lastQuizPath;

		// Set the webview's initial html content
		this._update();

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

	private _update() {
        this._panel.title = this._quizPath
        const webview = this._panel.webview;
        webview.html = this._getHtmlForQuiz({
            title: "Gitpod test",
            parts: [
                {
                    title: "Part 1",
                    qas: [
                        {
                            q: {
                                type: "text",
                                lang: "markdown",
                                src: "Isn't gitpod amazing?"
                            },
                            a: {
                                type: "boolean",
                                value: undefined
                            }
                        }
                    ]
                }
            ]
        });
	}

	private _getHtmlForQuiz(quiz: any) {
		return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${quiz.title}</title>
            </head>
            <body>
                <h1>${quiz.title}</h1>
            </body>
            </html>`;
	}
}
