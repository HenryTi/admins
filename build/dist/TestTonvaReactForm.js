import * as React from 'react';
import { Page } from 'tonva-tools';
import {appIcon, appItemIcon} from './consts';
import { FormView, PropGrid, Media } from 'tonva-react-form';
import { createIdPick } from './createIdPick';
export default class TestTonvaForm extends React.Component {
    constructor() {
        super(...arguments);
        this.idPick = createIdPick({
            caption: '选择商品',
            candidateItems: [
                { id: 1, main: 'dddd1', vice: 'bbb1' },
                { id: 2, main: 'dddd2', vice: 'bbb2' },
                { id: 3, main: 'dddd3', vice: 'bbb3' },
            ],
            moreCandidates: () => { return; },
            row: (item, index) => React.createElement("div", null, item.main + ' ' + item.vice),
        });
        this.fields = {
            decA: { name: 'decA', type: 'dec', max: 100, required: true },
            intA: { name: 'intA', type: 'int', min: 10, max: 100 },
            numberA: { name: 'numberA', type: 'number', min: 10, max: 100, required: true },
            a: { name: 'a', type: 'id', required: true },
            b: { name: 'b', type: 'string', maxLength: 10 },
            c: { name: 'c', type: 'bool' },
        };
        this.formRows = [
            { label: 'decA', field: this.fields.decA },
            { label: 'xxx', help: React.createElement("div", { key: 'r1' }, "dddd") },
            { label: 'intA', field: this.fields.intA },
            { label: 'numberA', field: this.fields.numberA },
            { label: 'labelA', field: this.fields.a, face: {
                    type: 'pick-id',
                    initCaption: '请选择商品',
                    pick: this.idPick,
                    fromItem: (item) => { return { id: item.id, caption: item.main + ' ' + item.vice }; },
                } },
            { label: 'labelB', field: this.fields.b, face: { type: 'input', placeholder: 'kkk' } },
            { label: 'labelC', field: this.fields.c, face: { type: 'select', list: [{ text: 'a mmm bbb', value: 1 }, { text: 'b', value: 2 }] } },
            { label: 'labelC', field: this.fields.c, face: { type: 'radiobox', list: [
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'b', value: 2 },
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'a mmm bbb', value: 1 },
                        { text: 'a mmm bbb', value: 1 },
                    ] } },
            { label: undefined, field: this.fields.c, face: { type: 'checkbox', label: 'dDd' } },
            React.createElement("div", { key: 'r2' },
                React.createElement("p", null, "as dfsaf sadf asdf "),
                React.createElement("ul", null,
                    React.createElement("li", null, "a sdfasf asd fasfasf asfd as fasf asdf as df"),
                    React.createElement("li", null, "a sdfasf asd fasfasf asfd as fasf asdf as df"),
                    React.createElement("li", null, "a sdfasf asd fasfasf asfd as fasf asdf as df"),
                    React.createElement("li", null, "a sdfasf asd fasfasf asfd as fasf asdf as df"),
                    React.createElement("li", null, "a sdfasf asd fasfasf asfd as fasf asdf as df"))),
            { label: 'labelD', group: [{ field: { name: 'a', type: 'string' }, face: { type: 'checkbox' } }] }
        ];
        this.formView = new FormView({
            formRows: this.formRows,
            onSubmit: this.onSubmit.bind(this),
            submitButton: React.createElement("span", null,
                React.createElement("i", { className: 'fa fa-send' }),
                " \u63D0\u4EA4")
        });
        this.propValues = {
            icon: appIcon,
            a: 1,
            b: 'dsdffasfasdf',
            c: 'dsfasfd',
            d: [
                { main: 'bbb' },
                { main: 'eee' },
            ]
        };
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: this.propValues.icon, main: this.propValues.b, discription: this.propValues.c }) },
            '',
            { label: 'a-1', type: 'number', name: 'a' },
            '',
            { label: 'b-1', type: 'string', name: 'b', onClick: this.bClick.bind(this) },
            { label: 'c', type: 'string', name: 'c' },
            '',
            { label: 'd-List', type: 'list', list: 'd', row: ARow },
        ];
        //<TonvaForm formView={this.formView} />
    }
    onSubmit(values) {
        alert(JSON.stringify(values));
    }
    bClick() {
        alert('b');
    }
    render() {
        return React.createElement(Page, { header: 'Test Tonva Form' },
            React.createElement(PropGrid, { rows: this.rows, values: this.propValues }));
    }
}
class ARow extends React.Component {
    render() {
        return React.createElement("div", { className: 'py-1' }, this.props.main);
    }
}
//# sourceMappingURL=TestTonvaReactForm.js.map