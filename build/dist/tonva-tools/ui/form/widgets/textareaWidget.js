import * as React from 'react';
import { Widget } from './widget';
export class TextAreaWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onInputChange = (evt) => {
            this.setValue(evt.currentTarget.value);
        };
    }
    setElementValue(value) { this.input.value = value; }
    setReadOnly(value) { this.input.readOnly = this.readOnly = value; }
    setDisabled(value) { this.input.disabled = this.disabled = value; }
    render() {
        return React.createElement("textarea", { ref: (input) => this.input = input, rows: this.ui && this.ui.rows, maxLength: this.itemSchema.maxLength, defaultValue: this.defaultValue, onChange: this.onInputChange });
    }
}
//# sourceMappingURL=textareaWidget.js.map