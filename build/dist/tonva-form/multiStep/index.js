import * as React from 'react';
import _ from 'lodash';
import className from 'classnames';
import { TonvaForm } from '../form';
export class MultiStep extends React.Component {
    constructor(props) {
        super(props);
        this.values = {};
        this.stepViews = [];
        this.state = {
            topView: undefined,
            stepViews: [],
        };
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
    }
    setStep(stepName) {
        let step = this.props.steps[stepName];
        if (step === undefined)
            return; //throw new Error('Unknown step name: ' + stepName);
        if (this.topView !== undefined)
            this.stepViews.push(this.topView);
        let otherButton, onOther;
        if (this.stepViews.length > 0) {
            otherButton = React.createElement(ButtonConten, { prefix: "undo", text: "\u4E0A\u4E00\u6B65" });
            onOther = this.onPrev;
        }
        let { header, footer } = this.props;
        let btnContent = step.next === undefined ?
            { prefix: 'cloud-upload', text: this.props.submitButton || '提交' } :
            { suffix: 'arrow-right', text: '下一步' };
        let formProps = {
            formRows: step.formRows,
            submitButton: React.createElement(ButtonConten, Object.assign({}, btnContent)),
            onSubmit: this.onNext,
            otherButton: otherButton,
            onOther: onOther,
        };
        let num = this.stepViews.length + 1;
        this.topView = {
            stepName: stepName,
            step: step,
            props: formProps,
        };
        this.setState({
            topView: this.topView,
            stepViews: this.stepViews
        });
    }
    componentWillMount() {
        this.setStep(this.props.first);
    }
    onPrev(values) {
        _.assign(this.values, values);
        this.topView = this.stepViews.pop();
        this.setState({
            topView: this.topView,
            stepViews: this.stepViews
        });
    }
    onNext(values) {
        _.assign(this.values, values);
        //let {num, step} = this.state;
        let { next } = this.topView.step;
        if (next === undefined) {
            return this.props.onSubmit(this.values);
        }
        let nextStepName;
        if (typeof next === 'string') {
            nextStepName = next;
        }
        else {
            nextStepName = next(this.values);
        }
        this.setStep(nextStepName);
    }
    render() {
        let { className, header, footer } = this.props;
        let { topView, stepViews } = this.state;
        let { stepName, step } = topView;
        let hidden = { visibility: 'hidden' };
        let num = stepViews.length + 1;
        return React.createElement("div", { className: className },
            React.createElement("div", null,
                header && header(step, num),
                React.createElement(TonvaForm, Object.assign({ key: stepName, initValues: this.values }, topView.props)),
                footer && footer(step, num)));
    }
}
const ButtonConten = (props) => {
    let { prefix, text, suffix } = props;
    let pIcon, sIcon;
    if (prefix !== undefined)
        pIcon = React.createElement("i", { className: className('fa', 'fa-' + prefix) });
    if (suffix !== undefined)
        sIcon = React.createElement("i", { className: className('fa', 'fa-' + suffix) });
    return React.createElement(React.Fragment, null,
        pIcon,
        " ",
        props.text,
        " ",
        sIcon);
};
//# sourceMappingURL=index.js.map