var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VPage } from 'tonva-tools';
import { VForm, FormMode } from './form';
import { entityIcons } from './icons';
import { ControllerUq } from './ControllerUq';
export class CEntity extends ControllerUq {
    constructor(cUq, entity, ui, res) {
        super(cUq, res);
        Object.setPrototypeOf(this.x, cUq.x);
        let { name, typeName } = entity;
        this.entity = entity;
        this.ui = ui; // || entityUI.ui;
        this.label = this.res.label || name;
        this.icon = entityIcons[typeName];
    }
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            //if (await super.beforeStart() === false) return false;
            yield this.entity.loadSchema();
            return true;
        });
    }
    createForm(onSubmit, values, mode) {
        let options = this.buildFormOptions(mode);
        let ret = new VForm(options, onSubmit);
        ret.setValues(values);
        return ret;
    }
    buildFormOptions(mode) {
        let { fields, arrFields } = this.entity;
        let none, submitCaption, arrNewCaption, arrEditCaption, arrTitleNewButton;
        if (this.res !== undefined) {
            none = this.res['none'];
            submitCaption = this.res['submit'];
            arrNewCaption = this.res['arrNew'];
            arrEditCaption = this.res['arrEdit'];
            arrTitleNewButton = this.res['arrTitleNewButton'];
        }
        if (none === undefined) {
            none = this.cUq.res['none'] || 'none';
        }
        if (submitCaption === undefined)
            submitCaption = this.cUq.res['submit'] || 'Submit';
        if (arrNewCaption === undefined)
            arrNewCaption = this.cUq.res['arrNew'] || 'New';
        if (arrEditCaption === undefined)
            arrEditCaption = this.cUq.res['arrEdit'] || 'Edit';
        if (arrTitleNewButton === undefined)
            arrTitleNewButton = this.cUq.res['arrTitleNewButton'];
        if (mode === undefined)
            mode = FormMode.new;
        let formUI = this.ui.form;
        let ret = {
            fields: fields,
            arrs: arrFields,
            ui: formUI,
            res: this.res || {},
            inputs: this.buildInputs(formUI),
            none: none,
            submitCaption: submitCaption,
            arrNewCaption: arrNewCaption,
            arrEditCaption: arrEditCaption,
            arrTitleNewButton: arrTitleNewButton,
            mode: mode,
        };
        return ret;
    }
    buildInputs(formUI) {
        let { fields, arrFields } = this.entity;
        let ret = {};
        this.buildFieldsInputs(ret, fields, undefined, formUI);
        if (arrFields !== undefined) {
            for (let arr of arrFields) {
                let { name, fields } = arr;
                let items = formUI && formUI.items;
                this.buildFieldsInputs(ret, fields, name, items && items[name]);
            }
        }
        return ret;
    }
    buildFieldsInputs(ret, fields, arr, formUI) {
        if (arr !== undefined) {
            let arrFieldInputs = ret[arr];
            if (arrFieldInputs === undefined) {
                ret[arr] = arrFieldInputs = {};
                ret = arrFieldInputs;
            }
        }
        for (let field of fields) {
            let { name, _tuid } = field;
            if (_tuid === undefined)
                continue;
            let fieldUI = formUI && formUI.items && formUI.items[name];
            ret[name] = {
                select: this.buildSelect(field, arr, fieldUI),
                content: this.buildContent(field, arr),
                placeHolder: this.cUq.getTuidPlaceHolder(_tuid),
            };
        }
    }
    buildSelect(field, arr, fieldUI) {
        return (form, field, values) => __awaiter(this, void 0, void 0, function* () {
            let { _tuid, _ownerField } = field;
            let cTuidSelect = yield _tuid.cSelectFrom();
            let param = undefined;
            if (_ownerField !== undefined)
                param = form.getValue(_ownerField.name);
            if (fieldUI && fieldUI.autoList === true) {
                console.log('select search set param=empty string');
                param = '';
            }
            let ret = yield cTuidSelect.call(param);
            cTuidSelect.removeCeased(); // 清除已经废弃的顶部页面
            if (ret === undefined)
                return undefined;
            let id = cTuidSelect.idFromItem(ret);
            _tuid.useId(id);
            return id;
        });
    }
    buildContent(field, arr) {
        return;
    }
    cQuerySelect(queryName) {
        return this.cUq.cQuerySelect(queryName);
    }
}
export class VEntity extends VPage {
    constructor(controller) {
        super(controller);
        this.entity = controller.entity;
        this.ui = controller.ui;
    }
    get label() { return this.controller.label; }
    //private _form_$: VForm;
    createForm(onSubmit, values, mode) {
        //if (this._form_$ !== undefined) return this._form_$;
        return this.controller.createForm(onSubmit, values, mode);
    }
}
//# sourceMappingURL=CVEntity.js.map