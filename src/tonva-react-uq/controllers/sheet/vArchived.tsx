import * as React from 'react';
import {Page} from 'tonva-tools';
import { VSheetView } from './vSheetView';
import { CSheet, SheetUI, SheetData } from './cSheet';

export interface State {
    flows: any;
    data: any;
}
export class VArchived extends VSheetView {
    //protected controller: CSheet;
    //brief: any;

    async open(sheetData:SheetData) {
        this.sheetData = sheetData;
        /*
        let {brief, data, flows} = await this.controller.getArchived(inBrief.id);
        this.brief = brief;
        this.data = data;
        this.flows = flows;
        */
        this.vForm = this.createForm(undefined, this.sheetData.data);
        this.openPage(this.view);
    }

    protected view = () => {
        let {brief} = this.sheetData;
        return <Page header={this.label + ':' + '-' + brief.no}>
            <this.sheetView />
        </Page>;
    };
}
