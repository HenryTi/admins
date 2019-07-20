import * as React from 'react';
import { observable } from 'mobx';
import { Controller, VPage, Page } from 'tonva';
import { mainApi } from 'api';
import { LMR, FA } from 'tonva';
import { VApps } from './vApps';
import { VUsers } from './vUsers';
import { VApp } from './vApp';
import { VUser } from './vUser';
import { VAppEditUsers } from './vAppEditUsers';
import { VUserEditApps } from './vUserEditApps';
import { VAddUser } from './VAddUser';
import { Unit } from 'model';

export interface User {
    id: number;
    name: string;
    nick: string;
    icon: string;
    assigned: string;
}
export interface App {
    id: number;
    name: string;
    discription: string;
}
export interface UserApps {
    user: User;
    apps: App[];
}
export interface AppUsers {
    app: App;
    users: User[];
    more: boolean;
}
export interface EditApp extends App {
    bind: number;   // 0: not bind, 1: bind
}
export interface EditUser extends User {
    bind: number;  // 0: not bind, 1: bind
}

export class UsersController extends Controller {
    private unit: Unit;
    @observable userAppsList: UserApps[];
    @observable appUsersList: AppUsers[];
    curUser: User;
    @observable curUserApps: App[];
    @observable userEditApps: EditApp[];
    curApp: App;
    @observable curAppUsers: User[];
    @observable appEditUsers: EditUser[];

    protected async internalStart(unit:Unit) {
        this.unit = unit;
        let cn = "bg-white px-3 py-2 my-1";
        let appIcon = <FA name="columns" className="text-primary mr-3" />;
        let userIcon = <FA name="user-plus" className="text-primary mr-3" />;
        let right = <button className="btn btn-sm btn-success" onClick={this.onAddUser}><FA name="plus" /></button>;
        this.openPage(<Page header={'用户管理 - ' +  this.unit.name} right={right}>
            <LMR className={cn} onClick={this.onAppUsers} left={appIcon}>App</LMR>
            <LMR className={cn} onClick={this.onUserApps} left={userIcon}>用户</LMR>
        </Page>);
    }

    private onAppUsers = async () => {
        await this.loadAppUsers(undefined);
        this.openVPage(VApps);
    }

    private onUserApps = async () => {
        await this.loadUserApps(undefined);
        this.openVPage(VUsers);
    }

    private async loadAppUsers(key:string) {
        let list:AppUsers[] = [];
        let pageStart = 0;
        let pageSize = 100;
        let ret = await mainApi.unitAppUsers(this.unit.id, key, pageStart, pageSize);
        let apps = ret[0];
        let users = ret[1];
        let coll: {[id:number]:AppUsers} = {}
        for (let a of apps) {
            let app:App = {
                id: a.id,
                name: a.name,
                discription: a.discription,
            };
            list.push(coll[a.id] = {app:app, more:false, users:[]});
        }
        for (let u of users) {
            let user:User = {
                id: u.user,
                name: u.name,
                nick: u.nick,
                icon: u.icon,
                assigned: u.assigned
            }
            let item = coll[u.app];
            let {users} = item;
            if (users.length >= 5) {
                item.more = true;
            }
            else {
                users.push(user);
            }
        }
        this.appUsersList = list;
    }

    private async loadUserApps(key:string) {
        let list:UserApps[] = [];
        let pageStart = 0;
        let pageSize = 100;
        let ret = await mainApi.unitUsers(this.unit.id, key, pageStart, pageSize);
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
            list.push(coll[u.id] = {user:user, apps:[]});
        }
        for (let a of apps) {
            let app:App = {
                id: a.app,
                name: a.name,
                discription: a.discription,
            }
            coll[a.user].apps.push(app);
        }
        this.userAppsList = list;
    }

    searchUser = async(key:string) => {
        await this.loadUserApps(key);
    }

    searchApp = async(key:string) => {
        await this.loadAppUsers(key);
    }

    onAppsClick = async (appUsers: AppUsers) => {
        this.curApp = appUsers.app;
        let pageStart = 0;
        let pageSize = 100;
        this.curAppUsers = await mainApi.unitOneAppUsers(this.unit.id, this.curApp.id, pageStart, pageSize);
        this.openVPage(VApp);
    }

    onUsersClick = async (userApps: UserApps) => {
        this.curUser = userApps.user;
        let pageStart = 0;
        let pageSize = 100;
        this.curUserApps = await mainApi.unitOneUserApps(this.unit.id, this.curUser.id, pageStart, pageSize);
        this.openVPage(VUser);
    }

    onAppEditUsers = async (key?:string) => {
        let pageStart = 0;
        let pageSize = 100;
        this.appEditUsers = await mainApi.unitAppEditUsers(this.unit.id, this.curApp.id, key, pageStart, pageSize);
        this.openVPage(VAppEditUsers);
    }

    onAddUser = () => {
        this.openVPage(VAddUser);
    }

    onUserEditApps = async (key?:string) => {
        let pageStart = 0;
        let pageSize = 100;
        this.userEditApps = await mainApi.unitUserEditApps(this.unit.id, this.curUser.id, key, pageStart, pageSize);
        this.openVPage(VUserEditApps);
    }

    bindAppUser = async(user:User, checked:boolean) => {
        await mainApi.bindAppUser(this.unit.id, this.curApp.id, user.id, checked===true? 1:0);
        let appUsers = this.appUsersList.find(v => v.app.id === this.curApp.id);
        if (checked === true) {
            this.curAppUsers.push(user);
            if (appUsers) appUsers.users.push(user);
        }
        else {
            let index = this.curAppUsers.findIndex(v => v.id === user.id);
            if (index>=0) this.curAppUsers.splice(index, 1);
            if (appUsers) {
                index = appUsers.users.findIndex(v => v.id === user.id);
                if (index>=0) appUsers.users.splice(index, 1);
            }
        }
    }

    bindUserApp = async(app:App, checked:boolean) => {
        await mainApi.bindAppUser(this.unit.id, app.id, this.curUser.id, checked===true? 1:0);
        if (this.userAppsList === undefined) return;
        let userApps = this.userAppsList.find(v => v.user.id === this.curUser.id);
        if (checked === true) {
            this.curUserApps.push(app);
            if (userApps) userApps.apps.push(app);
        }
        else {
            let index = this.curUserApps.findIndex(v => v.id === app.id);
            if (index>=0) this.curUserApps.splice(index, 1);
            if (userApps) {
                index = userApps.apps.findIndex(v => v.id === app.id);
                if (index>=0) userApps.apps.splice(index, 1);
            }
        }
    }

    addUser = async (userId: number) => {
        await mainApi.unitAddUser(this.unit.id, userId);
    }
}
