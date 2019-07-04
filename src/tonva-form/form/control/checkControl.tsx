import * as React from 'react';
import {observable} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field, BoolField} from '../field';
import {Face, CheckBoxFace} from '../face';
import {Control} from './control';

export class CheckControl extends Control {    
    protected element: HTMLInputElement;
    protected field: BoolField;
    protected face: CheckBoxFace;
    private trueValue: any;
    private falseValue: any;

    protected init() {
        super.init();
        let {trueValue, falseValue} = this.field;
        if (trueValue === undefined) this.trueValue = 1;
        if (falseValue === undefined) this.falseValue = 0;
    }

    setProps() {
        super.setProps();
        _.assign(this.props, {
            onChange: this.onChange.bind(this),
        });
    }

    clearValue() {
        this.element.checked = this.field.defaultValue === this.trueValue;
        this.value = this.getValueFromElement();
    }

    setInitValues(values: any) {
        let v = values[this.field.name];
        if (v === undefined) {
            v = this.field.defaultValue;
        }
        if (v !== undefined) {
            //this.element.checked = v === this.trueValue;
            //this.value = this.getValueFromElement();
        }
    }

    protected getValueFromElement():any { return this.element.checked? this.trueValue:this.falseValue; }

    private onChange() {
        this.value = this.getValueFromElement();
    }

    renderControl():JSX.Element {
        return <div className="form-control-static">
            <label className="form-control">
                <label className="custom-control custom-checkbox mb-0">
                    <input type='checkbox'
                        name={this.field.name}
                        ref={this.props.ref}
                        onChange={this.props.onChange}
                        className="custom-control-input" />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description">{this.face.label}</span>
                </label>
            </label>
        </div>;
    }
}
