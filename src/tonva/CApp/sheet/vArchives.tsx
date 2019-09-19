import * as React from 'react';
import { Page, List, LMR, EasyDate, Muted } from '../../components';
import { VEntity } from '../CVEntity';
import { Sheet } from '../../uq';
import { SheetUI, CSheet } from './cSheet';

export class VArchives extends VEntity<Sheet, SheetUI, CSheet> {
    list: any[];

    async open() {
        this.list = await this.entity.getArchives(undefined, 10);
        this.openPage(this.view);
    }

    archiveClick = async (brief:any) => {
        if (brief.processing===1) return;
        this.event('archived', brief);
    }
    archiveRow = (row:any, index:number) => {
        let {date} = row;
        let left = <>
            {row.processing===1? '... ' : ''}
            {row.no} &nbsp; {row.discription}
        </>;
        let right = <Muted><EasyDate date={date} /></Muted>;
        return <LMR className="px-3 py-2" left={left} right={right} />
    }

    protected view = () => {
        return <Page header={'已归档' + this.label}>
            <List items={this.list} item={{render:this.archiveRow, onClick:this.archiveClick}} />
        </Page>;
    };
}
