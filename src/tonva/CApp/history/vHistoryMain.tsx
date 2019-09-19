import * as React from 'react';
import { History } from '../../uq';
import { Page } from '../../components';
import { VEntity } from '../CVEntity';
import { CHistory, HistoryUI } from './cHistory';

export class VHistoryMain extends VEntity<History, HistoryUI, CHistory> {
    async open(param?:any):Promise<void> {
        this.openPage(this.view);
    }

    protected view = () => <Page header={this.label}>
        History
    </Page>;
}
