import React, { FunctionComponent } from 'react';
import { ContentsComponent } from './ContentsComponent';
import { AnswerComponent } from './AnswerComponent';
import { Quiz, QuizPart, QA } from './QuizModel'

export const QuizComponent : FunctionComponent<Quiz> = (quiz) => {

    var answerCallback = (id: string, answer: any) => {
        console.log(id + ": " + answer);
    };

    var currentValues: { [ key: string ] : any } =  {};
    var partNum = 0
    return <div className="quiz">
        <h2>{quiz.title}</h2>
        {
            quiz.parts.map((part: QuizPart) => {
                var num = 1
                return <div className="QuizPart" key= { "part" + partNum++ }>
                    <h3>{part.title}</h3>
                    {
                        part.qas.map((qa: QA) => {
                        let id = qa.answer.id || ("q" + partNum + "." + num);
                        return <div className="QA" key={ id }>
                                <ContentsComponent contents={ qa.question }></ContentsComponent>
                                <AnswerComponent
                                    id={ id }
                                    options={ qa.options }
                                    answer={ qa.answer }
                                    initialValue= { currentValues[id] }
                                    answerCallback= { answerCallback }
                                    />
                            </div>
                        })
                    }
            </div>
            })
        }
    </div>;
}
