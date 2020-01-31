import * as React from 'react';
import { Content, TextContent, MarkdownContent } from './QuizModel';
import * as commonmark from 'commonmark';

export const ContentsComponent = (props: QuestionProps) => <div className="question">
    {
        props.question.map(renderContent)
    }
</div>;

function renderContent(content: Content)  {
    switch (content.kind) {
        case "text": return <p>{ content.src }</p>
        case "markdown": {
            var ast = new commonmark.Parser().parse(content.src);
            var html = new commonmark.HtmlRenderer().render(ast);
            return <div dangerouslySetInnerHTML={{ __html: html }}/>;
        }
    }
}

type QuestionProps = {
    question : Content[]
}
