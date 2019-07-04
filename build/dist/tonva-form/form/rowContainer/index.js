import * as React from 'react';
import { createControl } from '../control';
export class RowContainer {
    constructor(form, row) {
        this.form = form;
        this.row = row;
        if (row.type === undefined) {
            let cc = row.createControl;
            if (cc === undefined)
                cc = form.createControl;
            if (cc === undefined)
                cc = createControl;
            this.control = cc(form, row);
        }
    }
    isOk() {
        if (this.control === undefined)
            return true;
        return this.control.isOk();
    }
    contains(fieldName) {
        let field = this.row.field;
        if (field !== undefined)
            return fieldName === field.name;
        let group = this.row.group;
        if (group !== undefined)
            return group.find(g => g.field.name === fieldName) !== undefined;
        return false;
    }
    get hasError() { return this.control.hasError; }
    get filled() { return this.control.filled; }
    clear() {
        if (this.control !== undefined)
            this.control.clear();
    }
    clearErrors() {
        if (this.control !== undefined)
            this.control.clearErrors();
    }
    readValues(values) {
        if (this.control !== undefined)
            this.control.readValues(values);
    }
    setError(fieldName, error) {
        if (this.control !== undefined)
            this.control.setError(fieldName, error);
    }
    setInitValues(values) {
        if (this.control !== undefined)
            this.control.setInitValues(values);
    }
}
class ElementRowContainer extends RowContainer {
    render(key) {
        return React.createElement("div", { key: key, className: "form-group" }, this.row);
    }
    get hasError() { return false; }
    get filled() { return false; }
}
class BootStrapRowContainer extends RowContainer {
    render(key) {
        return React.createElement("div", { key: key, className: 'form-group row' },
            React.createElement("label", { className: 'col-sm-2 col-form-label' }, this.row.label),
            this.control.render());
        //has-success is-valid
    }
}
export function bootstrapCreateRow(form, row) {
    return new BootStrapRowContainer(form, row);
}
export function elementCreateRow(form, row) {
    return new ElementRowContainer(form, row);
}
//# sourceMappingURL=index.js.map