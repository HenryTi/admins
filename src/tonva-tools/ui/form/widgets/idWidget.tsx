import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { UiIdItem, TempletType } from '../uiSchema';
import { observable } from 'mobx';

export class IdWidget extends Widget {
    protected ui: UiIdItem;
    @observable protected value:number;
    setReadOnly(value:boolean) {this.readOnly = value}
    setDisabled(value:boolean) {this.disabled = value}    

    protected onClick = async () => {
        let pickId = this.ui && this.ui.pickId;
        if (pickId === undefined) {
            alert('no pickId defined!');
            return;
        }
        let id = await pickId(this.context, this.name, this.value);        
        this.setDataValue(id);
        this.clearError();
        this.clearContextError();
        this.checkRules();
    }

    render() {
        let placeholder:string|JSX.Element, Templet: TempletType;
        if (this.ui !== undefined) {
            placeholder = this.ui.placeholder;
            Templet = this.ui.Templet;
        }
        let cn = {
            'form-control': true,
            'required-item': this.itemSchema.required === true,
            'cursor-pointer': true,
            'is-invalid': this.hasError,
        };
        let content;
        if (this.value === undefined || this.value === null) {
            content = placeholder || 'placeholder';
            cn['text-muted'] = true;
        }
        else if (Templet === undefined) {
            content = <>{this.value}</>;
        }
        else if (typeof Templet === 'function') {
            content = Templet(this.value);
        }
        else {
            content = Templet;
        }
        return <>
            <div className={classNames(cn)} onClick={this.onClick}>{content}</div>
            {this.renderErrors()}
        </>;
    }
}
