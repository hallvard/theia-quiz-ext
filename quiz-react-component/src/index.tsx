import React from 'react';
import ReactDOM from 'react-dom';
import { Quiz } from './QuizModel';
import { QuizComponent } from './QuizComponent';
import * as serviceWorker from './serviceWorker';

const sample: Quiz = {
    "title": "My first quiz",
    "parts": [
        {
            "title": "First part",
            "qas": [
                {
                    "question": [
                        { "kind": "text", "src": "What is your name?"},
                        { "kind": "markdown", "src": "Your *first* name, that is!" }
                    ],
                    "answer": { "kind": "string" }
                },
                {
                    "question": [
                        { "kind": "text", "src": "Which of these is a prog.lang?" }
                    ],
                    "options": {
                        "options": [
                            { "kind": "string", "value": "Canonball" },
                            { "kind": "string", "value": "Snobol" },
                            { "kind": "string", "value": "Bool" }
                        ],
                        "upper": 1
                    },
                    "answer": {
                        "id": "q12",
                        "kind": "options",
                        "optionNums": [1]
                    }
                }
            ]
        }
    ]
};

ReactDOM.render(<QuizComponent {...sample} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
