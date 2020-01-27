import React, { FunctionComponent } from 'react';
import QuestionComponent from './QuestionComponent';
import AnswerComponent from './AnswerComponent';

export const QuizComponent : FunctionComponent<Quiz> = (quiz) => <div className="quiz">
    <h2>{quiz.title}</h2>
    {
        quiz.parts.map((part: QuizPart) => <div className="quizPart">
            <h3>{part.title}</h3>
            {
                part.qas.map((qa: QA) => <div className="qa">
                    <QuestionComponent question={ qa.question }></QuestionComponent>
                    <AnswerComponent answer={ qa.answer }></AnswerComponent>
                </div>)
            }
        </div>)
    }
</div>;
