import * as React from 'react';
import { Widget } from './widget';
import { UiTextAreaItem } from '../uiSchema';
import { StringSchema } from '../schema';

export class TextAreaWidget extends Widget {
    protected itemSchema: StringSchema;
    protected input: HTMLTextAreaElement;
    protected ui: UiTextAreaItem;

    protected setElementValue(value:any) {this.input.value = value}
    protected onInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setValue(evt.currentTarget.value);
    }

    setReadOnly(value:boolean) {this.input.readOnly = this.readOnly = value}
    setDisabled(value:boolean) {this.input.disabled = this.disabled = value}

    render() {
        return <textarea ref={(input) => this.input=input} 
            rows={this.ui && this.ui.rows}
            maxLength={this.itemSchema.maxLength}
            defaultValue={this.defaultValue} onChange={this.onInputChange} />
    }
}
