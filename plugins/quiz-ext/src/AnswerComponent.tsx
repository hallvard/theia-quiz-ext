import React, { Component, FormEvent } from 'react';

class AnswerComponent extends Component<AnswerProps, AnswerState> {

    // Before the component mounts, we initialise our state
    componentWillMount() {
        this.setState({ value: this.props.answer.value || "<provide your answer here>"});
    }

    updateState(event: FormEvent<HTMLInputElement>) {
        this.setState({ value: event.currentTarget.value });
    }

    render() {
        return <input type="text" value={ this.state.value } onInput={ this.updateState }></input>
    }
}

type AnswerProps = {
    answer: Answer
}

type AnswerState = {
    value: string
}

export default AnswerComponent;
