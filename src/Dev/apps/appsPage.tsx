import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { AppController } from '.';
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
import { DevModel } from 'model';
import { appItemIcon } from 'consts';
import { NewPage } from './editPage';

export class AppsPage extends VPage<AppController> {
    async open(param:any) {
        this.openPage(this.page);
    }
    private newItem = () => {
        this.openVPage(NewPage);
    }
    private page = ():JSX.Element => {
        let {appList, listRowClick} = this.controller;
        let right = <button className='btn btn-secondary btn-sm' onClick={()=>this.newItem()}><FA name="plus" /></button>;
        return <Page header="App" right={right}>
            <List items={appList} item={{render: this.appRow, onClick: listRowClick}} />
        </Page>
    }
    private appRow = (item:DevModel.App):JSX.Element => {
        let {name, discription, url, urlDebug} = item;
        let icon = appItemIcon;
        let left = <Badge size="sm" className="pt-1"><img src={icon} /></Badge>;
        let right = <div className="text-muted small text-right">
            {url || '-'}<br/>
            {urlDebug}
        </div>;
        return <LMR className="py-1 px-3 align-items-stretch"
            left={left} right={right}>
            <div className="px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }
}

