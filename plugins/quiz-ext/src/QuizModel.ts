interface Quiz {
    title: string
    parts: QuizPart[]
}

interface QuizPart {
    title: string
    qas: QA[]
}

interface QA {
    question: Question
    answer: Answer
}

interface Question {
    type: string
}

interface TextQuestion extends Question {
    lang: string
    src: string
}

interface Answer {
    type: string
    value?: any
}
