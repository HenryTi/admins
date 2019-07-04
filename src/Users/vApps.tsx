import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from 'tonva';
import { List, SearchBox, LMR, FA } from 'tonva';
import { UsersController, UserApps, AppUsers } from './cUsers';

export class VApps extends VPage<UsersController> {
    async open() {
        this.openPage(this.page);
    }

    private renderRow = (appUsers: AppUsers, index:number):JSX.Element => {
        let {app, users} = appUsers;
        let {id, name, discription} = app;
        let right = <small className="text-muted">{discription}</small>;
        return <div className="d-block px-3 py-2">
            <LMR className="mb-2" right={right}>
                <FA name="address-card-o" className="text-primary mr-3" />
                <b>{name}</b>
            </LMR>
            <div>
                <small className="text-muted">用户: </small>
                {users.length===0?'[无]':users.map(u => u.assigned || u.nick || u.name).join(', ')}
            </div>
        </div>;
    }

    private page = observer(() => {
        let {appUsersList, searchApp, onAppsClick} = this.controller;
        let searchBox = <SearchBox className="w-100 pr-1" 
            onSearch={searchApp} 
            placeholder="搜索App" 
            allowEmptySearch={true} />;
        return <Page header={searchBox}>
            <List items={appUsersList} 
                item={{render: this.renderRow, onClick:onAppsClick,  key: (item=>item.app.id)}} />
        </Page>;
    });
}
