import * as React from 'react';
import {observable, computed} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face, Placeholder} from '../face';
import {Control} from './control';

const TxtRequired = '必须填入要求内容';

export abstract class CharsControl extends Control {
    protected init() {
        super.init();
        if (this.field.required === true) {
            this.rules.push((v) => {
                if (v===null || v===undefined || (v as string).trim().length === 0) return TxtRequired;
                return true;
            });
        }
    }

    protected element: HTMLInputElement;
    protected getValueFromElement():any {return this.parseValue(this.element.value)}

    protected setProps() {
        super.setProps();
        _.assign(this.props, {
            onBlur: this.onBlur.bind(this),
            onFocus: this.onFocus.bind(this),
            onChange: this.onChange.bind(this),
        });
        let face = this.face as Placeholder;
        if (face !== undefined) {
            _.assign(this.props, {
                placeholder: face.placeholder,
            });
        }
        return this.props;
    };
    protected parseValue(value?:string):any {return value;}
    private onBlur() {
        //console.log('field %s onBlure', this.field.name);
        this.validate();
    }
    private onChange() {
        console.log('onChange');
        this.validate();
    }
    private onFocus() {
        this.clearErrors();
        //this.error = undefined;
        //this.formView.clearErrors();
    }
    protected className() {
        return classNames({
            "form-control": true,
            "has-success": this.isOK === true,
            "is-invalid": this.error !== undefined,
            "is-valid": this.error === undefined && this.isOK === true,
        });
    }
    protected renderInput():JSX.Element {
        return <input className={this.className()} {...this.props} />;
    }
    protected ref(element: HTMLInputElement) {
        super.ref(element);
        if (element) {
            element.value = this.value === undefined? '':this.value;
        }
    }
    protected renderError():JSX.Element {
        //if (this.field.name === 'name') console.log('charsControl renderControl');
        if (this.error === undefined) return null;
        return <div className="invalid-feedback">{this.error}</div>
    }
    clearValue() { super.clearValue(); this.element.value = ''; }
    setError(fieldName:string, error:string) {
        if (this.field.name === fieldName) this.error = error;
    }
    setInitValues(values: any) {
        let v = values[this.field.name];
        if (v === undefined) return;
        //this.element.value = v;
        this.value = v;
    }
    renderControl():JSX.Element {
        return <React.Fragment>
            {this.renderInput()}
            {this.renderError()}
        </React.Fragment>;
    }
}
