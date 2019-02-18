import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
export class TextWidget extends Widget {
    constructor() {
        super(...arguments);
        this.inputType = 'text';
    }
    setElementValue(value) {
        if (this.input === null)
            return;
        this.input.value = value;
    }
    get placeholder() { return (this.ui && this.ui.placeholder) || this.name; }
    onBlur(evt) {
        this.onInputChange(evt);
        this.checkRules();
        this.context.checkContextRules();
    }
    onFocus(evt) {
        this.clearError();
        this.context.removeErrorWidget(this);
        this.context.removeErrors();
    }
    onChange(evt) {
    }
    setReadOnly(value) {
        if (this.input === null)
            return;
        this.input.readOnly = this.readOnly = value;
    }
    setDisabled(value) {
        if (this.input === null)
            return;
        this.input.disabled = this.disabled = value;
    }
    render() {
        let renderTemplet = this.renderTemplet();
        if (renderTemplet !== undefined)
            return renderTemplet;
        let cn = {
        //'form-control': true,
        };
        if (this.hasError === true) {
            cn['is-invalid'] = true;
        }
        else {
            cn['required-item'] = this.itemSchema.required === true;
        }
        return React.createElement(React.Fragment, null,
            React.createElement("input", { ref: input => this.input = input, className: classNames(this.className, cn), type: this.inputType, defaultValue: this.value, onChange: (evt) => this.onChange(evt), placeholder: this.placeholder, readOnly: this.readOnly, disabled: this.disabled, onKeyDown: this.onKeyDown, onFocus: (evt) => this.onFocus(evt), onBlur: (evt) => this.onBlur(evt), maxLength: this.itemSchema.maxLength }),
            this.renderErrors());
    }
}
//# sourceMappingURL=textWidget.js.map