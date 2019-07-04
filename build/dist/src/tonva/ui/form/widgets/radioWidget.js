import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
const radioStyle = { height: 'auto' };
export class RadioWidget extends Widget {
    constructor() {
        super(...arguments);
        this.inputs = {};
    }
    setElementValue(value) {
        for (let i in this.inputs) {
            let input = this.inputs[i];
            input.checked = value === input.value;
        }
    }
    setReadOnly(value) {
        this.readOnly = value;
        for (let i in this.inputs)
            this.inputs[i].readOnly = value;
    }
    setDisabled(value) {
        this.disabled = value;
        for (let i in this.inputs)
            this.inputs[i].disabled = value;
    }
    /*
    protected onInputChange = (evt: React.ChangeEvent<any>) => {
        this.changeValue(evt.target.value, true);
    }
    */
    render() {
        let { defaultValue, list } = this.ui;
        let { isRow, inNode } = this.context;
        let rowKey;
        if (isRow === true) {
            rowKey = this.context.rowKey;
        }
        let cn = classNames(this.className, 'py-0');
        return React.createElement("span", { className: cn, style: radioStyle }, list.map((v, index) => {
            let { value, title } = v;
            let name = this.name;
            if (rowKey !== undefined)
                name += '-' + rowKey;
            return React.createElement("label", { key: index, className: "form-radio-inline" },
                React.createElement("input", { ref: input => this.inputs[index] = input, type: "radio", name: name, value: value, defaultChecked: (this.defaultValue || defaultValue) === value, onChange: this.onInputChange }),
                title || value);
            //</span>
        }));
    }
}
//# sourceMappingURL=radioWidget.js.map