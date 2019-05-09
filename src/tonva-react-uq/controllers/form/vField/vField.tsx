import * as React from 'react';
import { computed, action } from 'mobx';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { FA } from 'tonva-react-form';
import { ViewModel } from "../viewModel";
import { VForm, FormMode } from '../vForm';
import { Rule, RuleRequired, RuleInt, RuleNum, RuleMin, RuleMax } from '../rule';
import { Field } from '../../../entities';
import { FieldRes } from '../vBand';
import { FieldUI, FieldInputUI, FieldStringUI, FieldNumberUI } from '../../formUI';

export abstract class VField extends ViewModel {
    protected form: VForm;
    protected fieldUI: FieldUI;
    protected fieldRes:FieldRes;
    protected field: Field;
    protected rules: Rule[];
    constructor(form:VForm, field:Field, fieldUI: FieldUI, fieldRes:FieldRes) {
        super();
        this.form = form;
        this.field = field;
        this.name = field.name;
        this.fieldUI = fieldUI || {} as any;
        this.fieldRes = fieldRes || {} as any;
        this.init();
    }

    name: string;

    protected init() {
        this.buildRules();
    }

    protected buildRules() {
        this.rules = [];
        let {required} = this.fieldUI;
        if (required === true || this.field !== undefined && this.field.null === false) {
            this.rules.push(new RuleRequired);
        }
    }

    @computed get checkRules(): string[] {
        let defy = [];
        for (let r of this.rules) r.check(defy, this.value);
        return defy;
    }

    @computed get isOk() {
        if (this.rules.length === 0) return true;
        let defy = this.checkRules;
        return defy.length === 0;
    }

    @computed get value() { return this.form.values[this.name]; }
    setValue(v:any) {
        this.form.values[this.name]=v; 
    }
    get error() { return this.form.errors[this.name]; }
    set error(err:any) { this.form.errors[this.name]=err; }
    protected parse(str:string):any {return str;}
    get readonly():boolean {
        let {mode} = this.form;
        return mode === FormMode.readonly || 
            mode === FormMode.edit && this.fieldUI.editable === false;
    }
}

export class VUnknownField extends VField {
    protected view = () => {
        //let {name, type} = this.fieldUI;
        let type='', name = '';
        return <input type="text" className="form-control form-control-plaintext border border-info rounded bg-light"
            placeholder={'unkown control: ' + type + '-' + name} />;
    }
}

export abstract class VInputControl extends VField {
    protected fieldUI: FieldInputUI;
    protected input: HTMLInputElement;

    protected inputType:string;
    protected get maxLength():number {return}

    protected renderError = (className:string) => {
        let {errors} = this.form;
        let error = errors[this.name];
        if (error === undefined) return;
        return <div className={className}><FA name="exclamation-circle" /> {error}</div>
    }

    /*
    get value() {
        return super.value;
    }*/
    setValue(v:any) {
        super.setValue(v); this.setInputValue(); 
    }

    protected ref = (input:HTMLInputElement) => {
        this.input = input;
        this.setInputValue();
    }

    protected setInputValue() {
        if (!this.input) return;
        let v = this.value;
        this.input.value = v === null || v === undefined? '' : v;
    }

    protected onFocus = () => {
        this.error = undefined;
    }

    protected onBlur = () => {
        let defy = this.checkRules;
        if (defy.length > 0) {
            this.error = defy[0];
        }
        this.form.computeFields();
    }

    protected onChange = (evt: React.ChangeEvent<any>) => {
        let v = this.parse(evt.currentTarget.value);
        if (v === null) {
            return;
        }
        this.setValue(v);
    }

    protected onKeyPress: (event:React.KeyboardEvent<HTMLInputElement>) => void;
    
    protected view = observer(() => {
        let {required} = this.fieldUI;
        let {placeHolder, suffix} = this.fieldRes;
        let ctrlCN = ['form-control', 'form-control-input'];
        let errCN = 'text-danger small mt-1 mx-2';
    
        let redDot;
        let input;
        if (this.readonly === true) {
            input = <input className={classNames(ctrlCN, 'bg-light')}
                ref={this.ref}
                type={this.inputType}
                readOnly={true}
            />;
        }
        else {
            input = <input className={classNames(ctrlCN)}
                ref={this.ref}
                type={this.inputType}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
                placeholder={placeHolder}
                readOnly={false}
                maxLength={this.maxLength}
                onKeyPress={this.onKeyPress}
            />;
            if (required === true || this.field.null === false) {
                redDot = <RedMark />;
            }
        }

        let inputGroup;
        if (suffix === undefined)
            inputGroup = input;
        else
            inputGroup = <div className="input-group">
                {input}
                <div className="input-group-append">
                    <span className="input-group-text">{suffix}</span>
                </div>
            </div>;

        return <>
            {redDot}
            {inputGroup}
            {this.renderError(errCN)}
        </>
    });
}

export const RedMark = () => <b style={{color:'red', position:'absolute', left:'0.1em', top:'0.5em'}}>*</b>;

export class VStringField extends VInputControl {
    protected fieldUI: FieldStringUI;
    protected inputType:string = 'text';
    protected get maxLength():number {return this.field.size}
}

const KeyCode_Neg = 45;
const KeyCode_Dot = 46;

export abstract class VNumberControl extends VInputControl {
    protected fieldUI: FieldNumberUI;
    protected extraChars: number[];

    protected init() {
        super.init();
        this.extraChars = [];
        if (this.fieldUI !== undefined) {
            let {min, max} = this.fieldUI;
            if (min !== undefined) {
                //this.rules.push((v:number) => {if (v === undefined) return; if (v<min) return ErrMin + min; return true;});
                if (min < 0) this.extraChars.push(KeyCode_Neg);
            }
            else {
                this.extraChars.push(KeyCode_Neg);
            }
    
            if (max !== undefined) {
                //this.rules.push((v:number) => {if (v === undefined) return; if (v>max) return ErrMax + max; return true});
            }
        }
        switch (this.field.type) {
            case 'dec':
            case 'bigint':
            case 'int':
            case 'smallint':
            case 'tinyint':
                this.extraChars.push(KeyCode_Dot); break;
        }
    }

    protected buildRules() {
        super.buildRules();
        this.rules.push(new RuleNum);
        let {min, max} = this.fieldUI;
        if (min !== undefined) this.rules.push(new RuleMin(min));
        if (max !== undefined) this.rules.push(new RuleMax(max));
    }

    inputType:string = 'number';

    protected parse(text:string):any {
        try {
            if (text.trim().length === 0) return undefined;
            let ret = Number(text);
            return (ret === NaN)? null : ret;
        }
        catch {
            return null;
        }
    }

    protected setInputValue() {
        if (!this.input) return;
        let v = this.value;
        if (this.parse(this.input.value) == v) return;
        this.input.value = v === null || v === undefined? '' : v;
    }

    protected onKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
        let ch = event.charCode;
        if (ch === 8 || ch === 0 || ch === 13 || ch >= 48 && ch <= 57) return;
        if (this.extraChars !== undefined) {
            if (this.extraChars.indexOf(ch) >= 0) {
                switch (ch) {
                    case KeyCode_Dot: this.onKeyDot(); break;
                    case KeyCode_Neg: this.onKeyNeg(); event.preventDefault(); break;
                }
                return;
            }
        }
        event.preventDefault();
    }

    private onKeyDot() {
        let v = this.input.value;
        let p = v.indexOf('.');
        if (p >= 0) this.input.value = v.replace('.', '');
    }
    private onKeyNeg() {
        let v = this.input.value;
        let p = v.indexOf('-');
        if (p >= 0) v = v.replace('-', '');
        else v = '-'+v;
        this.input.value = v;
    }
}

export class VIntField extends VNumberControl {
    protected buildRules() {
        super.buildRules();
        this.rules.push(new RuleInt);
    }
}

export class VDecField extends VNumberControl {
}

export class VTextField extends VStringField {

}

export class VDateTimeField extends VStringField {

}

export class VDateField extends VStringField {

}
