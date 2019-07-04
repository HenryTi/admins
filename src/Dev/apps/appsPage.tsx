import * as React from 'react';
import { VPage, Page, Image } from 'tonva';
import { AppController } from '.';
import { List, LMR, Badge, Muted, FA } from 'tonva';
import { DevModel } from 'model';
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
        let {name, caption, discription, icon, url, urlDebug} = item;
        let left = <Badge size="sm"><Image src={icon} /></Badge>;
        let right = <div className="text-muted small text-right">
            {url || '-'}<br/>
            {urlDebug}
        </div>;
        let spanCaption = caption?
            <>{name}: <b>{caption}</b></> :
            <b>{name}</b>;
        return <LMR className="py-2 px-3 align-items-stretch"
            left={left} right={right}>
            <div className="px-3">
                <div>{spanCaption}</div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }
}

