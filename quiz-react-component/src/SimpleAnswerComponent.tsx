import React from 'react';
import { Answer } from './QuizModel'

type SimpleAnswerProps = {
    id: string
    answer: Answer
    initialValue: any
    answerCallback: (id: string, answer: any) => void
}

type SimpleAnswerState = {
    value: any
}

export class SimpleAnswerComponent extends React.Component<SimpleAnswerProps, SimpleAnswerState> {

    constructor (props: SimpleAnswerProps) {
        super(props);
        this.state = { value: props.initialValue };
    }

    updateState(newValue: any) {
        this.props.answerCallback(this.props.id, newValue);
        this.setState({ value: newValue });
    }

    render() {
        var comp: SimpleAnswerComponent = this;
        return <input type="text"
                    value={ this.state.value }
                    onChange={(event) => comp.updateState(event.target.value)}
                />
    }
}
