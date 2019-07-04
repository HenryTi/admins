import * as React from 'react';
import { Page } from 'tonva';
import { MultiStep } from 'tonva';
export default class TestTonvaMultiForm extends React.Component {
    constructor() {
        super(...arguments);
        this.fields = {
            decA: { name: 'decA', type: 'dec', max: 100, required: true },
            intA: { name: 'intA', type: 'int', min: 10, max: 100 },
            numberA: { name: 'numberA', type: 'number', min: 10, max: 100, required: true },
            a: { name: 'a', type: 'id', required: true },
            b: { name: 'b', type: 'string', maxLength: 10 },
            c: { name: 'c', type: 'bool' },
        };
        this.steps = {
            step1: {
                formRows: [
                    { label: 'c', field: this.fields.c },
                    { label: 'decA', field: this.fields.decA },
                    { label: 'xxx', help: React.createElement("div", { key: 'r1' }, "dddd") },
                    { label: 'b', field: this.fields.b },
                ],
                next: 'step2',
                ex: '选择'
            },
            step2: {
                formRows: [
                    { label: 'intA', field: this.fields.intA },
                    { label: 'numberA', field: this.fields.numberA },
                ],
                next: undefined,
                ex: '完成'
            }
        };
    }
    stepHeader(step, num) {
        return React.createElement("div", { className: "d-flex justify-content-center align-items-center" },
            React.createElement("h4", null,
                React.createElement("small", { className: "text-muted" },
                    "\u7B2C",
                    num,
                    "\u6B65"),
                " ",
                step.ex));
    }
    onSubmit(values) {
        alert(JSON.stringify(values));
        return;
    }
    render() {
        return React.createElement(Page, { header: 'Test Tonva Form' },
            React.createElement(MultiStep, { className: "mt-4", header: this.stepHeader, steps: this.steps, first: "step1", onSubmit: this.onSubmit }));
    }
}
//# sourceMappingURL=TestTonvaMultiStep.js.map