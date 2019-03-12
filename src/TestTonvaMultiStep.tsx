import * as React from 'react';
import {Page} from 'tonva-tools';
import {Fields, MultiStep, SubmitResult, Step} from 'tonva-react-form';

export default class  TestTonvaMultiForm extends React.Component {
    private fields:Fields = {
        decA: {name:'decA', type:'dec', max:100, required:true },
        intA: {name:'intA', type:'int', min:10, max:100 },
        numberA: {name:'numberA', type:'number', min:10, max:100, required:true },
        a: {name:'a', type:'id', required:true },
        b: {name:'b', type:'string', maxLength: 10},
        c: {name:'c', type:'bool'},
    };
    private steps = {
        step1: {
            formRows: [
                {label: 'c', field:this.fields.c},
                {label: 'decA', field:this.fields.decA},
                {label: 'xxx', help: <div key='r1'>dddd</div>},
                {label: 'b', field:this.fields.b},
            ],
            next: 'step2',
            ex: '选择'
        },
        step2: {
            formRows: [
                {label: 'intA', field:this.fields.intA},
                {label: 'numberA', field:this.fields.numberA},
            ],
            next: undefined,
            ex: '完成'
        }
    };
    private stepHeader(step:Step, num:number):JSX.Element {
        return <div className="d-flex justify-content-center align-items-center">
            <h4><small className="text-muted">第{num}步</small> {step.ex}</h4>
        </div>;
    }
    onSubmit(values:any):Promise<SubmitResult|undefined> {
        alert(JSON.stringify(values));
        return;
    }
    render() {
        return <Page header='Test Tonva Form'>
            <MultiStep className="mt-4" header={this.stepHeader} steps={this.steps} first="step1" onSubmit={this.onSubmit} />
        </Page>
    }
}
