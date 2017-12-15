import * as React from 'react';
import {Page} from 'tonva-tools';
import {Fields, FormRow, FormView, TonvaForm} from 'tonva-react-form';

const fields:Fields = {
    decA: {name:'decA', type:'dec', max:100, required:true },
    intA: {name:'intA', type:'int', min:10, max:100 },
    numberA: {name:'numberA', type:'number', min:10, max:100, required:true },
    a: {name:'a', type:'number', min:10, max:100, required:true },
    b: {name:'b', type:'string', maxLength: 10},
    c: {name:'c', type:'bool'},
}

const formRows:FormRow[] = [
    {label: 'decA', field:fields.decA},
    {label: 'intA', field:fields.intA},
    {label: 'numberA', field:fields.numberA},
    {label: 'labelA', field:fields.a},
    {key:'b', label: 'labelB', field:fields.b, face:{type:'input', placeholder:'kkk'}},
    {key:'c', label: 'labelC', field:fields.c, face:{type:'checkbox'}},
    {label: undefined, field:fields.c, face:{type:'checkbox'}},
    {label: 'labelD', group: [{field:{name:'a', type:'string'}, face:{type:'checkbox'}}]}
];

export default class  TestTonvaForm extends React.Component {
    private formView:FormView = new FormView({
        formRows: formRows,
        onSumit: this.onSubmit.bind(this),
        submitButton: <span><i className='fa fa-send' /> 提交</span>
    }, {decA: 22});

    private onSubmit(values:any) {
        alert(JSON.stringify(values));
    }

    render() {
        return <Page header='Test Tonva Form'>
            <TonvaForm formView={this.formView}>
                <TonvaForm.Others />
                dddd
                <TonvaForm.Row row='c' />
                <p>as dfsaf sadf asdf </p>
                <ul>
                    <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                    <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                    <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                    <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                    <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                </ul>
                <TonvaForm.Row row='b' />
                <TonvaForm.Buttons />
            </TonvaForm>
        </Page>;
    }
}
