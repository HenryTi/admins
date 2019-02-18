var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from "mobx-react";
import { BandsBuilder } from './bandsBuilder';
import { computed, observable } from 'mobx';
import { FA } from 'tonva-react-form';
export var FormMode;
(function (FormMode) {
    FormMode[FormMode["new"] = 0] = "new";
    FormMode[FormMode["edit"] = 1] = "edit";
    FormMode[FormMode["readonly"] = 2] = "readonly";
})(FormMode || (FormMode = {}));
export class VForm {
    constructor(options, onSubmit) {
        this.vFields = {};
        this.vArrs = {};
        this.onFormSubmit = (event) => {
            event.preventDefault();
            return false;
        };
        this.view = observer(({ className }) => {
            return React.createElement("form", { className: className, onSubmit: this.onFormSubmit }, this.bands.map(v => v.render()));
        });
        let { fields, arrs, ui, res, inputs, none, submitCaption, arrNewCaption, arrEditCaption, arrTitleNewButton, mode } = options;
        this.fields = fields;
        this.arrs = arrs;
        this.ui = ui;
        if (this.ui !== undefined)
            this.formItems = this.ui.items; //.compute = this.ui.compute;
        this.res = res;
        this.inputs = inputs;
        this.none = none;
        this.submitCaption = submitCaption;
        this.arrNewCaption = arrNewCaption;
        this.arrEditCaption = arrEditCaption;
        this.arrTitleNewButton = arrTitleNewButton || React.createElement("small", null,
            React.createElement(FA, { name: "plus" }),
            " \u65B0\u589E");
        if (onSubmit === undefined)
            this.mode = FormMode.readonly;
        else
            this.mode = mode;
        this.buildFormValues();
        this.buildBands(options, onSubmit);
        this.onSubmit = onSubmit;
    }
    buildBands(options, onSubmit) {
        this.bandColl = {};
        let bandsBuilder = new BandsBuilder(this, options, onSubmit);
        this.bands = bandsBuilder.build();
        for (let band of this.bands) {
            this.bandColl[band.key] = band;
            let vFields = band.getVFields();
            if (vFields !== undefined)
                for (let f of vFields)
                    this.vFields[f.name] = f;
            let vArr = band.getVArr();
            if (vArr !== undefined)
                this.vArrs[vArr.name] = vArr;
            let vSubmit = band.getVSubmit();
            if (vSubmit !== undefined)
                this.vSubmit = vSubmit;
        }
    }
    getBand(name) {
        return this.bandColl[name];
    }
    computeFields() {
        if (this.formItems === undefined)
            return;
        let values = this.values;
        for (let i in this.formItems) {
            let item = this.formItems[i];
            if (typeof item !== 'function')
                continue;
            values[i] = item.call(values);
        }
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onSubmit === undefined)
                return;
            yield this.onSubmit();
        });
    }
    getValues() {
        let ret = {};
        let values = this.values;
        for (let f of this.fields) {
            let { name } = f;
            let v = values[name];
            ret[name] = v !== null && typeof v === 'object' ? v.id : v;
        }
        if (this.arrs !== undefined) {
            for (let arr of this.arrs) {
                let { name, fields, id, order } = arr;
                let list = ret[name] = [];
                let rows = this.vArrs[name].list;
                for (let row of rows) {
                    let item = {};
                    if (id !== undefined)
                        item[id] = row[id];
                    if (order !== undefined)
                        item[order] = row[order];
                    for (let f of fields) {
                        let { name: fn } = f;
                        let v = row[fn];
                        item[fn] = v !== null && typeof v === 'object' ? v.id : v;
                    }
                    list.push(item);
                }
            }
        }
        return ret;
    }
    get valueBoxs() {
        let ret = {};
        let values = this.values;
        for (let f of this.fields) {
            let { name, _tuid } = f;
            let v = values[name];
            ret[name] = _tuid === undefined || typeof v === 'object' ? v : _tuid.boxId(v);
        }
        if (this.arrs === undefined)
            return ret;
        for (let arr of this.arrs) {
            let { name, fields, id, order } = arr;
            let list = ret[name] = this.vArrs[name].list.slice();
            for (let row of list) {
                for (let f of fields) {
                    let { name: fn, _tuid } = f;
                    let v = row[fn];
                    row[fn] = _tuid === undefined || typeof v === 'object' ? v : _tuid.boxId(v);
                }
            }
        }
        return ret;
    }
    setValues(initValues) {
        if (initValues === undefined) {
            this.reset();
            return;
        }
        let values = this.values;
        let errors = this.errors;
        for (let f of this.fields) {
            let fn = f.name;
            errors[fn] = undefined;
            let v = initValues[fn];
            values[fn] = v;
        }
        // 还要设置arrs的values
        for (let i in this.vArrs) {
            let list = initValues[i];
            if (list === undefined)
                continue;
            let arrList = values[i];
            arrList.clear();
            arrList.push(...list);
        }
    }
    get isOk() {
        for (let i in this.vFields) {
            if (this.vFields[i].isOk === false)
                return false;
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
            if (cn === undefined)
                continue;
            //if (this.compute !== undefined && this.compute[cn] !== undefined) continue;
            ctrl.setValue(null);
        }
        for (let i in this.vArrs) {
            let vArr = this.vArrs[i];
            vArr.reset();
        }
    }
    getValue(fieldName) {
        return this.values[fieldName];
    }
    setValue(fieldName, value) { this.values[fieldName] = value; }
    setError(fieldName, error) { this.errors[fieldName] = error; }
    buildFieldValues(fields) {
        let v = {
            valueFromFieldName: function (propName) {
                return this[propName];
            }
        };
        for (let f of fields) {
            let fn = f.name;
            v[fn] = null;
        }
        return v;
    }
    buildObservableValues() {
        let v = this.buildFieldValues(this.fields);
        if (this.arrs !== undefined) {
            for (let arr of this.arrs) {
                v[arr.name] = observable.array([], { deep: true });
            }
        }
        let ret = observable(v);
        return ret;
    }
    buildFormValues() {
        this.values = this.buildObservableValues();
        this.errors = observable(this.buildFieldValues(this.fields));
    }
    render(className = "py-3") {
        return React.createElement(this.view, { className: className });
    }
}
__decorate([
    computed
], VForm.prototype, "isOk", null);
//# sourceMappingURL=vForm.js.map