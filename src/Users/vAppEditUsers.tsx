import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from 'tonva';
import { List, SearchBox, LMR, Muted, FA } from 'tonva';
import { UsersController, EditUser } from './cUsers';

export class VAppEditUsers extends VPage<UsersController> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let {curApp, appEditUsers, onAppEditUsers} = this.controller;
        return <Page header={curApp.name + ' - 增减用户'} >
            <List items={appEditUsers} item={{render:this.renderUser}} />
        </Page>
    })

    private renderUser = (editUser: EditUser, index:number):JSX.Element => {
        let {name, nick, assigned, bind} = editUser;
        let content:any;
        if (assigned)
            content = <>{assigned} <Muted>{name}</Muted></>;
        else if (nick)
            content = <>{nick} <Muted>{name}</Muted></>;
        else
            content = <>{name}</>
        let right = <input type="checkbox" defaultChecked={bind===1} 
            onChange={(evt)=>this.onUserChanged(editUser, evt.target.checked)} />;
        return <LMR className="px-3 py-2 align-items-center" right={right}>
            {content}
        </LMR>
    }

    private onUserChanged = async (editUser: EditUser, checked:boolean) => {
        await this.controller.bindAppUser(editUser, checked);
        editUser.bind = checked===true? 1: 0;
    }
}