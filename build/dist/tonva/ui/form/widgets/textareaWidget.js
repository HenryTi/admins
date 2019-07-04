import * as React from 'react';
import classNames from 'classnames';
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
        let renderTemplet = this.renderTemplet();
        if (renderTemplet !== undefined)
            return renderTemplet;
        let cn = {};
        if (this.hasError === true) {
            cn['is-invalid'] = true;
        }
        else {
            cn['required-item'] = this.itemSchema.required === true;
        }
        return React.createElement("textarea", { ref: (input) => this.input = input, className: classNames(this.className, cn), rows: this.ui && this.ui.rows, maxLength: this.itemSchema.maxLength, defaultValue: this.defaultValue, onChange: this.onInputChange });
    }
}
//# sourceMappingURL=textareaWidget.js.map