import * as React from 'react';
import { Content } from './QuizModel';
import * as commonmark from 'commonmark';

export const ContentsComponent = (props: ContentsProps) => <div className="contents">
    {
        props.contents.map(renderContent)
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
        case "string": return content.value
        case "boolean": return (content.value ? "yes" : "no")
        case "number": return content.value
    }
}

type ContentsProps = {
    contents : Content[]
}
