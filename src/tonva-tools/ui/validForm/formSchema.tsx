import * as React from 'react';
import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {Page} from '../page';
import {nav} from '../nav';
import {DataField, FormFields, Rule, Rules, SubmitReturn} from './field';
import {InputSchema, inputFactory, Err} from './inputSchema';
import { FormEvent } from 'react';

export class FormSchema {
    private initValues: any;
    private _inputs: {[name:string]: InputSchema};
    private submit: (values:any) => Promise<SubmitReturn|undefined>;
    fieldTag: string;
    submitText: string;
    resetButton?: string;
    clearButton?: string;
    inputs: InputSchema[];
    hasLabel: boolean;
    @observable errors: string[] = [];
    onError: (result:any) => void;
    onSuccess: (result:any) => void;
    constructor(formFields: FormFields, values?: any) {
        let {fields, onSumit, fieldTag, submitText, resetButton, clearButton} = formFields;
        this.initValues = values;
        this.fieldTag = fieldTag || 'div';
        this.submitText = submitText || '提交';
        if (resetButton === true) this.resetButton = '重来';
        else this.resetButton = resetButton as string;
        if (clearButton === true) this.clearButton = '清除';
        else this.clearButton = clearButton as string;
        this.submit = onSumit;
        this._inputs = {};
        this.inputs = [];
        this.hasLabel = false;
        for (let field of fields) {
            let name = field.name;
            /*
            if (values !== undefined) {
                let v = values[name];
                if (v !== undefined) field.defaultValue = v;
            }*/
            if (field.label !== undefined) this.hasLabel = true;
            let v = this._inputs[field.name] = inputFactory(this, field);
            this.inputs.push(v);
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    clear() {
        this.inputs.forEach(v => v.clear());
        this.errors.splice(0, this.errors.length);
    }
    reset() {
        this.inputs.forEach(v => v.reset());
        this.errors.splice(0, this.errors.length);
    }

    values():object {
        let ret:any = {};
        for (let vi of this.inputs) {
            let v = vi.value;
            if (v === '') v = undefined;
            ret[vi.field.name] = v;
        }
        return ret;
    }

    @computed get hasError():boolean {
        return this.inputs.some(vi => vi.err !== undefined);
    }
    @computed get notFilled():boolean {
        let ret = this.inputs.every(vi => !vi.filled);
        console.log('not filled %s', ret);
        return ret;
    }

    $(name:string):InputSchema {return this._inputs[name];}

    removeInput(name:string) {
        let input = this._inputs[name];
        if (input !== undefined) {
            let index = this.inputs.findIndex(v => v===input);
            if (index>=0) this.inputs.splice(index, 1);
        }
    }

    setInputError(name:string, err:string) {
        let input = this._inputs[name];
        if (input === undefined) return;
        input.err = err;
    }
    
    onReset() {
        this.reset();
    }
    onClear() {
        this.clear();
    }
    async onSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.submit === undefined) {
            alert('no submit funciton defined');
            return;
        }
        for (let input of this.inputs) {
            let blur = input.props.onBlur;
            if (blur === undefined) continue;
            blur();
        }
        let ret = await this.submit(this.values());
        if (ret === undefined) return;
        //if (ret === undefined) {
        //    alert('no submit return');
        //    return;
        //}

        if (ret.success === true) {
            if (this.onSuccess !== undefined) {
                this.onSuccess(ret.result);
                return;
            }
        }
        else {
            if (this.onError !== undefined) {
                this.onError(ret.result);
                return;
            }
        }
        nav.push(<ResultPage return={ret} onFinish={this.onFinish} onNext={this.onNext} />)
    }

    private onFinish() {
        nav.pop();
    }

    private onNext() {
        this.clear();
    }

    private fieldContainerClassNames() {
        return classNames(this.hasLabel? 'col-sm-10' : 'col-sm-12');
    }

    setInputValues() {
        if (this.initValues === undefined) return;
        for (let i in this._inputs) {
            let v = this.initValues[i];
            if (v !== undefined) this._inputs[i].setInitValue(v);
        }
    }

    renderInput(vInput:InputSchema):JSX.Element {
        switch (vInput.field.type) {
            default: return this.renderString(vInput);
            case 'checkbox': return this.renderCheckBox(vInput);
            case 'text': return this.renderTextArea(vInput);
        }
    }
    renderString(vInput:InputSchema):JSX.Element {
        let {err} = vInput;
        let cn = classNames('form-control', 'has-success', err? 'is-invalid':'is-valid');
        return <input className={cn} {...vInput.props} />;
    }
    renderTextArea(vInput:InputSchema):JSX.Element {
        let {err} = vInput;
        let {value, inputtag, ...attributes} = vInput.props;
        let cn = classNames('form-control', 'has-success', err? 'is-invalid':'is-valid');
        return <textarea className={cn} {...attributes}>{vInput.value}</textarea>;
    }
    renderCheckBox(vInput:InputSchema):JSX.Element {
        let {props, field, value} = vInput;
        return <label className='form-check-label h-100 align-items-center d-flex bg-light'>
            <input type='checkbox' className='form-check-input position-static ml-0' 
                name={field.name} checked={vInput.value===1} onChange={props.onChange} 
                ref={props.ref} />
        </label>;
    }
    renderLabel(vInput:InputSchema):JSX.Element {
        if (this.hasLabel === false) return null;
        return <label className='col-sm-2 col-form-label'>{vInput !== undefined? vInput.label : null}</label>
    }
    renderErr(vInput:InputSchema):JSX.Element {
        return <div className="invalid-feedback">{vInput.err}</div>
    }
    renderField(vInput:InputSchema):JSX.Element {
        return <div className='form-group row' key={vInput.id}>
            {this.renderLabel(vInput)}
            <div className={this.fieldContainerClassNames()}>
                {this.renderInput(vInput)}
                {vInput.err && this.renderErr(vInput)}
            </div>
        </div>
    }
    renderSeperator(vInput?:InputSchema):JSX.Element {
        return null;
        //return <hr key={_.uniqueId()} style={{margin:'20px 0px'}} />;
    }
    renderSumit():JSX.Element {
        let cn = classNames('btn', 'btn-primary', this.hasLabel? undefined: 'btn-block');
        return <button 
            className={cn}
            key={_.uniqueId()} 
            type='submit' 
            disabled={this.notFilled || this.hasError}>
            {this.submitText}
        </button>;
    }
    renderReset():JSX.Element {
        return <button
            className='btn btn-secondary"'
            key={_.uniqueId()} type='button' 
            onClick={this.onReset}>
            {this.resetButton}
        </button>
    }
    renderClear():JSX.Element {
        return <button
            className='btn btn-secondary"'
            key={_.uniqueId()} type='button' 
            onClick={this.onClear}>
            {this.clearButton}
        </button>
    }
    renderFormErrors():JSX.Element {
        if (this.errors.length === 0) return null;
        return <div className='form-group row'><div className={this.fieldContainerClassNames()}>
            {this.renderLabel(undefined)}
            {
            this.errors.map(e => <div className='invalid-feedback' style={{display:'block'}}>{e}</div>)
            }
        </div></div>;
    }
    renderButtons():JSX.Element {
        if (this.hasLabel === true) {
            return <div className='form-group row' key={_.uniqueId()}>
                {this.renderLabel(undefined)}
                <div className={this.fieldContainerClassNames()}>
                    <div className="row container">
                        <div className="col-auto mr-auto">{this.renderSumit()}</div>
                        <div className="col-auto">{this.clearButton&&this.renderClear()}</div>
                        <div className="col-auto">{this.resetButton&&this.renderReset()}</div>
                    </div>
                </div>
            </div>;
        }
        return <div className='form-group row' key={_.uniqueId()}>
            <div className={this.fieldContainerClassNames()}>
                {this.renderSumit()}
            </div>
            {this.clearButton? <div className="col-auto">this.renderClear()</div>:null }
            {this.resetButton? <div className="col-auto">this.renderReset()</div>:null }
        </div>;
    }
}

interface ResultProps {
    return: SubmitReturn;
    onNext: () => void;
    onFinish: () => void;
}
class ResultPage extends React.Component<ResultProps, null> {
    render() {
        let {return:ret, onNext, onFinish} = this.props;
        let {success, message, result} = ret;
        if (message === undefined) {
            message = success === true? '提交成功': '提交发生错误'
        }
        return <Page back="close">
        <div className='jumbotron'>
            <div className='lead'>{message}</div>
            <p>{JSON.stringify(result)}</p>
            <hr className="my-4" />
            <div className='lead'>
                <button className='btn btn-primary mr-2' type='button' onClick={()=>{nav.pop(); onFinish();}}>完成</button>
                <button className='btn btn-default mr-2' type='button' onClick={()=>{nav.pop(); onNext();}}>继续</button>
            </div>
        </div>
        </Page>
    }
}
