import * as React from 'react';
import { Pending } from '../../uq';
import { Page } from '../../components';
import { VEntity } from '../CVEntity';
import { CPending, PendingUI } from './cPending';

export class VPendingMain extends VEntity<Pending, PendingUI, CPending> {
    async open(param?:any):Promise<void> {
        this.openPage(this.view);
    }

    protected view = () => <Page header={this.label}>
        pending
    </Page>;
}
