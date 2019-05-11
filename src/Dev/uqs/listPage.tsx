import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { UQController } from '.';
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
import { DevModel } from 'model';
import { NewPage } from './editPage';
import { store } from 'store';

export class ListPage extends VPage<UQController> {
    async open(param:any) {
        this.openPage(this.page);
    }
    private newItem = () => {
        this.controller.uq = undefined;
        this.openVPage(NewPage);
    }
    private page = ():JSX.Element => {
        let {uqList: list, listRowClick} = this.controller;
        let {isOwner} = store.unit;
        let right = isOwner>0 && <button className='btn btn-secondary btn-sm' onClick={()=>this.newItem()}><FA name="plus" /></button>;
        return <Page header="UQ" right={right}>
            <List items={list} item={{render: this.listRow, onClick: listRowClick}} />
        </Page>
    }
    private listRow = (item:DevModel.UQ):JSX.Element => {
        let {name, discription, service_count} = item;
        return <LMR className="py-1 px-3 align-items-center"
            left={<FA name="database" className="text-primary fa-lg" />}
            right={<>{service_count}</>}>
            <div className="py-2 px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }
}

