import React, { FunctionComponent } from 'react';
import { ContentsComponent } from './ContentsComponent';
import { AnswerComponent } from './AnswerComponent';
import { Quiz, QuizPart, QA } from './QuizModel'

export const QuizComponent : FunctionComponent<Quiz> = (quiz) => {
    var num = 0
    return <div className="quiz">
        <h2>{quiz.title}</h2>
        {
            quiz.parts.map((part: QuizPart) => <div className="quizPart">
                <h3>{part.title}</h3>
                {
                    part.qas.map((qa: QA) => <div className="qa">
                        <ContentsComponent contents={ qa.question }></ContentsComponent>
                        <AnswerComponent id={ "id" + num} options={ qa.options } answer={ qa.answer }></AnswerComponent>
                    </div>)
                }
            </div>)
        }
    </div>;
}
