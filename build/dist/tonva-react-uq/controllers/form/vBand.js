import * as React from 'react';
export class VBand {
    constructor(label) {
        this.view = () => React.createElement("div", null);
        this.label = label;
    }
    render() {
        //text-sm-right
        return React.createElement("div", { key: this.key, className: "px-3" },
            React.createElement("div", { className: "form-group row" },
                React.createElement("label", { className: "col-sm-2 col-form-label" }, this.label),
                React.createElement("div", { className: "col-sm-10" }, this.renderContent())));
    }
    setAddRow(addRow) { }
    get key() { return this.label; }
    getVFields() { return; }
    getVArr() { return; }
    getVSubmit() { return; }
    renderContent() {
        return React.createElement("div", { className: "form-control form-control-plaintext bg-white border border-info rounded " }, "content");
    }
}
export class VFieldBand extends VBand {
    constructor(label, vField) {
        super(label);
        this.vField = vField;
    }
    get key() { return this.vField.name; }
    getVFields() { return [this.vField]; }
    renderContent() {
        return this.vField.render();
        /*
        <div className="form-control form-control-plaintext bg-white border border-info rounded ">
            {this.vField.render()}
        </div>;*/
    }
}
export class VArrBand extends VBand {
    constructor(label, vArr) {
        super(label);
        this.vArr = vArr;
    }
    setAddRow(addRow) { this.vArr.setAddRow(addRow); }
    get key() { return this.vArr.name; }
    getVArr() { return this.vArr; }
    render() {
        return React.createElement(React.Fragment, { key: this.key }, this.vArr && this.vArr.render());
    }
}
export class VFieldsBand extends VBand {
    constructor(label, vFields) {
        super(label);
        this.vFields = vFields;
    }
    get key() { return this.vFields[0].name; }
    getVFields() { return this.vFields; }
    renderContent() {
        return React.createElement("div", { className: "form-control form-control-plaintext bg-white border border-info rounded " }, "fields");
    }
}
export class VSubmitBand extends VBand {
    constructor(vSubmit) {
        super(undefined);
        this.vSubmit = vSubmit;
    }
    get key() { return '$submit'; }
    getVSubmit() { return this.vSubmit; }
    render() {
        return React.createElement("div", { key: "$submit", className: "px-3" },
            React.createElement("div", { className: "form-group row" },
                React.createElement("div", { className: "offset-sm-2 col-sm-10" }, this.vSubmit.render())));
    }
}
//# sourceMappingURL=vBand.js.map