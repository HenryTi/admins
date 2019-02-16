import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from "tonva-tools";
import { List, SearchBox, LMR } from 'tonva-react-form';
import { UsersController, UserApps, AppUsers, App } from './cUsers';

export class VUser extends VPage<UsersController> {
    async showEntry() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let {curUser, curUserApps, onUserEditApps} = this.controller;
        let right = <button className="btn btn-sm btn-success" onClick={()=>onUserEditApps()}>增减App</button>;
        return <Page header={'用户 - ' + (curUser.assigned || curUser.nick || curUser.name)}
            right={right}>
            <List items={curUserApps} item={{render:this.renderApp}} />
        </Page>
    })

    private renderApp = (app: App, index:number):JSX.Element => {
        let {name, discription} = app;
        return <div className="px-3 py-2">{name} {discription}</div>
    }
}