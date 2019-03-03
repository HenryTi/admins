import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { UiTextAreaItem } from '../../schema';
import { StringSchema } from '../../schema';

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
        let renderTemplet = this.renderTemplet();
        if (renderTemplet !== undefined) return renderTemplet;
        let cn = {};
        if (this.hasError === true) {
            cn['is-invalid'] = true;
        }
        else {
            cn['required-item'] = this.itemSchema.required === true;
        }
        return <textarea ref={(input) => this.input=input} 
            className={classNames(this.className, cn)}
            rows={this.ui && this.ui.rows}
            maxLength={this.itemSchema.maxLength}
            defaultValue={this.defaultValue} onChange={this.onInputChange} />
    }
}
