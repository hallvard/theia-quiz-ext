import * as React from 'react';
import { Content } from './QuizModel';
import * as commonmark from 'commonmark';

export const ContentsComponent = (props: ContentsProps) => {
    var num = 0;
    return <div className="contents">
            {
                props.contents.map((content) => renderContent("key" + num++, content))
            }
        </div>;
}

function renderContent(key: string, content: Content)  {
    switch (content.kind) {
        case "text": return <div key={ key } className="TextContents">{ content.src }</div>
        case "markdown": {
            var ast = new commonmark.Parser().parse(content.src);
            var html = new commonmark.HtmlRenderer().render(ast);
            return <div key={ key } className="MarkdownContents" dangerouslySetInnerHTML={{ __html: html }}/>;
        }
        case "string": return content.value
        case "boolean": return (content.value ? "yes" : "no")
        case "number": return content.value
    }
}

type ContentsProps = {
    contents : Content[]
}
