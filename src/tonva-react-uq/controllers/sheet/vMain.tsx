import * as React from 'react';
import { observer } from 'mobx-react';
import { Page } from 'tonva-tools';
import { List, Muted, LMR } from 'tonva-react-form';
import { VEntity } from '../CVEntity';
import { Sheet } from '../../entities';
import { CSheet, SheetUI } from './cSheet';

export class VSheetMain extends VEntity<Sheet, SheetUI, CSheet> {
    async open() {
        this.openPage(this.view);
    }

    newClick = () => this.event('new');
    schemaClick = () => this.event('schema'); 
    archivesClick = () => this.event('archives');
    sheetStateClick = (state) => this.event('state', state);

    renderState = (item:any, index:number) => {
        let {state, count} = item;
        if (count === 0) return null;
        let badge = <span className="badge badge-success ml-5 align-self-end">{count}</span>;
        return <LMR className="px-3 py-2" left={this.controller.getStateLabel(state)} right={badge} />;
    }

    protected view = observer(() => {
        let list = this.controller.statesCount.filter(row=>row.count);
        let right = <button className="btn btn-outline-primary" onClick={this.archivesClick}>已归档</button>;
        let templet:any;
        if (this.isDev === true) {
            templet = <button className="btn btn-primary mr-2" color="primary" onClick={this.schemaClick}>模板</button>;
        }
        return <Page header={this.label}>
            <LMR
                className="mx-3 my-2"
                right={right}>
                <button className="btn btn-primary mr-2" color="primary" onClick={this.newClick}>新建</button>
                {templet}
            </LMR>
            <List className="my-2"
                header={<Muted className="mx-3 my-1">待处理{this.label}</Muted>}
                none="[ 无 ]"
                items={list}
                item={{render:this.renderState, onClick:this.sheetStateClick}} />
        </Page>;
    });
}
