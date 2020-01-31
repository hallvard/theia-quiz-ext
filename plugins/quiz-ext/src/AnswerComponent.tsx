import React, { FormEvent } from 'react';
import { Answer } from './QuizModel'

export class AnswerComponent extends React.Component<AnswerProps, AnswerState> {

    // Before the component mounts, we initialise our state
    componentWillMount() {
        this.setState({ value: getAnswerAsString(this.props.answer) || ""});
    }

    updateState(newValue: string) {
        console.log("value: " + newValue);
        updateAnswerFromString(this.props.answer, newValue);
        this.setState({ value: newValue });
    }

    render() {
        var comp: AnswerComponent = this;
        return <input type="text"
                    value={ this.state.value }
                    onChange={(event) => comp.updateState(event.target.value)}
                />
    }
}

function updateAnswerFromString(answer: Answer, value: string) {
    console.log("Answer: " + answer + " = " + value);
    switch (answer.kind) {
        case "string": answer.value = value; break;
        case "boolean": answer.value = (value == "yes"); break;
        case "number": answer.value = Number(value); break;
    }
}

function getAnswerAsString(answer: Answer) : string | undefined {
    switch (answer.kind) {
        case "string": return answer.value;
        case "boolean": return answer.value ? "yes" : "no";
        case "number": return answer.value !== undefined && answer.value !== NaN ? "" + answer.value : undefined;
    }
}

type AnswerProps = {
    answer: Answer
}

type AnswerState = {
    value: string
}
