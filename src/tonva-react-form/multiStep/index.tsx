import * as React from 'react';
import _ from 'lodash';
import className from 'classnames';
import {FormProps, FormRow, SubmitResult, FormView, TonvaForm} from '../form';

export interface Step {
    formRows: FormRow[];
    next: undefined | string | ((values:any) => string);    // 返回下一步的step名称或者直接就是名称
    ex?: any;                                   // 每一步额外的参数
}

export interface MultiStepProps {
    className?: string;
    header?: (step:Step, num:number) => JSX.Element; //name: step name, num: 第几步，1开始
    footer?: (step:Step, num:number) => JSX.Element; //name: step name, num: 第几步，1开始
    steps: {[name:string]: Step};
    first: string;         // 第一步的名字
    onSubmit: (values:any) => Promise<SubmitResult|undefined>;
    submitButton?: string|JSX.Element;
}

export interface StepView {
    stepName: string;
    step: Step;
    props: FormProps;
    //view: JSX.Element;
}
export interface MultiStepState {
    //num: number;
    //step: Step;
    //formView: FormView;
    topView: StepView;
    stepViews: StepView[];
}

export class MultiStep extends React.Component<MultiStepProps, MultiStepState> {
    private values: any = {};
    private stepViews: StepView[] = [];
    private topView: StepView;
    constructor(props) {
        super(props);
        this.state = {
            topView: undefined,
            stepViews: [],
        }
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
    }
    
    private setStep(stepName: string) {
        let step = this.props.steps[stepName];
        if (step === undefined) return; //throw new Error('Unknown step name: ' + stepName);
        if (this.topView !== undefined) this.stepViews.push(this.topView);
        let otherButton, onOther;
        if (this.stepViews.length > 0) {
            otherButton = <ButtonConten prefix="undo" text="上一步" />;
            onOther = this.onPrev;
        }
        let {header, footer} = this.props;
        let btnContent = step.next === undefined?
            {prefix: 'cloud-upload', text: this.props.submitButton || '提交'} :
            {suffix: 'arrow-right', text: '下一步'}
        let formProps = {
            formRows: step.formRows,
            submitButton: <ButtonConten {...btnContent} />,
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
    private onPrev(values:any) {
        _.assign(this.values, values);
        this.topView = this.stepViews.pop();
        this.setState({
            topView: this.topView,
            stepViews: this.stepViews
        });
    }
    private onNext(values:any): Promise<SubmitResult|undefined> {
        _.assign(this.values, values);
        //let {num, step} = this.state;
        let {next} = this.topView.step;
        if (next === undefined) {
            return this.props.onSubmit(this.values)
        }
        let nextStepName:string;
        if (typeof next === 'string') {
            nextStepName = next;
        }
        else {
            nextStepName = next(this.values);
        }
        this.setStep(nextStepName);
    }
    render() {
        let {className, header, footer} = this.props;
        let {topView, stepViews} = this.state;
        let {stepName, step} = topView;
        let hidden = {visibility: 'hidden'};
        let num = stepViews.length + 1;
        return <div className={className}>
            <div>
                {header && header(step, num)}
                <TonvaForm key={stepName} initValues={this.values} {...topView.props} />
                {footer && footer(step, num)}
            </div>
        </div>;
    }
}

const ButtonConten = (props:{prefix?:string, text?:string|JSX.Element, suffix?:string}) => {
    let {prefix, text, suffix} = props;
    let pIcon, sIcon;
    if (prefix !== undefined) pIcon = <i className={className('fa', 'fa-' + prefix)} />;
    if (suffix !== undefined) sIcon = <i className={className('fa', 'fa-' + suffix)} />;
    return <React.Fragment>{pIcon} {props.text} {sIcon}</React.Fragment>;
}
    
