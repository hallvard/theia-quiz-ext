import React from 'react';
import { ContentsComponent } from './ContentsComponent'
import { Options, Content, Answer } from './QuizModel'

type OptionsAnswerProps = {
    id: string
    options: Options
    answer: Answer
    initialValue: any
    answerCallback: (id: string, answer: any) => void
}

type AnswerState = {
    values: Array<boolean>
}

export class OptionsAnswerComponent extends React.Component<OptionsAnswerProps, AnswerState> {

    constructor (props: OptionsAnswerProps) {
        super(props);
        let value = this.props.initialValue || new Array(this.props.options.options.length).fill(false)
        this.state = { values: value };
    }

    updateState(num: number, checked: boolean) {
        // copy
        let values = this.state.values.slice();
        // set specific value
        values[num] =  checked
        this.props.answerCallback(this.props.id, values);
        this.setState({ values: values });
    }

    render() {
        var comp: OptionsAnswerComponent = this;
        var name = this.props.id
        var options = this.props.options;
        const single = options.upper === 1
        var counter = 0
        return <form className="Options">
            Select { options.lower || 1 }{ single ? "" : options.upper && options.upper > 0 ? " to " + options.upper : " or more"}!
            <table><tbody>
            {
                options.options.map((option: Content) => {
                    let num = counter++
                    return <tr className="Option" key={ num }>
                            <td>
                                <div className="OptionSelector">
                                    <input type={ single ? "radio" : "checkbox"}
                                        name={ name }
                                        value={ num }
                                        checked={ this.state.values[num] ? true : false }
                                        onChange={ (event) => comp.updateState(num, event.target.checked) }
                                        />
                                </div>
                            </td>
                            <td>
                                <div className="OptionContents">
                                    <ContentsComponent contents={[ option ]}></ContentsComponent>
                                </div>
                            </td>
                        </tr>
                })
            }
            </tbody></table>
        </form>            
    }
}
