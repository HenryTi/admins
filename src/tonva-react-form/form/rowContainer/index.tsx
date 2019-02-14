import * as React from 'react';
import {FormView, FormRow, FieldRow, GroupRow, LabelFormRow} from '../formView';
import {Control, ControlBase, createControl, CreateControl} from '../control';

export type CreateRow = (form:FormView, row: FormRow)=>RowContainer;

export abstract class RowContainer {
    protected form:FormView;
    protected row: FormRow;
    protected control: ControlBase;
    constructor(form:FormView, row: FormRow) {
        this.form = form;
        this.row = row;
        if ((row as JSX.Element).type === undefined) {
            let cc:CreateControl = (row as LabelFormRow).createControl;
            if (cc === undefined) cc = form.createControl;
            if (cc === undefined) cc = createControl;
            this.control = cc(form, row);
        }
    }
    abstract render(key:string):JSX.Element;
    
    isOk():boolean {
        if (this.control === undefined) return true;
        return this.control.isOk();
    }

    contains(fieldName:string):boolean {
        let field = (this.row as FieldRow).field;
        if (field !== undefined) return fieldName === field.name;
        let group = (this.row as GroupRow).group;
        if (group !== undefined) return group.find(g => g.field.name === fieldName)!==undefined;
        return false;
    }
    get hasError():boolean {return this.control.hasError;}
    get filled():boolean {return this.control.filled;}
    clear() {
        if (this.control !== undefined) this.control.clear();
    }
    clearErrors() {
        if (this.control !== undefined) this.control.clearErrors();
    }
    readValues(values:any):any {
        if (this.control !== undefined) this.control.readValues(values);
    }
    setError(fieldName:string, error:string) {
        if (this.control !== undefined) this.control.setError(fieldName, error);
    }
    setInitValues(values:any) {
        if (this.control !== undefined) this.control.setInitValues(values);
    }
}

class ElementRowContainer extends RowContainer {
    render(key:string):JSX.Element {
        return <div key={key} className="form-group">{this.row as JSX.Element}</div>;
    }
    get hasError():boolean {return false;}
    get filled():boolean {return false;}
}

class BootStrapRowContainer extends RowContainer {
    render(key:string):JSX.Element {
        return <div key={key} className='form-group row'>
            <label className='col-sm-2 col-form-label'>
                {(this.row as LabelFormRow).label}
            </label>
            {this.control.render()}
        </div>;

        //has-success is-valid
    }
}

export function bootstrapCreateRow(form:FormView, row: FormRow):RowContainer {
    return new BootStrapRowContainer(form, row);
}

export function elementCreateRow(form:FormView, row: FormRow):RowContainer {
    return new ElementRowContainer(form, row);
}
