import * as React from 'react';
import { Page } from 'tonva-tools';
import { VForm, FormMode } from '../form';
import { VSheetView } from './vSheetView';
import { SheetData } from './cSheet';

export class VSheetEdit extends VSheetView { //VEntity<Sheet, SheetUI, CSheet> {
    protected sheetData: SheetData;
    async open(param: SheetData) {
        this.sheetData = param;
        this.vForm = this.createForm(this.onSubmit, param.data, FormMode.edit);
        this.openPage(this.view);
    }

    onSubmit = async ():Promise<void> => {
        let values = this.vForm.getValues();
        await this.controller.saveSheet(values, this.vForm.values);
        this.closePage();
        this.returnCall(this.vForm.values);
    }

    protected view = () => <Page header={this.label}>
        {this.vForm.render()}
    </Page>;
}
