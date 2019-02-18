import * as React from 'react';
import { Control, ControlBase } from './control';
export class UnknownControl extends Control {
    renderControl() {
        return React.createElement("div", { className: "form-control-plaintext" },
            React.createElement("div", { className: "alert alert-primary", role: "alert" },
                "don't know how to create control",
                React.createElement("br", null),
                "field: ",
                JSON.stringify(this.field),
                " must be object ",
                React.createElement("br", null),
                "face: ",
                JSON.stringify(this.face),
                " must be object ",
                React.createElement("br", null)));
    }
}
export class EmptyControl extends ControlBase {
    constructor(formView, element) {
        super(formView);
        this.element = element;
    }
    renderControl() {
        return React.createElement("div", { className: "form-control-plaintext" }, this.element);
    }
}
//# sourceMappingURL=unknownControl.js.map