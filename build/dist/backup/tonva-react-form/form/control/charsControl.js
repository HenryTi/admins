import * as React from 'react';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import { Control } from './control';
const TxtRequired = '必须填入要求内容';
export class CharsControl extends Control {
    init() {
        super.init();
        if (this.field.required === true) {
            this.rules.push((v) => {
                if (v === null || v === undefined || v.trim().length === 0)
                    return TxtRequired;
                return true;
            });
        }
    }
    getValueFromElement() { return this.parseValue(this.element.value); }
    setProps() {
        super.setProps();
        _.assign(this.props, {
            onBlur: this.onBlur.bind(this),
            onFocus: this.onFocus.bind(this),
            onChange: this.onChange.bind(this),
        });
        let face = this.face;
        if (face !== undefined) {
            _.assign(this.props, {
                placeholder: face.placeholder,
            });
        }
        return this.props;
    }
    ;
    parseValue(value) { return value; }
    onBlur() {
        //console.log('field %s onBlure', this.field.name);
        this.validate();
    }
    onChange() {
        console.log('onChange');
        this.validate();
    }
    onFocus() {
        this.clearErrors();
        //this.error = undefined;
        //this.formView.clearErrors();
    }
    className() {
        return classNames({
            "form-control": true,
            "has-success": this.isOK === true,
            "is-invalid": this.error !== undefined,
            "is-valid": this.error === undefined && this.isOK === true,
        });
    }
    renderInput() {
        return React.createElement("input", Object.assign({ className: this.className() }, this.props));
    }
    ref(element) {
        super.ref(element);
        if (element) {
            element.value = this.value === undefined ? '' : this.value;
        }
    }
    renderError() {
        //if (this.field.name === 'name') console.log('charsControl renderControl');
        if (this.error === undefined)
            return null;
        return React.createElement("div", { className: "invalid-feedback" }, this.error);
    }
    clearValue() { super.clearValue(); this.element.value = ''; }
    setError(fieldName, error) {
        if (this.field.name === fieldName)
            this.error = error;
    }
    setInitValues(values) {
        let v = values[this.field.name];
        if (v === undefined)
            return;
        //this.element.value = v;
        this.value = v;
    }
    renderControl() {
        return React.createElement(React.Fragment, null,
            this.renderInput(),
            this.renderError());
    }
}
//# sourceMappingURL=charsControl.js.map