import { VFieldBand, VArrBand, VSubmitBand } from "./vBand";
import { VSubmit } from "./vSubmit";
import { buildVField, VComputeField } from "./vField";
import { VArr } from "./vArr";
import { VTuidField } from "./vField/vTuidField";
export class BandsBuilder {
    constructor(vForm, options, onSubmit) {
        this.vForm = vForm;
        this.onSubmit = onSubmit;
        let { fields, arrs, ui, res } = options;
        this.fields = fields;
        this.arrs = arrs;
        if (ui !== undefined) {
            let { items, layout } = ui;
            this.formItems = items;
            this.layout = layout;
        }
        this.res = res;
    }
    build() {
        //return this.bandUIs === undefined? this.bandsOnFly() : this.bandsFromUI();
        return this.layout === undefined ? this.bandsOnFly() : this.bandsFromLayout();
    }
    resFromName(name, res) {
        if (res === undefined)
            return;
        let { fields } = res;
        if (fields === undefined)
            return;
        return fields[name] || name;
    }
    bandsOnFly() {
        let bands = [];
        this.bandsFromFields(bands, this.fields, this.res);
        if (this.arrs !== undefined) {
            for (let arr of this.arrs)
                bands.push(this.bandFromArr(arr));
        }
        if (this.onSubmit !== undefined) {
            bands.push(new VSubmitBand(new VSubmit(this.vForm)));
        }
        return bands;
    }
    bandsFromFields(bands, fields, res) {
        if (fields === undefined)
            return;
        for (let field of fields)
            bands.push(this.bandFromField(field, res));
    }
    bandsFromLayout() {
        let bands = [];
        /*
        for (let bandUI of this.bandUIs)  {
            let band = this.bandFromUI(bandUI);
            bands.push(band);
        }
        */
        return bands;
    }
    /*
    private bandFromUI(bandUI:BandUI):VBand {
        let {band} = bandUI;
        switch (band) {
            default: return this.bandFromFieldUI(bandUI as FieldBandUI);
            case 'arr': return this.bandFromArrUI(bandUI as ArrBandUI);
            case 'fields': return this.bandFromFieldsUI(bandUI as FieldsBandUI);
            case 'submit': return this.bandFromSubmitUI(bandUI as SubmitBandUI);
        }
    }
    
    private bandFromFieldUI(bandUI: FieldBandUI): VFieldBand {
        let {label} = bandUI;
        let vField = this.vFieldFromUI(bandUI);
        return new VFieldBand(label, vField);
    }
    private bandFromArrUI(bandUI: ArrBandUI): VArrBand {
        let {label, name} = bandUI;
        let vArr = this.vArrFromUI(bandUI);
        return new VArrBand(label, vArr);
    }
    private bandFromFieldsUI(bandUI: FieldsBandUI): VFieldsBand {
        let {label, fieldUIs} = bandUI;
        let vFields = fieldUIs.map(v => this.vFieldFromUI(v));
        return new VFieldsBand(label, vFields);
    }
    private bandFromSubmitUI(bandUI: SubmitBandUI): VSubmitBand {
        if (this.onSubmit === undefined) return;
        let vSubmit = new VSubmit(this.vForm);
        return new VSubmitBand(vSubmit);
    }
    */
    /*
        private vFieldFromField(field:Field, fieldRes:FieldRes, formItem: FormItem): VField {
            let fieldUI:FieldUI = undefined;
            if (formItem !== undefined) {
                if (typeof formItem === 'function') {
                    return new VComputeField(this.vForm, field, fieldRes);
                }
            }
            let ret = buildVField(this.vForm, field, formItem, fieldRes);
            if (ret !== undefined) return ret;
            return new VTuidField(field, fieldUI, fieldRes, this.vForm);
        }
    */
    bandFromField(field, res) {
        let { name } = field;
        let fieldRes;
        let rfn = this.resFromName(name, res);
        let label;
        if (typeof rfn === 'object') {
            label = rfn.label;
            fieldRes = rfn;
        }
        else {
            label = rfn;
            fieldRes = undefined;
        }
        let vField;
        let formItem;
        if (this.formItems !== undefined)
            formItem = this.formItems[name];
        //let vField = this.vFieldFromField(field, fieldRes as FieldRes, formItem);
        //let fieldUI:FieldUI = undefined;
        if (typeof formItem === 'function') {
            vField = new VComputeField(this.vForm, field, fieldRes);
        }
        else {
            vField = buildVField(this.vForm, field, formItem, fieldRes);
        }
        if (vField === undefined) {
            vField = new VTuidField(this.vForm, field, formItem, fieldRes);
        }
        return new VFieldBand(label || name, vField);
    }
    bandFromArr(arr) {
        let { name, fields } = arr;
        //let row = JSONContent;
        //let bands:VBand[] = [];
        //this.bandsFromFields(bands, fields, res);
        let vArr = new VArr(this.vForm, arr); // name, res && res.label || name, row, bands);
        return new VArrBand(name, vArr);
    }
}
//# sourceMappingURL=bandsBuilder.js.map