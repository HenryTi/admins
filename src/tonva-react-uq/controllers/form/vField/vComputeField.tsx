import React from 'react';
import { VField } from './vField';
import { Field } from '../../../entities';
import { VForm } from '../vForm';
import { observer } from 'mobx-react';
import { FieldRes } from '../vBand';

export class VComputeField extends VField {
    constructor(form:VForm, field: Field, fieldRes: FieldRes) {
        super(form, field, undefined, fieldRes);
    }
    protected view = observer(() => {
        let value = this.form.values[this.field.name];
        let {placeHolder, suffix} = this.fieldRes;
        let ctrlCN = 'form-control form-control-input bg-light';
        if (value === null) value = '';
        let input = <input className={ctrlCN}
            type="text"
            placeholder={placeHolder}
            readOnly={true}
            value={value}/>
        let inputGroup;
        if (suffix === undefined)
            inputGroup = input;
        else
            inputGroup = <div className="input-group">
                {input}
                <div className="input-group-append">
                    <span className="input-group-text">{suffix}</span>
                </div>
            </div>;
        return inputGroup;
        /*
            return <div 
            className="form-control form-control-plaintext border border-info rounded bg-light cursor-pointer">
            {value} &nbsp;
        </div>;
        */
    });
}
