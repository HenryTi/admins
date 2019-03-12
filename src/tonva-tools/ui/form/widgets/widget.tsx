import * as React from 'react';
import classNames from 'classnames';
import { UiItem, ChangingHandler, ChangedHandler } from '../../schema';
import { FieldProps } from '../field';
import { Context } from '../context';
import { ItemSchema } from '../../schema';
import { Rule, RuleRequired, RuleCustom, FieldRule } from '../rules';
import { computed, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';

export abstract class Widget {
    protected name: string;
    protected context: Context;
    protected fieldProps:FieldProps;
    protected children: React.ReactNode;
    protected itemSchema: ItemSchema;
    protected ui: UiItem;
    protected defaultValue: any;
    protected value: any;
    protected rules: Rule[];
    @observable protected errors: string[] = [];
    @observable protected contextErrors: string[] = [];
    @computed protected get hasError():boolean {return (this.errors.length + this.contextErrors.length)>0}
    protected readOnly:boolean;
    protected disabled:boolean;
    @observable visible:boolean;

    constructor(context:Context, itemSchema:ItemSchema, fieldProps:FieldProps, children: React.ReactNode) {
        this.context = context;
        let {name} = itemSchema;
        this.name = name;
        this.itemSchema = itemSchema;
        this.fieldProps = fieldProps;
        this.children = children;
        this.ui = context.getUiItem(name);
        if (this.ui === undefined) {
            this.readOnly = false;
            this.disabled = false;
            this.visible = true;
        }
        else {
            let {readOnly, disabled, visible} = this.ui;
            this.readOnly = (readOnly === true);
            this.disabled = (disabled === true);
            this.visible = !(visible === false);            
        }
        this.value = this.defaultValue =  context.getValue(name); //defaultValue;
        this.init();
    }

    protected init() {
        this.rules = [];
        if (this.itemSchema.required === true) {
            this.rules.push(new RuleRequired(this.context.form.res));
        }
        this.buildRules();
        if (this.ui === undefined) return;
        let {rules} = this.ui;
        if (rules === undefined) return;
        if (Array.isArray(rules) === false) {
            this.rules.push(new RuleCustom(rules as FieldRule));
            return;
        }
        for (let rule of rules as FieldRule[]) {
            this.rules.push(new RuleCustom(rule));
        }
    }

    protected buildRules() {
    }

    checkRules() {
        let defy:string[] = [];
        for (let r of this.rules) r.check(defy, this.value);
        if (defy.length === 0) {
            this.context.removeErrorWidget(this);
        }
        else {
            this.context.addErrorWidget(this);
            this.errors.push(...defy);
        }
    }

    @computed get isOk() {
        return this.errors.length ===0;
    }

    setError(err:string | string[]) {
        if (err === undefined) return;
        if (typeof err === 'string') this.errors.push(err);
        else this.errors.push(...err);
    }

    setContextError(err:string | string[]) {
        if (err === undefined) return;
        if (typeof err === 'string') this.contextErrors.push(err);
        else this.contextErrors.push(...err);
    }

    clearError() {
        this.errors.splice(0);
    }

    clearContextError() {
        this.contextErrors.splice(0);
    }

    protected parse(value:any):any {return value}

    protected setElementValue(value:any) {}
    protected setDataValue(value:any) {
        if (this.isChanging === true) return;
        this.context.initData[this.name] = this.value = this.parse(value);
    }

    setValue(value:any) {
        if (this.isChanging === true) return;
        //this.setDataValue(value);
        //this.setElementValue(value);
        this.changeValue(value, false);
    }

    getValue() {
        return this.context.getValue(this.name);
    }

    getReadOnly():boolean {return this.readOnly}
    getDisabled():boolean {return this.disabled}
    getVisible():boolean {return this.visible}
    setReadOnly(value:boolean) {this.readOnly = value}
    setDisabled(value:boolean) {this.disabled = value}
    setVisible(value:boolean) {this.visible = value}

    private isChanging: boolean;
    protected onInputChange = (evt: React.ChangeEvent<any>) => {
        this.changeValue(evt.target.value, true);
    }

    protected changeValue(newValue: any, fromElement: boolean) {
        let prev = this.value;
        let onChanging: ChangingHandler;
        let onChanged: ChangedHandler;
        if (this.ui !== undefined) {
            onChanging = this.ui.onChanging;
            onChanged = this.ui.onChanged;
        }
        let allowChange = true;
        if (onChanging !== undefined) {
            this.isChanging = true;
            allowChange = onChanging(this.context, this.value, prev);
            this.isChanging = false;
        }
        if (allowChange === true) {
            this.setDataValue(newValue);
            if (fromElement !== true) this.setElementValue(newValue);
            if (onChanged !== undefined) {
                this.isChanging = true;
                onChanged(this.context, this.value, prev);
                this.isChanging = false;
            }
        }
    }

    protected get className():string {
        let fieldClass:string;
        if (this.context.inNode === false) fieldClass = 'form-control';
        return classNames(fieldClass, this.context.form.FieldClass, this.ui && this.ui.className);
    }

    protected abstract render():JSX.Element;

    container = observer(():JSX.Element => {
        if (this.visible === false) return null;
        let {form, inNode} = this.context;
        if (inNode === true) return this.render();
        let label:any = this.label;
        if (this.itemSchema.required === true && form.props.requiredFlag !== false) {
            if (label !== null) label = <>{label}&nbsp;<span className="text-danger">*</span></>;
        }
        return form.FieldContainer(label, this.render());
    })

    protected get label():string {
        let label:any;
        if (this.ui === undefined) {
            label = this.name;
        }
        else {
            let uiLabel = this.ui.label;
            if (uiLabel === null) label = null;
            else label = uiLabel || this.name;
        }
        return label;
    }

    protected renderTemplet():JSX.Element | undefined {
        if (this.children !== undefined) {
            return <>{this.children}</>;
        }
        if (this.ui === undefined) return undefined;
        let {Templet} = this.ui;
        if (typeof Templet === 'function') return Templet(this.value);
        return Templet;
    }

    protected renderErrors() {
        let errorList:string[] = [...this.errors, ...this.contextErrors];
        if (errorList.length === 0) return null;
        let {inNode} = this.context;
        let tag = inNode === true? 'span' : 'div';
        return errorList.map(err => React.createElement(tag, 
            {
                key: err, 
                className: 'text-danger d-inline-block my-2 ml-3'
            },
            <><i className="fa fa-exclamation-circle" /> &nbsp;{err}</>
        ));
    }
}
