import * as React from 'react';
import { VPage, Page } from 'tonva-tools';
import { jsonStringify } from '../../tools';
import { VForm } from '../form';
import { VEntity } from '../CVEntity';
import { CAction, ActionUI } from './cAction';
import { Action } from '../../entities';

export class VActionMain extends VEntity<Action, ActionUI, CAction> {
    protected vForm: VForm;
    protected returns: any;

    async open(param?:any):Promise<void> {
        this.vForm = this.createForm(this.onSubmit, param);
        this.openPage(this.mainPage);
    }

    private onSubmit = async () => {
        let values = this.vForm.getValues();
        this.returns = await this.controller.submit(values);
        this.closePage();
        this.openPage(this.resultPage);
    }

    protected mainPage = () => {
        let {label} = this.controller;
        return <Page header={label}>
            {this.vForm.render('mx-3 my-2')}
        </Page>;
    }

    protected resultPage = () => {
        let {label} = this.controller;
        return <Page header={label} back="close">
            完成！
            <pre>
                {jsonStringify(this.returns)}
            </pre>
        </Page>;
    }
}
