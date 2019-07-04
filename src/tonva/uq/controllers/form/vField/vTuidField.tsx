import * as React from 'react';
import { observer } from 'mobx-react';
import { tv } from '../../../tools';
import { Field, Tuid, TuidBox } from '../../../uqs';
import { VField, RedMark } from './vField';
import { FieldUI } from '../../formUI';
import { VForm, FieldInput, FormMode } from '../vForm';
import { FieldRes } from '../vBand';

const buttonStyle:React.CSSProperties = {
    textAlign:'left', 
    paddingLeft:'0.75rem', 
    paddingRight:'0.75rem', 
    overflow: 'hidden'
};

export class VTuidField extends VField {
    protected vForm: VForm;
    protected input: FieldInput;
    protected tuid: TuidBox;

    constructor(vForm: VForm, field:Field, fieldUI: FieldUI, fieldRes:FieldRes) {
        super(vForm, field, fieldUI, fieldRes);
        this.tuid = field._tuid;
        this.vForm = vForm;
        this.input = vForm.inputs[field.name] as FieldInput;
    }

    onClick = async () => {
        if (this.readonly === true) {
            if (!this.value) return;
            await this.tuid.showInfo(); //this.value.id);
            return;
        }
        let id:number;
        if (this.input !== undefined) {
            id = await this.input.select(this.vForm, this.field, this.vForm.getValues());
        }
        else {
            alert('call undefined');
            id = 0;
        }
        this.setValue(this.tuid.boxId(id));
    }
    protected view = observer(() => {
        let {placeHolder} = this.fieldRes;
        let disabled:boolean = false;
        //let {_ownerField} = this.field;
        let {_tuid} = this.field;
        let {ownerField} = _tuid;
        if (ownerField !== undefined) {
            let {name, arr} = ownerField;
            disabled = this.vForm.getValue(name) === null;
        }
        let content;
        if (this.value === null)
            content = <>{placeHolder || this.input.placeHolder}</>;
        else if (typeof this.value === 'object') {
            content = tv(this.value);
        }
        else {
            let idBox = this.tuid.boxId(this.value);
            content = tv(idBox); // idBox.content();
        }
        if (this.readonly === true)
        {
            return <div 
                className="form-control form-control-plaintext border border-info rounded bg-light cursor-pointer"
                onClick={this.onClick}>
                {content}
            </div>;
        }
        let {required} = this.fieldUI;
        let redDot = (required === true || this.field.null === false) && <RedMark />;
        return <>
            {redDot}
            <button className="form-control btn btn-outline-info"
                type="button"
                disabled={disabled}
                style={buttonStyle}
                onClick={this.onClick}>
                {content}
            </button>
        </>;
    })
}
