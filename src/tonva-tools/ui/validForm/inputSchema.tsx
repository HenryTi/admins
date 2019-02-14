import * as React from 'react';
import * as _ from 'lodash';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {DataField, FormFields, Rule, Rules} from './field';
import {FormSchema} from './formSchema';

@observer
export class Err extends React.Component<{err?:string}, {}> {
    render() {
        return <span>{this.props.err}</span>;
    }
}

export type Validator = (values?:any)=>string|undefined;

export abstract class InputSchema {
    protected element: HTMLElement;
    props: any;
    id: string;
    label: string;
    @observable err?: string;
    @observable value: any;
    
    field: DataField;
    protected abstract setProps():void;
    protected formSchema: FormSchema;
    protected validators: Validator[];
    protected parseValue(value:any) {return value;}
    
    constructor(formSchema:FormSchema, field:DataField) {
        this.field = _.clone(field);
        this.formSchema = formSchema;
        this.id = _.uniqueId();
        this.label = field.label;
        this.value = field.defaultValue;
        this.props = {
            name: field.name,
            placeholder: field.placeholder,
            onFocus: () => {this.err = undefined; this.formSchema.errors = [];},
            ref: this.ref.bind(this),
        }
        this.setProps();
        this.buildValidators();
    }
    protected ref(element:HTMLElement) {
        this.element = element;
    }
    reset() {
        this.value = undefined;
        this.err = undefined;
    }
    clear() {
        this.value = undefined;
        this.err = undefined;
    }
    protected get defaultValue() {return this.field.defaultValue}
    setInitValue(value:any) {}
    get filled() {
        let ret = this.value !== undefined && this.value !== this.defaultValue;
        console.log('%s value=%s default=%s ret=%s', this.field.name, this.value, this.defaultValue, ret);
        return ret;
    }
    protected buildValidators() {
        let rules = this.field.rules;
        if (rules === undefined) return;
        this.validators = [];
        if (Array.isArray(rules)) {
            for (let rule of rules) {
                let validator = this.buildValidator(rule);
                if (validator !== undefined) this.validators.push(validator);
            }
        }
        else {
            let validator = this.buildValidator(rules);
            if (validator !== undefined) this.validators.push(validator);
        }
    }

    private buildValidator(rule:Rule):Validator|undefined {
        if (typeof rule === 'function') return rule;
        let parts = rule.split(':');
        return this.stringValidator(parts[0], parts[1]);
    }

    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return undefined;
            case 'required': return this.required.bind(this);
        }
    }

    protected required(values?:any):string|undefined {return undefined;}
}

class UnkownInputSchema extends InputSchema {
    protected setProps() {
        this.props.type = 'text';
        this.props.disabled = true;
        this.props.placeholder = 'unknown type ' + this.field.type;
    }
}

abstract class SingleInputSchema extends InputSchema {
    protected element: HTMLInputElement;
    protected setProps() {
        this.props.type = 'text';
        this.props.value = this.value;
        this.props.onBlur = () => {
            if (this.validators !== undefined) {
                for (let v of this.validators) {
                    let ret = v();
                    if (ret !== undefined) {
                        this.err = ret;
                        return;
                    }
                }
            }
            this.value = this.parseValue(this.element.value);
        }
    }
    setInitValue(value:any) {
        if (value === undefined) value = '';
        this.element.value = value;
        this.value=this.parseValue(value);
    }
    clear() {
        super.clear();
        this.element.value = this.field.defaultValue || '';
    }
    protected required(values?:any):string|undefined {
        if (this.element === undefined) return undefined;
        let value = this.element.value;
        if (value === undefined) return;
        if (value.trim().length > 0) return undefined;
        return '不能为空';
    }
}

abstract class NumberInputSchema extends SingleInputSchema {
    protected _min?:number;
    protected _max?:number;
    protected extraChars:number[];
    protected setProps() {
        super.setProps();
        this.props.type = 'number';
        this.props.onKeyPress = (event:KeyboardEvent)=>{
            let ch = event.charCode;
            if (ch === 8 || ch === 0 || ch === 13 || ch >= 48 && ch <= 57) {
                if (this.extraChars === undefined) return;
                if (this.extraChars.indexOf(ch) >= 0) return;
                return;
            }
            event.preventDefault();
        }
    }

    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'min': 
                this._min = Number(param); 
                if (this._min === NaN) this._min = undefined;
                return this.min.bind(this);
            case 'max':
                this._max = Number(param); 
                if (this._max === NaN) this._max = undefined;
                return this.max.bind(this);
        }
    }

    protected min(values:any):string|undefined {
        if (this._min === undefined) return;
        let value = this.element.value;
        if (value === undefined) return;
        if (value.trim().length === 0) return;
        let val = Number(value);
        if (val === NaN) return;
        if (val < this._min) return '最小值为' + this._min;
        return undefined;
    }

    protected max(values:any):string|undefined {
        if (this._max === undefined) return;
        let value = this.element.value;
        if (value === undefined) return;
        if (value.trim().length === 0) return;
        let val = Number(value);
        if (val === NaN) return;
        if (val > this._max) return '最大值为' + this._max;
        return undefined;
    }
 }

class IntInputSchema extends NumberInputSchema {

}

class DecInputSchema extends NumberInputSchema {

}

class FloatInputSchema extends NumberInputSchema {

}

class StringInputSchema extends SingleInputSchema {
    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'maxlength': 
                this.props.maxLength = param;
                return;
        }
    }
}

class PasswordInputSchema extends StringInputSchema {
    protected setProps() {
        super.setProps();
        this.props.type = 'password';
    }
}

class TextInputSchema extends InputSchema {
    protected element: HTMLTextAreaElement;
    protected setProps() {
        this.props.onBlur = () => {
            if (this.validators !== undefined) {
                for (let v of this.validators) {
                    let ret = v();
                    if (ret !== undefined) {
                        this.err = ret;
                        return;
                    }
                }
            }
            this.value = this.parseValue(this.element.value);
        }
    }
    setInitValue(value:any) {
        if (value === undefined) value = '';
        this.element.value = value;
        this.value = this.parseValue(value);
    }
}

class CheckBoxSchema extends InputSchema {
    protected element: HTMLInputElement;
    setProps() {
        this.props.type = 'checkbox';
        this.props.onChange = (event) => {
            this.value = event.target.checked === true? 1:0;
        };
    }
    protected get defaultValue() {
        let d = this.field.defaultValue;
        if (d !== undefined) return d;
        return 0;
    }
    setInitValue(value:any) {
        this.element.checked = value !== 0? true : false;
        this.value = value;
    }
}

export function inputFactory(formSchema:FormSchema, field: DataField): InputSchema {
    switch (field.type) {
        default: return new UnkownInputSchema(formSchema, field);
        case 'int': return new IntInputSchema(formSchema, field);
        case 'dec': return new DecInputSchema(formSchema, field);
        case 'float': return new FloatInputSchema(formSchema, field);
        case 'string': return new StringInputSchema(formSchema, field);
        case 'password': return new PasswordInputSchema(formSchema, field);
        case 'text': return new TextInputSchema(formSchema, field);
        case 'checkbox': return new CheckBoxSchema(formSchema, field);
    }
}
