import * as React from 'react';

const QuestionComponent = (props: QuestionProps) => <div className="question">
    {
        (props.question as TextQuestion).src
    }
</div>;

type QuestionProps = {
    question : Question
}

export default QuestionComponent;
