import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { AppController } from '.';
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
import { DevModel } from 'model';
import { appItemIcon } from 'consts';
import { NewPage } from './editPage';

export class ListPage extends VPage<AppController> {
    async showEntry(param:any) {
        this.openPage(this.page);
    }
    private newItem = () => {
        this.showVPage(NewPage);
    }
    private page = ():JSX.Element => {
        let {appList, listRowClick} = this.controller;
        let right = <button className='btn btn-secondary btn-sm' onClick={()=>this.newItem()}><FA name="plus" /></button>;
        return <Page header="App" right={right}>
            <List items={appList} item={{render: this.listRow, onClick: listRowClick}} />
        </Page>
    }
    private listRow = (item:DevModel.App):JSX.Element => {
        let {name, discription} = item;
        let icon = appItemIcon;
        return <LMR className="py-1 px-3 align-items-stretch"
            left={<Badge size="sm" className="pt-1"><img src={icon} /></Badge>}>
            <div className="px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }
}

