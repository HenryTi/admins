import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { UiTextItem, StringSchema } from '../../schema';

export class TextWidget extends Widget {
    protected inputType = 'text';
    protected ui: UiTextItem;
    protected input: HTMLInputElement;

    protected setElementValue(value:any) {
        if (this.input === null) return;
        this.input.value = value;
    }
    protected get placeholder() {return (this.ui && this.ui.placeholder) || this.name}
    protected onKeyDown = async (evt:React.KeyboardEvent<HTMLInputElement>) => {
        this.internalOnKeyDown(evt);
        if (evt.keyCode !== 13) return;
        let {onEnter} = this.context.form.props;
        if (onEnter === undefined) return;

        this.changeValue(evt.currentTarget.value, true);

        //this.checkRules();
        //this.context.checkContextRules();
        this.input.blur();

        let ret = await onEnter(this.name, this.context);
        if (ret !== undefined) {
            this.context.setError(this.name, ret);
        }
    }

    protected internalOnKeyDown(evt:React.KeyboardEvent<HTMLInputElement>) {
    }

    protected onBlur(evt: React.FocusEvent<any>) {
        this.onInputChange(evt);
        this.checkRules();
        this.context.checkContextRules();
    }
    protected onFocus(evt: React.FocusEvent<any>) {
        this.clearError();
        this.context.removeErrorWidget(this);
        this.context.clearErrors();
    }
    protected onChange(evt: React.ChangeEvent<any>) {
    }

    setReadOnly(value:boolean) {
        if (this.input === null) return;
        this.input.readOnly = this.readOnly = value;
    }
    setDisabled(value:boolean) {
        if (this.input === null) return;
        this.input.disabled = this.disabled = value;
    }

    render() {
        let renderTemplet = this.renderTemplet();
        if (renderTemplet !== undefined) return renderTemplet;
        let cn = {
            //'form-control': true,
        };
        if (this.hasError === true) {
            cn['is-invalid'] = true;
        }
        else {
            cn['required-item'] = this.itemSchema.required === true;
        }
        return <><input ref={input=>this.input = input}
            className={classNames(this.className, cn)}
            type={this.inputType}
            defaultValue={this.value}
            onChange={(evt: React.ChangeEvent<any>) => this.onChange(evt)}
            placeholder={this.placeholder}
            readOnly={this.readOnly}
            disabled={this.disabled}
            onKeyDown = {this.onKeyDown}
            onFocus = {(evt: React.FocusEvent<any>) => this.onFocus(evt)}
            onBlur={(evt: React.FocusEvent<any>) => this.onBlur(evt)}
            maxLength={(this.itemSchema as StringSchema).maxLength} />
            {this.renderErrors()}
        </>;
    }
}
