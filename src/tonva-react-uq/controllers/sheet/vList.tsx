import * as React from 'react';
import { Page, nav } from 'tonva-tools';
import { List, Muted, FA, LMR, EasyDate } from 'tonva-react-form';
import { VEntity } from '../CVEntity';
import { Sheet } from '../../entities';
import { CSheet, SheetUI } from './cSheet';

export class VSheetList extends VEntity<Sheet, SheetUI, CSheet> {
    protected row: (values) => JSX.Element;
    stateName: string;
    stateLabel: string;

    async showEntry(item:any) {
        this.row = this.ui.listRow || this.rowContent;
        this.stateName = item.state;
        this.stateLabel = this.controller.getStateLabel(this.stateName);
        //await this.controller.getStateSheets(this.stateName, 0, 10);
        await this.controller.pageStateItems.first(this.stateName);
        this.openPage(this.view);
    }

    rowClick = async (brief:any) => {
        if (brief.processing===1) {
            this.event('processing', brief.id);
            return;
        }
        this.event('action', brief.id);
    }

    private onScrollBottom = () => {
        console.log('onScrollBottom');
        this.controller.pageStateItems.more();
    }

    protected rowContent = (row:any):JSX.Element => {
        let {id, no, discription, date, processing} = row;
        let left = <>            
            {no} &nbsp; <Muted>{discription}</Muted> {processing===1? '...' : ''}
        </>;
        let right = <Muted><EasyDate date={date} /></Muted>;
        return <LMR className="px-3 py-2" left={left} right={right} />;
    }

    private renderRow = (row:any, index:number) => <this.row {...row} />

    protected view = () => {
        //let sheets = this.controller.stateSheets;
        let {pageStateItems} = this.controller;
        return <Page header={this.label + ' - ' + this.stateLabel} onScrollBottom={this.onScrollBottom}>
            <List items={pageStateItems} item={{render:this.renderRow, onClick:this.rowClick}} />
        </Page>;
    }
}
