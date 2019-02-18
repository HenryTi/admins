import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { UQController } from '.';
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
import { DevModel } from 'model';
import { appItemIcon } from 'consts';
import { NewPage } from './editPage';

export class ListPage extends VPage<UQController> {
    async open(param:any) {
        this.openPage(this.page);
    }
    private newItem = () => {
        this.openVPage(NewPage);
    }
    private page = ():JSX.Element => {
        let {uqList: list, listRowClick} = this.controller;
        let right = <button className='btn btn-secondary btn-sm' onClick={()=>this.newItem()}><FA name="plus" /></button>;
        return <Page header="UQ" right={right}>
            <List items={list} item={{render: this.listRow, onClick: listRowClick}} />
        </Page>
    }
    private listRow = (item:DevModel.UQ):JSX.Element => {
        let {name, discription, service_count} = item;
        let icon = appItemIcon;
        return <LMR className="py-1 px-3 align-items-stretch"
            left={<Badge size="sm" className="pt-1"><img src={icon} /></Badge>}
            right={<>{service_count}</>}>
            <div className="px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }
}
