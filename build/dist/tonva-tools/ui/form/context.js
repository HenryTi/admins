var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
//import { ArrRow } from './arrRow';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
export class Context {
    constructor(form, uiSchema, data, inNode, isRow) {
        this.widgets = {};
        this.errors = [];
        this.errorWidgets = [];
        this.renderErrors = observer(() => {
            let { errors } = this;
            if (errors.length === 0)
                return null;
            return React.createElement(React.Fragment, null, errors.map(err => React.createElement("span", { key: err, className: "text-danger inline-block my-1 ml-3" },
                React.createElement("i", { className: "fa fa-exclamation-circle" }),
                " \u00A0",
                err)));
        });
        this.form = form;
        this.uiSchema = uiSchema;
        this.initData = data;
        this.inNode = inNode;
        this.isRow = isRow;
        if (uiSchema !== undefined) {
            let { rules } = uiSchema;
            if (rules !== undefined) {
                this.rules = [];
                if (Array.isArray(rules) === false)
                    this.rules.push(rules);
                else
                    this.rules.push(...rules);
            }
        }
    }
    getArrRowContexts(arrName) {
        if (this.subContexts === undefined)
            this.subContexts = {};
        let arrRowContexts = this.subContexts[name];
        if (arrRowContexts === undefined)
            this.subContexts[name] = arrRowContexts = {};
        return arrRowContexts;
    }
    get arrName() { return undefined; }
    getValue(itemName) { return this.initData[itemName]; }
    setValue(itemName, value) {
        this.initData[itemName] = value;
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setValue(value);
    }
    getDisabled(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            return widget.getDisabled();
        return undefined;
    }
    setDisabled(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setDisabled(value);
    }
    getReadOnly(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.getReadOnly();
        return undefined;
    }
    setReadOnly(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setReadOnly(value);
    }
    getVisible(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.getVisible();
        return undefined;
    }
    setVisible(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setVisible(value);
    }
    checkFieldRules() {
        for (let i in this.widgets) {
            this.widgets[i].checkRules();
        }
        if (this.subContexts === undefined)
            return;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                arrRowContexts[j].checkFieldRules();
            }
        }
    }
    checkContextRules() {
        if (this.rules === undefined)
            return;
        this.clearContextErrors();
        for (let rule of this.rules) {
            let ret = rule(this);
            if (ret === undefined)
                continue;
            if (Array.isArray(ret) === true) {
                this.errors.push(...ret);
            }
            else if (typeof ret === 'string') {
                this.errors.push(ret);
            }
            else {
                for (let i in ret)
                    this.setError(i, ret[i]);
            }
        }
        if (this.subContexts === undefined)
            return;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                let rowContext = arrRowContexts[j];
                rowContext.removeErrors();
                rowContext.checkContextRules();
            }
        }
    }
    setError(itemName, error) {
        let widget = this.widgets[itemName];
        if (widget === undefined)
            return;
        widget.setContextError(error);
        this.addErrorWidget(widget);
    }
    clearContextErrors() {
        for (let i in this.widgets)
            this.widgets[i].clearContextError();
    }
    checkRules() {
        this.checkFieldRules();
        this.checkContextRules();
    }
    addErrorWidget(widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos < 0)
            this.errorWidgets.push(widget);
    }
    removeErrorWidget(widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos >= 0)
            this.errorWidgets.splice(pos, 1);
    }
    checkHasError() {
        let ret = (this.errorWidgets.length + this.errors.length) > 0;
        if (ret === true)
            return true;
        if (this.subContexts === undefined)
            return false;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                if (arrRowContexts[j].hasError === true)
                    return true;
            }
        }
        return false;
    }
    get hasError() {
        return this.checkHasError();
    }
    ;
    removeErrors() {
        this.errors.splice(0);
        this.errorWidgets.splice(0);
        for (let i in this.widgets) {
            let widget = this.widgets[i];
            if (widget === undefined)
                continue;
            widget.clearContextError();
        }
    }
}
__decorate([
    observable
], Context.prototype, "errors", void 0);
__decorate([
    observable
], Context.prototype, "errorWidgets", void 0);
__decorate([
    computed
], Context.prototype, "hasError", null);
let rowKeySeed = 1;
export class RowContext extends Context {
    constructor(parentContext, arrSchema, data, inNode) {
        let uiArr;
        let { uiSchema } = parentContext;
        if (uiSchema !== undefined) {
            let { items } = uiSchema;
            if (items !== undefined)
                uiArr = items[arrSchema.name];
        }
        super(parentContext.form, uiArr, data, inNode, true);
        this.parentContext = parentContext;
        this.arrSchema = arrSchema;
        this.rowKey = rowKeySeed++;
        this.data = data;
    }
    getItemSchema(itemName) { return this.arrSchema.itemSchemas[itemName]; }
    getUiItem(itemName) {
        if (this.uiSchema === undefined)
            return undefined;
        let { items } = this.uiSchema;
        if (items === undefined)
            return undefined;
        return items[itemName];
    }
    get arrName() { return this.arrSchema.name; }
    //get data() {return this.row.data;}
    removeErrors() {
        super.removeErrors();
        this.parentContext.removeErrors();
    }
    get parentData() { return this.parentContext.data; }
}
export class FormContext extends Context {
    constructor(form, inNode) {
        super(form, form.uiSchema, form.data, inNode, false);
    }
    get data() { return this.form.data; }
    getItemSchema(itemName) { return this.form.itemSchemas[itemName]; }
    getUiItem(itemName) {
        let { uiSchema } = this.form;
        if (uiSchema === undefined)
            return undefined;
        let { items } = uiSchema;
        if (items === undefined)
            return undefined;
        return items[itemName];
    }
}
export const ContextContainer = React.createContext({});
//# sourceMappingURL=context.js.map