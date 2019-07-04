var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
export class TextWidget extends Widget {
    constructor() {
        super(...arguments);
        this.inputType = 'text';
        this.onKeyDown = (evt) => __awaiter(this, void 0, void 0, function* () {
            this.internalOnKeyDown(evt);
            if (evt.keyCode !== 13)
                return;
            let { onEnter } = this.context.form.props;
            if (onEnter === undefined)
                return;
            this.changeValue(evt.currentTarget.value, true);
            //this.checkRules();
            //this.context.checkContextRules();
            this.input.blur();
            let ret = yield onEnter(this.name, this.context);
            if (ret !== undefined) {
                this.context.setError(this.name, ret);
            }
        });
    }
    setElementValue(value) {
        if (this.input === null)
            return;
        this.input.value = value;
    }
    get placeholder() { return (this.ui && this.ui.placeholder) || this.name; }
    internalOnKeyDown(evt) {
    }
    onBlur(evt) {
        this.onInputChange(evt);
        this.checkRules();
        this.context.checkContextRules();
    }
    onFocus(evt) {
        this.clearError();
        this.context.removeErrorWidget(this);
        this.context.clearErrors();
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