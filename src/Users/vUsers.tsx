import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from 'tonva';
import { List, SearchBox, LMR, FA } from 'tonva';
import { UsersController, UserApps } from './cUsers';

export class VUsers extends VPage<UsersController> {
    async open() {
        this.openPage(this.page);
    }

    private renderRow = (userApps: UserApps, index:number):JSX.Element => {
        let {user, apps} = userApps;
        let {id, name, nick, icon, assigned} = user;
        return <div className="d-block px-3 py-2">
            <div className="mb-2">
                <FA name="user-o" className="text-primary mr-3" />
                <b>{assigned || nick || name}</b>
            </div>
            <div>
                <small className="text-muted">App: </small>
                {apps.length===0?'[无]':apps.map(a => a.name).join(', ')}
            </div>
        </div>;
    }

    private page = observer(() => {
        let {userAppsList, searchUser, onUsersClick} = this.controller;
        let searchBox = <SearchBox className="w-100 pr-1" 
            onSearch={searchUser} 
            placeholder="搜索用户" 
            allowEmptySearch={true} />;
        return <Page header={searchBox}>
            <List items={userAppsList} 
                item={{render: this.renderRow, onClick:onUsersClick, key: (item=>item.user.id)}} />
        </Page>;
    });
}

