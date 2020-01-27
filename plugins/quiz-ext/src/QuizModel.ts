interface Quiz {
    title: string
    parts: QuizPart[]
}

interface QuizPart {
    title: string
    qas: QA[]
}

interface QA {
    q: Q
}

interface Q {
    type: string
}

interface TextQ extends Q {
    lang: string
    src: string
}

interface A {
    type: string
    value: any
}
