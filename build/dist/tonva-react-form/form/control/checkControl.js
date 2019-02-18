import * as React from 'react';
import * as _ from 'lodash';
import { Control } from './control';
export class CheckControl extends Control {
    init() {
        super.init();
        let { trueValue, falseValue } = this.field;
        if (trueValue === undefined)
            this.trueValue = 1;
        if (falseValue === undefined)
            this.falseValue = 0;
    }
    setProps() {
        super.setProps();
        _.assign(this.props, {
            onChange: this.onChange.bind(this),
        });
    }
    clearValue() {
        this.element.checked = this.field.defaultValue === this.trueValue;
        this.value = this.getValueFromElement();
    }
    setInitValues(values) {
        let v = values[this.field.name];
        if (v === undefined) {
            v = this.field.defaultValue;
        }
        if (v !== undefined) {
            //this.element.checked = v === this.trueValue;
            //this.value = this.getValueFromElement();
        }
    }
    getValueFromElement() { return this.element.checked ? this.trueValue : this.falseValue; }
    onChange() {
        this.value = this.getValueFromElement();
    }
    renderControl() {
        return React.createElement("div", { className: "form-control-static" },
            React.createElement("label", { className: "form-control" },
                React.createElement("label", { className: "custom-control custom-checkbox mb-0" },
                    React.createElement("input", { type: 'checkbox', name: this.field.name, ref: this.props.ref, onChange: this.props.onChange, className: "custom-control-input" }),
                    React.createElement("span", { className: "custom-control-indicator" }),
                    React.createElement("span", { className: "custom-control-description" }, this.face.label))));
    }
}
//# sourceMappingURL=checkControl.js.map