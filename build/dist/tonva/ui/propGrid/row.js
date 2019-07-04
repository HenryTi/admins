import * as React from 'react';
import className from 'classnames';
export class PropRow {
    setValues(values) { }
}
export class PropBorder extends PropRow {
    render(key) {
        return React.createElement("div", { key: '_b_' + key, className: "" },
            React.createElement("div", { className: "w-100" },
                React.createElement("div", { style: { borderTop: '1px solid #f0f0f0' } })));
    }
}
export class PropGap extends PropRow {
    constructor(param) {
        super();
        this.param = param;
    }
    render(key) {
        let w;
        switch (this.param) {
            default:
                w = 'py-2';
                break;
            case '=':
                w = 'py-1';
                break;
            case '-':
                w = 'pb-1';
                break;
        }
        let cn = className(w);
        return React.createElement("div", { key: '_g_' + key, className: cn, style: { backgroundColor: '#f0f0f0' } });
    }
}
const valueAlignStart = 'justify-content-start';
const valueAlignCenter = 'justify-content-center';
const valueAlignEnd = 'justify-content-end';
export class LabeledPropRow extends PropRow {
    //protected values: any;
    constructor(gridProps, prop) {
        super();
        this.gridProps = gridProps;
        this.prop = prop;
        this.col = gridProps.labelFixLeft === true ? 'col' : 'col-sm';
        //this.values = values;
    }
    render(key) {
        let { onClick, bk } = this.prop;
        let cn = className({
            "cursor-pointer": onClick !== undefined,
            "bg-white": bk === undefined,
            "row": true
        });
        return React.createElement("div", { key: key, className: cn, onClick: onClick },
            this.renderLabel(),
            this.renderProp());
    }
    renderLabel() {
        let { label } = this.prop;
        if (label === undefined)
            return null;
        return React.createElement("label", { className: this.col + '-3 col-form-label' }, label);
    }
    renderProp() {
        let { label } = this.prop;
        let align, vAlign;
        switch (this.gridProps.alignValue) {
            case 'left':
                align = valueAlignStart;
                break;
            case 'center':
                align = valueAlignCenter;
                break;
            case 'right':
                align = valueAlignEnd;
                break;
        }
        switch (this.prop.vAlign) {
            case 'top':
                vAlign = 'align-items-start';
                break;
            default:
            case 'center':
                vAlign = 'align-items-center';
                break;
            case 'bottom':
                vAlign = 'align-items-end';
                break;
            case 'stretch':
                vAlign = 'align-items-stretch';
                break;
        }
        let col = this.col + (label === undefined ? '-12' : '-9');
        let cn = className(align, vAlign, col, 'd-flex');
        return React.createElement("div", { className: cn }, this.renderPropBody());
    }
    renderPropBody() {
        return React.createElement("div", { className: "form-control-plaintext" }, this.renderPropContent());
    }
    renderPropContent() {
        return this.content;
    }
}
export class StringPropRow extends LabeledPropRow {
    setValues(values) {
        if (values === undefined)
            this.content = undefined;
        else
            this.content = values[this.prop.name];
    }
}
export class NumberPropRow extends LabeledPropRow {
    setValues(values) {
        if (values === undefined)
            this.content = undefined;
        else
            this.content = values[this.prop.name];
    }
}
export class ListPropRow extends LabeledPropRow {
    setValues(values) {
        if (values === undefined)
            this.content = undefined;
        else {
            let list = this.prop.list;
            if (typeof list === 'string')
                this.content = values[list];
            else
                this.content = undefined;
        }
    }
    renderPropBody() {
        let { list, row } = this.prop;
        let items = typeof list === 'string' ? this.content : list;
        if (items === undefined)
            return React.createElement("div", null);
        // new row(item)
        return React.createElement("div", { className: "w-100" }, items.map((item, index) => React.createElement(React.Fragment, { key: index },
            index === 0 ? null : React.createElement("div", { style: { width: '100%', borderBottom: '1px solid #f0f0f0' } }),
            React.createElement(row, item))));
    }
}
export class ComponentPropRow extends LabeledPropRow {
    renderPropBody() {
        let { component } = this.prop;
        return component;
    }
    renderProp() {
        let { label, full } = this.prop;
        let align, vAlign;
        switch (this.gridProps.alignValue) {
            case 'left':
                align = valueAlignStart;
                break;
            case 'center':
                align = valueAlignCenter;
                break;
            case 'right':
                align = valueAlignEnd;
                break;
        }
        switch (this.prop.vAlign) {
            case 'top':
                vAlign = 'align-items-start';
                break;
            default:
            case 'center':
                vAlign = 'align-items-center';
                break;
            case 'bottom':
                vAlign = 'align-items-end';
                break;
            case 'stretch':
                vAlign = 'align-items-stretch';
                break;
        }
        let col;
        if (full !== true)
            col = this.col + (label === undefined ? '-12' : '-9');
        else
            col = 'w-100';
        let cn = className(align, vAlign, col, 'd-flex');
        return React.createElement("div", { className: cn }, this.renderPropBody());
    }
}
//# sourceMappingURL=row.js.map