import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
export class CheckBoxWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onInputChange = (evt) => {
            this.setDataValue(evt.target.checked === true ? this.trueValue : this.falseValue);
        };
        this.onClick = () => {
            this.context.clearErrors();
        };
    }
    init() {
        super.init();
        if (this.ui !== undefined) {
            let { trueValue, falseValue } = this.ui;
            if (trueValue === undefined)
                this.trueValue = true;
            else
                this.trueValue = trueValue;
            if (falseValue === undefined)
                this.falseValue = false;
            else
                this.falseValue = falseValue;
        }
        else {
            this.trueValue = true;
            this.falseValue = false;
        }
    }
    setElementValue(value) {
        this.input.checked = value === this.trueValue;
    }
    setReadOnly(value) { this.input.readOnly = this.readOnly = value; }
    setDisabled(value) { this.input.disabled = this.disabled = value; }
    render() {
        let cn = classNames(this.className, 'form-check-inline p-0');
        let input = React.createElement("input", { ref: (input) => this.input = input, className: 'align-self-center', type: "checkbox", defaultChecked: this.defaultValue, onChange: this.onInputChange, onClick: this.onClick });
        if (this.context.inNode === true) {
            return React.createElement("label", { className: cn },
                input,
                " ",
                (this.ui && this.ui.label) || this.name);
        }
        else {
            return React.createElement("div", { className: cn },
                React.createElement("label", { className: "w-100 h-100 mb-0 d-flex justify-content-center" }, input));
        }
    }
}
//# sourceMappingURL=checkBoxWidget.js.map