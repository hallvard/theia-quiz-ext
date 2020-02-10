export interface Quiz {
    title: string
    parts: QuizPart[]
}

export interface QuizPart {
    title: string
    qas: QA[]
}

export interface QA {
    question: Content[]
    options?: Options
    answer: Answer
}

export type Content = TextContent | MarkdownContent | Answer;

interface AbstractContent<K extends string> {
    kind: K
}

export interface TextContent extends AbstractContent<"text"> {
    src: string
}

export interface MarkdownContent extends AbstractContent<"markdown"> {
    src: string
}

interface Multiplicity {
    lower?: number
    upper?: number
}

export interface Options extends Multiplicity {
    options: Content[]
}    

export type Answer = StringAnswer | BooleanAnswer | NumberAnswer
    | OptionsAnswer;

interface AbstractAnswer<K extends string> extends AbstractContent<K> {
    id?: string
}

interface SimpleAnswer<T, K extends string> extends AbstractAnswer<K> {
    value?: T
}

export interface StringAnswer extends SimpleAnswer<string, "string"> {
    regex?: string
}
export interface BooleanAnswer extends SimpleAnswer<Boolean, "boolean"> {}
export interface NumberAnswer extends SimpleAnswer<Number, "number">, Multiplicity {}

export interface OptionsAnswer extends AbstractAnswer<"options"> {
    optionNums: number[]
}
