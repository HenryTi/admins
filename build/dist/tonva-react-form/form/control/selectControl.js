import * as React from 'react';
import { Control } from './control';
export class SelectControl extends Control {
    constructor(formView, field, face) {
        super(formView, field, face);
        this.ref = this.ref.bind(this);
    }
    getValueFromElement() {
        let { selectedIndex, selectedOptions } = this.element;
        let v = selectedOptions[0].value;
        switch (this.field.type) {
            case 'number':
                v = Number(v);
                break;
            case 'date':
                v = new Date(v);
                break;
            case 'bool':
                if (typeof v === 'string') {
                    v = (v.toLowerCase() === 'true');
                }
                break;
        }
        return v;
    }
    renderControl() {
        let { list } = this.face;
        let def = this.face.default;
        let options = [];
        if (def === undefined)
            options.push(React.createElement("option", { key: -1, value: undefined }, "\u8BF7\u9009\u62E9"));
        options.push(...list.map((item, index) => {
            let t, v;
            if (typeof item !== 'object')
                t = v = item;
            else {
                t = item.text;
                v = item.value;
            }
            return React.createElement("option", { key: index, value: v }, t);
        }));
        return React.createElement("div", { className: "form-control-static" },
            React.createElement("select", { name: this.field.name, className: "form-control", ref: this.ref }, options));
    }
}
//# sourceMappingURL=selectControl.js.map