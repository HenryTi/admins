var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import classNames from 'classnames';
import { RuleRequired, RuleCustom } from '../rules';
import { computed, observable } from 'mobx';
export class Widget {
    constructor(context, itemSchema, fieldProps, children) {
        this.errors = [];
        this.contextErrors = [];
        this.onInputChange = (evt) => {
            this.changeValue(evt.target.value, true);
            /*
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
                this.setDataValue(evt.currentTarget.value);
                if (onChanged !== undefined) {
                    this.isChanging = true;
                    onChanged(this.context, this.value, prev);
                    this.isChanging = false;
                }
            }
            */
        };
        this.context = context;
        let { name } = itemSchema;
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
            let { readOnly, disabled, visible } = this.ui;
            this.readOnly = (readOnly === true);
            this.disabled = (disabled === true);
            this.visible = !(visible === false);
        }
        this.value = this.defaultValue = context.getValue(name); //defaultValue;
        this.init();
    }
    get hasError() { return (this.errors.length + this.contextErrors.length) > 0; }
    init() {
        this.rules = [];
        if (this.itemSchema.required === true) {
            this.rules.push(new RuleRequired(this.context.form.res));
        }
        this.buildRules();
        if (this.ui === undefined)
            return;
        let { rules } = this.ui;
        if (rules === undefined)
            return;
        if (Array.isArray(rules) === false) {
            this.rules.push(new RuleCustom(rules));
            return;
        }
        for (let rule of rules) {
            this.rules.push(new RuleCustom(rule));
        }
    }
    buildRules() {
    }
    checkRules() {
        let defy = [];
        for (let r of this.rules)
            r.check(defy, this.value);
        if (defy.length === 0) {
            this.context.removeErrorWidget(this);
        }
        else {
            this.context.addErrorWidget(this);
            this.errors.push(...defy);
        }
    }
    get isOk() {
        return this.errors.length === 0;
    }
    setError(err) {
        if (err === undefined)
            return;
        if (typeof err === 'string')
            this.errors.push(err);
        else
            this.errors.push(...err);
    }
    setContextError(err) {
        if (err === undefined)
            return;
        if (typeof err === 'string')
            this.contextErrors.push(err);
        else
            this.contextErrors.push(...err);
    }
    clearError() {
        this.errors.splice(0);
    }
    clearContextError() {
        this.contextErrors.splice(0);
    }
    parse(value) { return value; }
    setElementValue(value) { }
    setDataValue(value) {
        if (this.isChanging === true)
            return;
        this.context.initData[this.name] = this.value = this.parse(value);
    }
    setValue(value) {
        if (this.isChanging === true)
            return;
        //this.setDataValue(value);
        //this.setElementValue(value);
        this.changeValue(value, false);
    }
    getValue() {
        return this.context.getValue(this.name);
    }
    getReadOnly() { return this.readOnly; }
    getDisabled() { return this.disabled; }
    getVisible() { return this.visible; }
    setReadOnly(value) { this.readOnly = value; }
    setDisabled(value) { this.disabled = value; }
    setVisible(value) { this.visible = value; }
    changeValue(newValue, fromElement) {
        let prev = this.value;
        let onChanging;
        let onChanged;
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
            if (fromElement !== true)
                this.setElementValue(newValue);
            if (onChanged !== undefined) {
                this.isChanging = true;
                onChanged(this.context, this.value, prev);
                this.isChanging = false;
            }
        }
    }
    get className() {
        let fieldClass;
        if (this.context.inNode === false)
            fieldClass = 'form-control';
        return classNames(fieldClass, this.context.form.FieldClass, this.ui && this.ui.className);
    }
    renderContainer() {
        if (this.visible === false)
            return null;
        let { form, inNode } = this.context;
        if (inNode === true)
            return this.render();
        let label;
        if (this.ui === undefined) {
            label = this.name;
        }
        else {
            let uiLabel = this.ui.label;
            if (uiLabel === null)
                label = null;
            label = uiLabel || this.name;
        }
        if (this.itemSchema.required === true && form.props.requiredFlag !== false) {
            if (label !== null)
                label = React.createElement(React.Fragment, null,
                    label,
                    "\u00A0",
                    React.createElement("span", { className: "text-danger" }, "*"));
        }
        return form.FieldContainer(label, this.render());
    }
    renderTemplet() {
        if (this.children !== undefined) {
            return React.createElement(React.Fragment, null, this.children);
        }
        if (this.ui === undefined)
            return undefined;
        let { Templet } = this.ui;
        if (typeof Templet === 'function')
            return Templet(this.value);
        return Templet;
    }
    renderErrors() {
        let errorList = [...this.errors, ...this.contextErrors];
        if (errorList.length === 0)
            return null;
        let { inNode } = this.context;
        let tag = inNode === true ? 'span' : 'div';
        return errorList.map(err => React.createElement(tag, {
            key: err,
            className: 'text-danger d-inline-block my-2 ml-3'
        }, React.createElement(React.Fragment, null,
            React.createElement("i", { className: "fa fa-exclamation-circle" }),
            " \u00A0",
            err)));
    }
}
__decorate([
    observable
], Widget.prototype, "errors", void 0);
__decorate([
    observable
], Widget.prototype, "contextErrors", void 0);
__decorate([
    computed
], Widget.prototype, "hasError", null);
__decorate([
    observable
], Widget.prototype, "visible", void 0);
__decorate([
    computed
], Widget.prototype, "isOk", null);
//# sourceMappingURL=widget.js.map