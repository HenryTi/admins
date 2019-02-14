import * as React from 'react';
import { TuidMain, Pending, Entity } from '../../entities';
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
import { CPending, PendingUI } from './cPending';

export class VPendingMain extends VEntity<Pending, PendingUI, CPending> {
    async showEntry(param?:any):Promise<void> {
        this.openPage(this.view);
    }

    protected view = () => <Page header={this.label}>
        pending
    </Page>;
}
