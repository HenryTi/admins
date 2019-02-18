import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from "tonva-tools";
import { List, SearchBox, LMR } from 'tonva-react-form';
import { UsersController, UserApps, AppUsers, App, EditApp } from './cUsers';

export class VUserEditApps extends VPage<UsersController> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let {curUser, userEditApps, onUserEditApps} = this.controller;
        return <Page header={(curUser.assigned || curUser.nick || curUser.name) + ' - 增减App'}>
            <List items={userEditApps} item={{render:this.renderApp}} />
        </Page>
    })

    private renderApp = (editApp: EditApp, index:number):JSX.Element => {
        let {name, discription, bind} = editApp;
        let right = <input type="checkbox" defaultChecked={bind===1} 
            onChange={(evt)=>this.onAppChanged(editApp, evt.target.checked)} />;
        return <LMR className="px-3 py-2" right={right}>
            {name} {discription}
        </LMR>
    }

    private onAppChanged = async (editApp: EditApp, checked:boolean) => {
        await this.controller.bindUserApp(editApp, checked);
        editApp.bind = checked===true? 1: 0;
    }
}