import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Quiz } from './QuizModel';
import { QuizComponent } from './QuizComponent';

// declare var acquireVsCodeApi: any;
// const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    if ('model' in event.data) {
        ReactDOM.render(
            <div>
                <p>Quiz</p>
                <QuizComponent { ...event.data.model as Quiz }/>
            </div>,
            document.getElementById('root') as HTMLElement
        );
//        vscode.postMessage(message);
    }
});
