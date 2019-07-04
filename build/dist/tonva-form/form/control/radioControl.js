import * as React from 'react';
import { Control } from './control';
export class RadioControl extends Control {
    renderControl() {
        return React.createElement("div", { className: "form-control-static" },
            React.createElement("div", { className: "form-control" }, this.face.list.map((item, index) => {
                let t, v;
                if (typeof item !== 'object')
                    t = v = item;
                else {
                    t = item.text;
                    v = item.value;
                }
                return React.createElement("label", { key: index, className: "custom-control custom-radio w-25" },
                    React.createElement("input", { type: 'radio', name: this.field.name, className: "custom-control-input" }),
                    React.createElement("span", { className: "custom-control-indicator" }),
                    React.createElement("span", { className: "custom-control-description" }, t));
            })));
    }
}
//# sourceMappingURL=radioControl.js.map