import * as React from 'react';
import { Page } from 'tonva-tools';
import { FA } from 'tonva-react-form';
import { Sheet } from '../../entities';
import { VForm } from '../form';
import { VEntity } from '../CVEntity';
import { SheetUI, CSheet } from './cSheet';

export class VSheetNew extends VEntity<Sheet, SheetUI, CSheet> {
    vForm: VForm;

    async open(param?:any) {
        this.vForm = this.createForm(this.onSubmit, param);
        this.openPage(this.view);
    }

    private onSubmit = async ():Promise<void> => {
        let values = this.vForm.getValues();
        let valuesWithBox = this.vForm.values;
        //let ret = 
        await this.controller.onSave(values, valuesWithBox);
        /*
        this.ceasePage();
        //this.openPage(this.finishedPage);
        await this.controller.showSaved(ret);
        */
    }

    protected view = () => <Page header={this.label}>
        {this.vForm.render()}
    </Page>;
}
