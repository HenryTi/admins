import * as React from 'react';
import { Form } from './form';
import { UiSchema, UiArr, UiItem } from '../schema';
import { ArrSchema, ItemSchema } from '../schema';
import { Widget as Widget } from './widgets/widget';
//import { ArrRow } from './arrRow';
import { observable, computed } from 'mobx';
import { ContextRule } from './rules';
import { observer } from 'mobx-react';

export abstract class Context {
    private subContexts:{[name:string]:{[rowKey:string]:Context}};
    readonly form: Form;
    readonly uiSchema: UiSchema;
    readonly initData: any;
    readonly inNode: boolean;           // true: 在</> 流中定义Field
    readonly widgets: {[name:string]: Widget} = {};
    readonly rules: ContextRule[];
    readonly isRow: boolean;
    @observable errors: string[] = [];
    @observable errorWidgets:Widget[] = [];

    constructor(form: Form, uiSchema: UiSchema, data: any, inNode: boolean, isRow: boolean) {
        this.form = form;
        this.uiSchema = uiSchema;
        this.initData = data;
        this.inNode = inNode;
        this.isRow = isRow;
        if (uiSchema !== undefined) {
            let {rules} = uiSchema;
            if (rules !== undefined) {
                this.rules = [];
                if (Array.isArray(rules) === false)
                    this.rules.push(rules as ContextRule);
                else
                    this.rules.push(...rules as ContextRule[]);
            }
        }
    }

    getArrRowContexts(arrName: string) {
        if (this.subContexts === undefined) this.subContexts = {};
        let arrRowContexts = this.subContexts[name];
        if (arrRowContexts === undefined) this.subContexts[name] = arrRowContexts = {};
        return arrRowContexts;
    }

    abstract get data():any;
    abstract getItemSchema(itemName:string):ItemSchema;
    abstract getUiItem(itemName:string):UiItem;
    get arrName():string {return undefined}
    getValue(itemName:string):any {return this.initData[itemName]}
    setValue(itemName:string, value:any) {
        this.initData[itemName] = value;
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setValue(value);
    }
    getDisabled(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) return widget.getDisabled();
        return undefined;
    }
    setDisabled(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setDisabled(value);
    }
    getReadOnly(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.getReadOnly();
        return undefined;
    }
    setReadOnly(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setReadOnly(value);
    }
    getVisible(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.getVisible();
        return undefined;
    }
    setVisible(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setVisible(value);
    }

    async submit(buttonName: string) {
        this.checkRules()
        if (this.hasError === true) return;
        let {onButtonClick} = this.form.props;
        if (onButtonClick === undefined) {
            alert(`button ${buttonName} clicked. you should define form onButtonClick`);
            return;
        }
        let ret = await onButtonClick(buttonName, this);
        if (ret === undefined) return;
        this.setError(buttonName, ret);

    }

    checkFieldRules() {
        for (let i in this.widgets) {
            this.widgets[i].checkRules();
        }
        if (this.subContexts === undefined) return;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                arrRowContexts[j].checkFieldRules();
            }
        }
    }

    checkContextRules() {
        this.clearErrors();
        if (this.rules === undefined) return;
        for (let rule of this.rules) {
            let ret = rule(this);
            if (ret === undefined) continue;
            if (Array.isArray(ret) === true) {
                this.errors.push(...ret as string[]);
            }
            else if (typeof ret === 'string') {
                this.errors.push(ret as string);
            }
            else {
                for (let i in ret as object) this.setError(i, ret[i]);
            }
        }
        if (this.subContexts === undefined) return;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                let rowContext = arrRowContexts[j];
                rowContext.clearErrors();
                rowContext.checkContextRules();
            }
        }
    }

    setError(itemName:string, error:string) {
        let widget = this.widgets[itemName];
        if (widget === undefined) return;
        widget.setContextError(error);
        this.addErrorWidget(widget);
    }

    clearContextErrors() {
        for (let i in this.widgets) {
            let widget = this.widgets[i];
            if (widget === undefined) continue;
            widget.clearContextError();
        }
    }

    clearWidgetsErrors() {
        for (let i in this.widgets) {
            let widget = this.widgets[i];
            if (widget === undefined) continue;
            widget.clearError();
        }
    }

    checkRules() {
        this.clearErrors();
        this.clearWidgetsErrors();
        this.checkFieldRules();
        if (this.hasError === true) return;
        this.checkContextRules();
    }

    addErrorWidget(widget:Widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos < 0) this.errorWidgets.push(widget);
    }
    removeErrorWidget(widget:Widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos >= 0) this.errorWidgets.splice(pos, 1);
    }

    protected checkHasError():boolean {
        let ret = (this.errorWidgets.length + this.errors.length) > 0;
        if (ret === true) return true;
        if (this.subContexts === undefined) return false;
        for (let i in this.subContexts) {
            let arrRowContexts = this.subContexts[i];
            for (let j in arrRowContexts) {
                if (arrRowContexts[j].hasError === true) return true;
            }
        }
        return false;
    }

    @computed get hasError():boolean {
        return this.checkHasError();
    };

    clearErrors() {
        this.errors.splice(0);
        this.errorWidgets.splice(0);
        this.clearContextErrors();
    }

    renderErrors = observer((): JSX.Element => {
        let {errors} = this;
        if (errors.length === 0) return null;
        return <>
            {errors.map(err => <span key={err} className="text-danger inline-block my-1 ml-3">
                <i className="fa fa-exclamation-circle" /> &nbsp;{err}
            </span>)}
        </>
    });
}

let rowKeySeed:number = 1;
export class RowContext extends Context {
    readonly parentContext: Context;
    readonly arrSchema: ArrSchema;
    readonly uiSchema: UiArr;
    //readonly row: ArrRow;
    readonly rowKey: number;
    readonly data: any;
    constructor(parentContext:Context, arrSchema: ArrSchema, data: any, inNode: boolean) {
        let uiArr:UiArr;
        let {uiSchema} = parentContext;
        if (uiSchema !== undefined) {
            let {items} = uiSchema;
            if (items !== undefined) uiArr = items[arrSchema.name] as UiArr;
        }
        super(parentContext.form, uiArr, data, inNode, true);
        this.parentContext = parentContext;
        this.arrSchema = arrSchema;
        this.rowKey = rowKeySeed++;
        this.data = data;
    }
    getItemSchema(itemName:string):ItemSchema {return this.arrSchema.itemSchemas[itemName]}
    getUiItem(itemName:string):UiItem {
        if (this.uiSchema === undefined) return undefined;
        let {items} = this.uiSchema;
        if (items === undefined) return undefined;
        return items[itemName]
    }
    get arrName():string {return this.arrSchema.name}
    clearErrors() {
        super.clearErrors();
        this.parentContext.clearErrors();
    }

    get parentData():any {return this.parentContext.data;}
}

export class FormContext extends Context {
    constructor(form:Form, inNode:boolean) {
        super(form, form.uiSchema, form.data, inNode, false);
    }
    get data():any {return this.form.data}
    getItemSchema(itemName:string):ItemSchema {return this.form.itemSchemas[itemName]}
    getUiItem(itemName:string):UiItem {
        let {uiSchema} = this.form;
        if (uiSchema === undefined) return undefined;
        let {items} = uiSchema;
        if (items === undefined) return undefined;
        return items[itemName];
    }
}

export const ContextContainer = React.createContext<Context>({} as any);
