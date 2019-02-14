import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Controller, VPage, Page } from "tonva-tools";
import { mainApi } from 'api';
import { List, SearchBox } from 'tonva-react-form';

interface User {
    id: number;
    name: string;
    nick: string;
    icon: string;
    assigned: string;
}
interface App {
    id: number;
    name: string;
    discription: string;
}
interface UserApps {
    user: User;
    apps: App[];
}

export class UsersController extends Controller {
    private unitId: number;
    @observable userAppsList: UserApps[];

    protected async internalStart(unitId:number) {
        this.unitId = unitId;
        await this.loadUserApps(undefined);
        this.showVPage(VUsers);
    }

    private async loadUserApps(key:string) {
        let userAppsList:UserApps[] = [];
        let pageStart = 0;
        let pageSize = 100;
        let ret = await mainApi.unitUsers(this.unitId, key, pageStart, pageSize);
        let users = ret[0];
        let apps = ret[1];
        let coll: {[id:number]:UserApps} = {}
        for (let u of users) {
            let user:User = {
                id: u.id,
                name: u.name,
                nick: u.nick,
                icon: u.icon,
                assigned: u.assigned
            };
            userAppsList.push(coll[u.id] = {user:user, apps:[]});
        }
        for (let a of apps) {
            let app:App = {
                id: a.app,
                name: a.name,
                discription: a.discription,
            }
            coll[a.user].apps.push(app);
        }
        this.userAppsList = userAppsList;
    }

    searchUser = async(key:string) => {
        await this.loadUserApps(key);
    }
}

class VUsers extends VPage<UsersController> {
    async showEntry() {
        this.openPage(this.page);
    }

    private renderRow = (userApps: UserApps, index:number):JSX.Element => {
        let {user, apps} = userApps;
        let {id, name, nick, icon, assigned} = user;
        return <div className="d-block px-3 py-2">
            <div className="mb-2">{assigned || nick || name}</div>
            <div className="small">
                <span className="text-muted">APP: </span>
                {apps.length===0?'[无]':apps.map(a => a.name).join(', ')}
            </div>
        </div>;
    }

    private page = observer(() => {
        let {userAppsList, searchUser} = this.controller;
        let searchBox = <SearchBox className="w-100 pr-1" 
            onSearch={searchUser} 
            placeholder="搜索用户" 
            allowEmptySearch={true} />;
        return <Page header={searchBox}>
            <List items={userAppsList} 
                item={{render: this.renderRow, key: (item=>item.user.id)}} />
        </Page>;
    });
}
