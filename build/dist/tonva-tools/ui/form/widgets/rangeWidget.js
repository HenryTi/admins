import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
export class RangeWidget extends Widget {
    constructor() {
        super(...arguments);
        this.inputType = 'range';
    }
    setReadOnly(value) { this.input.readOnly = this.readOnly = value; }
    setDisabled(value) { this.input.disabled = this.disabled = value; }
    render() {
        let { min, max, step } = this.ui;
        return React.createElement(React.Fragment, null,
            React.createElement("input", { ref: input => this.input = input, className: classNames(this.className, 'form-control', 'w-min-6c'), type: this.inputType, defaultValue: this.defaultValue, onChange: this.onInputChange, max: max, min: min, step: step }));
    }
}
//# sourceMappingURL=rangeWidget.js.map