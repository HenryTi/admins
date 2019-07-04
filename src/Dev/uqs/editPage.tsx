import * as React from 'react';
import { UQController } from './uqController';
import { VPage, nav, Page } from 'tonva';
import { SubmitResult, TonvaForm } from 'tonva-form';

const formRows = [
    {
        label: '名称', 
        field: {name: 'name', type: 'string', maxLength: 100, required: true},
    },
    {
        label: '描述',
        field: {name: 'discription', type: 'string', maxLength: 250},
        face: {type: 'textarea'}
    },
    //{
    //    label: '入口',
    //    field: {name: 'access', type: 'string', maxLength: 250},
    //    face: {type: 'textarea', placeholder: '逗号分隔的入口名'}
    //},
];


export abstract class EditBasePage extends VPage<UQController> {
    async open() {
        this.openPage(this.page);
    }
    protected onSubmit = async (values:any):Promise<SubmitResult> => {
        await this.controller.saveUq(values);
        nav.pop();
        return;
    }
    protected page: ()=>JSX.Element;
    protected form(initValues:any):JSX.Element {
        return <TonvaForm
            className="m-3"
            formRows={formRows} 
            onSubmit={this.onSubmit} initValues={initValues} />
    }
}

export class EditPage extends EditBasePage {
    protected page = () => {
        let {uq} = this.controller;
        let {name} = uq;
        return <Page header={'修改UQ - ' + name} back="close">
            {this.form(uq)}
        </Page>;
    }
}

export class NewPage extends EditBasePage {
    protected page = () => {
        return <Page header={'新建UQ'} back="close">
            {this.form({})}
        </Page>;
    }
}
