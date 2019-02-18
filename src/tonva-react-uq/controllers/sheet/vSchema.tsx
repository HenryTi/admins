import * as React from 'react';
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
import { Sheet } from '../../entities';
import { SheetUI, CSheet } from './cSheet';

export class VSheetSchema extends VEntity<Sheet, SheetUI, CSheet> {
    async open(param?:any) {
        this.openPage(this.view);
    }

    protected view = () => <Page header={this.label + "模板"}>
        <pre className="mx-3 my-2">{this.entity.schemaStringify()}</pre>
    </Page>;
}

