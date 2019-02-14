import * as React from 'react';
import * as _ from 'lodash';
import { observer } from "mobx-react";
import { VBand } from './vBand';
import { BandsBuilder } from './bandsBuilder';
import { Field, ArrFields } from '../../entities';
import { computed, observable, IObservableObject, IObservableValue } from 'mobx';
import { VArr } from './vArr';
import { FormUI, FormUIBase, FormItems } from '../formUI';
import { VField } from './vField';
import { VSubmit } from './vSubmit';
import { IObservableArray } from 'mobx';
import { FA } from 'tonva-react-form';

export type FieldCall = (form:VForm, field:Field, values:any) => Promise<any>;
export interface FieldInput {
    select: FieldCall;
    content: React.StatelessComponent<any>;
    placeHolder: string;
}
export interface FieldInputs {
    [fieldOrArr:string]: FieldInput | {[field:string]: FieldInput};
}
export enum FormMode {new, edit, readonly}

export interface FormOptions {
    fields: Field[];
    arrs?: ArrFields[];
    ui: FormUIBase;
    res: any;
    inputs: FieldInputs;
    submitCaption: string;
    arrNewCaption: string;
    arrEditCaption: string;
    arrTitleNewButton: JSX.Element;
    none: string;
    mode: FormMode;
}

export class VForm {
    protected fields: Field[];
    protected arrs: ArrFields[];
    protected bands: VBand[];
    protected bandColl: {[key:string]: VBand};
    protected onSubmit: ()=>Promise<void>;

    constructor(options: FormOptions, onSubmit: ()=>Promise<void>) {
        let {fields, arrs, ui, res, inputs, none, submitCaption, arrNewCaption, arrEditCaption, arrTitleNewButton, mode} = options;
        this.fields = fields;
        this.arrs = arrs;
        this.ui = ui;
        if (this.ui !== undefined) this.formItems = this.ui.items; //.compute = this.ui.compute;
        this.res = res;
        this.inputs = inputs;
        this.none = none;
        this.submitCaption = submitCaption;
        this.arrNewCaption = arrNewCaption;
        this.arrEditCaption = arrEditCaption;
        this.arrTitleNewButton = arrTitleNewButton || <small><FA name="plus" /> 新增</small>;
        if (onSubmit === undefined) this.mode = FormMode.readonly;
        else this.mode = mode;
        this.buildFormValues();
        this.buildBands(options, onSubmit);
        this.onSubmit = onSubmit;
    }

    ui: FormUI;
    res: any;
    values: any;
    errors: any;
    formItems: FormItems;
    mode: FormMode;
    vFields: {[name:string]:VField} = {};
    vArrs: {[name:string]: VArr} = {};
    vSubmit: VSubmit;
    inputs: FieldInputs;
    none: string;
    submitCaption: string;
    arrNewCaption: string;
    arrEditCaption: string;
    arrTitleNewButton: JSX.Element;

    private buildBands(options: FormOptions, onSubmit: (values:any)=>Promise<void>) {
        this.bandColl = {};
        let bandsBuilder = new BandsBuilder(this, options, onSubmit);
        this.bands = bandsBuilder.build();
        for (let band of this.bands) {
            this.bandColl[band.key] = band;
            let vFields = band.getVFields();
            if (vFields !== undefined) for (let f of vFields) this.vFields[f.name] = f;
            let vArr = band.getVArr();
            if (vArr !== undefined) this.vArrs[vArr.name] = vArr;
            let vSubmit = band.getVSubmit();
            if (vSubmit !== undefined) this.vSubmit = vSubmit;
        }
    }

    private onFormSubmit = (event:React.FormEvent<any>) => {
        event.preventDefault();
        return false;
    }

    protected view = observer(({className}:{className:string}) => {
        return <form className={className} onSubmit={this.onFormSubmit}>
            {this.bands.map(v => v.render())}
        </form>;
    });

    getBand(name:string) {
        return this.bandColl[name];
    }

    computeFields() {
        if (this.formItems === undefined) return;
        let values = this.values;
        for (let i in this.formItems) {
            let item = this.formItems[i];
            if (typeof item !== 'function') continue;
            values[i] = item.call(values);
        }
    }

    async submit() {
        if (this.onSubmit === undefined) return;
        await this.onSubmit();
    }
    
    getValues() {
        let ret:any = {};
        let values = this.values;
        for (let f of this.fields) {
            let {name} = f;
            let v = values[name]
            ret[name] =  v !== null && typeof v === 'object' ? v.id : v;
        }
        if (this.arrs !== undefined) {
            for (let arr of this.arrs) {
                let {name, fields, id, order} = arr;
                let list = ret[name] = [];
                let rows = this.vArrs[name].list;
                for (let row of rows) {
                    let item = {} as any;
                    if (id !== undefined) item[id] = row[id];
                    if (order !== undefined) item[order] = row[order];
                    for (let f of fields) {
                        let {name:fn} = f;
                        let v = row[fn]
                        item[fn] =  v !== null && typeof v === 'object' ? v.id : v;
                    }
                    list.push(item);
                }
            }
        }
        return ret;
    }

    get valueBoxs() {
        let ret:any = {};
        let values = this.values;
        for (let f of this.fields) {
            let {name, _tuid} = f;
            let v = values[name]
            ret[name] =  _tuid === undefined || typeof v === 'object' ? v : _tuid.boxId(v);
        }
        if (this.arrs === undefined) return ret;
        for (let arr of this.arrs) {
            let {name, fields, id, order} = arr;
            let list = ret[name] = this.vArrs[name].list.slice();
            for (let row of list) {
                for (let f of fields) {
                    let {name:fn, _tuid} = f;
                    let v = row[fn]
                    row[fn] =  _tuid === undefined || typeof v === 'object' ? v : _tuid.boxId(v);
                }
            }
        }
        return ret;
    }

    setValues(initValues:any) {
        if (initValues === undefined) {
            this.reset();
            return;
        }
        let values = this.values;
        let errors = this.errors;
        for (let f of this.fields) {
            let fn = f.name;
            errors[fn] = undefined;
            let v =  initValues[fn];
            values[fn] = v;
        }
        // 还要设置arrs的values
        for (let i in this.vArrs) {
            let list = initValues[i];
            if (list === undefined) continue;
            let arrList = values[i] as IObservableArray<any>;
            arrList.clear();
            arrList.push(...list);
        }
    }

    @computed get isOk():boolean {
        for (let i in this.vFields) {
            if (this.vFields[i].isOk === false) return false;
        }
        return true;
    }
    reset() {
        let values = this.values;
        let errors = this.errors;
        for (let f of this.fields) {
            let fn = f.name;
            //if (this.compute !== undefined && this.compute[fn] !== undefined) continue;
            values[fn] = null;
            errors[fn] = undefined;
        }
        for (let i in this.vFields) {
            let ctrl = this.vFields[i];
            let cn = ctrl.name;
            if (cn === undefined) continue;
            //if (this.compute !== undefined && this.compute[cn] !== undefined) continue;
            ctrl.setValue(null);
        }
        for (let i in this.vArrs) {
            let vArr = this.vArrs[i];
            vArr.reset();
        }
    }

    getValue(fieldName: string) {
        return this.values[fieldName];
    }
    setValue(fieldName: string, value: any) { this.values[fieldName] = value }

    setError(fieldName:string, error:string) {this.errors[fieldName] = error}

    private buildFieldValues(fields: Field[]):any {
        let v: {[p:string]: any} = {
            valueFromFieldName: function(propName:string) {
                return this[propName];
            }
        };
        for (let f of fields) {
            let fn = f.name;
            v[fn] = null;
        }
        return v;
    }
    private buildObservableValues():IObservableObject {
        let v: {[p:string]: any} = this.buildFieldValues(this.fields);
        if (this.arrs !== undefined) {
            for (let arr of this.arrs) {
                v[arr.name] = observable.array([], {deep:true});
            }
        }
        let ret = observable(v);
        return ret;
    }
    private buildFormValues() {
        this.values = this.buildObservableValues();
        this.errors = observable(this.buildFieldValues(this.fields));
    }

    render(className:string = "py-3"):JSX.Element {
        return <this.view className={className} />
    }
}
