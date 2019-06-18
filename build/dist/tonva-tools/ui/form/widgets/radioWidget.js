import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
//const radioStyle:React.CSSProperties = {width:'2em', height:'1.2em'};
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
    render() {
        let { defaultValue, list } = this.ui;
        let { isRow, inNode } = this.context;
        let rowKey;
        if (isRow === true) {
            rowKey = this.context.rowKey;
        }
        let cn = classNames(this.className, 'form-radio-inline');
        return React.createElement("span", { className: cn }, list.map((v, index) => {
            let { value, title } = v;
            let name = this.name;
            if (rowKey !== undefined)
                name += '-' + rowKey;
            return React.createElement("label", { key: index, className: "form-radio-inline" },
                React.createElement("input", { ref: input => this.inputs[index] = input, type: "radio", name: name, value: value, defaultChecked: (this.defaultValue || defaultValue) === value }),
                title || value);
            //</span>
        }));
    }
}
/*
<div className="form-control d-flex border-0"><input
ref={(input)=>this.input = input}
className={classNames(this.className, 'align-self-center')}
type="checkbox"
style={{maxHeight:"1.2em"}}
defaultValue={this.defaultValue}
onChange={this.onChange} />
</div>
*/ 
//# sourceMappingURL=radioWidget.js.map