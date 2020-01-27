"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('quiz.open', () => {
        QuizPanel.createOrShow({ lastQuizPath: "/samples/test.quiz" });
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(QuizPanel.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(`Got state: ${state}`);
                    QuizPanel.revive(webviewPanel, state);
                });
            }
        });
    }
}
exports.activate = activate;
/**
 * Manages cat coding webview panels
 */
class QuizPanel {
    constructor(panel, state) {
        this._disposables = [];
        this._panel = panel;
        this._quizPath = state.lastQuizPath;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState((_event) => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(state) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (QuizPanel.currentPanel) {
            QuizPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(QuizPanel.viewType, 'Quiz', column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
        });
        QuizPanel.currentPanel = new QuizPanel(panel, state);
    }
    static revive(panel, state) {
        QuizPanel.currentPanel = new QuizPanel(panel, state);
    }
    dispose() {
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
    _update() {
        this._panel.title = this._quizPath;
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
    _getHtmlForQuiz(quiz) {
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
QuizPanel.viewType = 'quiz';
//# sourceMappingURL=extension.js.map