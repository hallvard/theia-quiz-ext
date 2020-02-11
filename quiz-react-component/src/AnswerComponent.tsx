import React from 'react';
import { Options, Answer } from './QuizModel'
import { SimpleAnswerComponent } from './SimpleAnswerComponent'
import { OptionsAnswerComponent } from './OptionsAnswerComponent'

type AnswerProps = {
    id: string
    options?: Options
    answer: Answer
    initialValue: any
    answerCallback: (id: string, answer: any) => void
}

export const AnswerComponent = (props: AnswerProps) =>
    props.options
    ? <OptionsAnswerComponent
    id={ props.id }
    options= { props.options }
    answer={ props.answer }
    initialValue={ props.initialValue}
    answerCallback={ props.answerCallback}
    />
    : <SimpleAnswerComponent
    id={ props.id }
    answer={ props.answer }
    initialValue={ props.initialValue}
    answerCallback={ props.answerCallback}
    />
