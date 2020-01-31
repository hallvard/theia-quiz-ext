import * as React from 'react';
import './App.css';
import { Quiz } from './QuizModel'

import { QuizComponent } from './QuizComponent';

class App extends React.Component {
  public render() {
    var quiz : Quiz = {
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
    return (
      <div>
        <h1>Quiz webview</h1>
        <QuizComponent { ...quiz }/>
      </div>
    );
  }
}

export default App;
