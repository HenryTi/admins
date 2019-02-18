import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from "tonva-tools";
import { List, SearchBox, LMR, Muted } from 'tonva-react-form';
import { UsersController, UserApps, AppUsers, User } from './cUsers';

export class VApp extends VPage<UsersController> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let {curApp, curAppUsers, onAppEditUsers} = this.controller;
        let right = <button className="btn btn-sm btn-success" onClick={()=>onAppEditUsers()}>增减用户</button>;
        return <Page header={'App - ' + (curApp.name)} right={right}>
            <List items={curAppUsers} item={{render:this.renderApp}} />
        </Page>
    })

    private renderApp = (user: User, index:number):JSX.Element => {
        let {name, nick, assigned} = user;
        let content:any;
        if (assigned)
            content = <>{assigned} <Muted>{name}</Muted></>;
        else if (nick)
            content = <>{nick} <Muted>{name}</Muted></>;
        else
            content = <>{name}</>
        return <div className="px-3 py-2">{content}</div>
    }
}