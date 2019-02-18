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
            this.context.removeErrors();
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
        let cn = classNames(this.className, 'form-check-inline');
        let input = React.createElement("input", { ref: (input) => this.input = input, className: 'align-self-center', type: "checkbox", defaultChecked: this.defaultValue, onChange: this.onInputChange, onClick: this.onClick });
        return this.context.inNode ?
            React.createElement("label", { className: cn },
                input,
                " ",
                (this.ui && this.ui.label) || this.name)
            :
                React.createElement("div", { className: cn }, input);
    }
}
//# sourceMappingURL=checkBoxWidget.js.map