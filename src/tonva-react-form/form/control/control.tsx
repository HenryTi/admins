import * as React from 'react';
import {observable, computed} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face} from '../face';
import {Rule} from '../rule';

export abstract class ControlBase {
    protected formView: FormView;
    constructor(formView:FormView) {
        this.formView = formView;
    }
    render():JSX.Element {
        return <div className="col-sm-10">
            {this.renderControl()}
        </div>;
    }
    protected abstract renderControl():JSX.Element;
    @computed get hasError():boolean {return false;}
    @computed get filled():boolean {return false;}
    clear() {}
    clearErrors() {}
    readValues(values:any):any {}
    setError(fieldName:string, error:string) {}
    setInitValues(values: any) {}
    isOk():boolean {this.validate(); return !this.hasError;}
    protected validate() {}
}

export abstract class Control extends ControlBase {
    protected field: Field;
    protected face: Face;
    protected props: any;
    protected rules: Rule[];

    protected element: HTMLElement;
    @observable protected isOK?: boolean;
    @observable protected error: string;
    @observable protected value: any;

    constructor(formView:FormView, field:Field, face:Face) {
        super(formView);
        this.field = field;
        this.face = face;
        this.init();
        this.setProps();
    }
    protected ref(element: HTMLElement) {
        this.element = element;
    }
    protected init() {
        this.rules = [];
        let r = this.field.rules;
        if (r !== undefined) {
            if (Array.isArray(r) === true) this.rules.push(...(r as Rule[]));
            else this.rules.push(r as Rule);
        }
    };
    protected setProps():any {
        return this.props = {
            ref: this.ref.bind(this),
            name: this.field.name,
        }
    };
    @computed get hasError():boolean {return this.error !== undefined;}
    @computed get filled():boolean {
        let ret = this.value !== undefined && this.value !== this.field.defaultValue;
        return ret;
    }
    clearValue() { this.value = undefined; }
    clear() { this.clearErrors(); this.clearValue(); }
    clearErrors() { this.isOK = undefined; this.error = undefined; }
    readValues(values:any):any {
        values[this.field.name] = this.value;
    }
    setError(fieldName:string, error:string) {}
    setInitValues(values: any) {}
    protected getValueFromElement():any {return this.value;}
    protected validate() {
        try {
            let v = this.getValueFromElement();
            if (this.rules.length > 0) {
                let isOk:boolean;
                for (let rule of this.rules) {
                    console.log('validate: %s', v);
                    let err = rule(v);
                    console.log('validate: %s err: %s', v, err);
                    if (err === true) {
                        this.error = undefined;
                        isOk = true;
                    }
                    else if (err !== undefined) {
                        //console.log('field %s onBlur v=%s rule=%s err=%s', 
                        //    this.field.name, JSON.stringify(v), rule, err);
                        this.error = err;
                        this.isOK = false;
                        return;
                    }
                }
                this.isOK = isOk;
            }
            this.value = v;
        }
        catch (e) {
            this.error = e.message;
        }
    }
    render():JSX.Element {
        let n;
        if (this.face !== undefined) {
            let {notes} = this.face;
            if (notes !== undefined) n = <small className="text-muted">{notes}</small>;
        }
        return <div className="col-sm-10">
            {this.renderControl()}
            {n}
        </div>;
    }
}
