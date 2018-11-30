import {observable, autorun} from 'mobx';
import * as _ from 'lodash';
//import {appIcon, appItemIcon} from './consts';
import {nav, meInFrame, getUrlOrDebug} from 'tonva-tools';
import {mainApi, devApi} from '../api';
import {Unit, UnitApps, App, Api, UnitAdmin, UnitApp, Role, RoleMember} from '../model';
import {Admins} from './admins';
import {Dev} from './dev';
import {CacheUnits, CacheApis, CacheApps, CacheServers} from './cacheIds';

export class Store {
    private get unitId():number {return meInFrame.unit;};
    admins:Admins;
    dev:Dev;
    cacheUnits: CacheUnits;
    cacheUsqs: CacheApis;
    cacheApps: CacheApps;
    cacheServers: CacheServers;
    usqlServer: string;

    @observable unit: Unit;
    @observable memberCount: number;
    @observable apps: UnitApp[];
    @observable role:Role;
    @observable roles: Role[];
    @observable roleApps: UnitApp[];
    @observable roleMember: RoleMember;
    @observable roleMembers: RoleMember[];
    @observable memberRoles: Role[];

    init() {
        this.unit = undefined;
        this.admins = new Admins(this);
        this.dev = new Dev(this);
        this.cacheUnits = new CacheUnits();
        this.cacheUsqs = new CacheApis();
        this.cacheApps = new CacheApps();
        this.cacheServers = new CacheServers();
    }

    logout() {
        //meInFrame.app = undefined;
        meInFrame.hash = undefined;
        //let unitId = process.env.REACT_APP_DEBUG_UNITID;
        //if (unitId !== undefined)
        //    meInFrame.unit = Number(unitId);
        meInFrame.unit = undefined;
        this.init();
        this.memberCount = undefined;
        this.apps = undefined;
        this.role = undefined;
        this.roles = undefined;
        this.roleApps = undefined;
        this.roleMember = undefined;
        this.roleMembers = undefined;
        this.memberRoles = undefined;
    }

    setRole(role:Role) {
        if (this.role === role) return;
        this.role = role;
        this.roleApps = undefined;
        this.roleMember = undefined;
        this.roleMembers = undefined;
        this.memberRoles = undefined;
    }

    setRoleUser(user:RoleMember) {
        if (this.roleMember === user) return;
        this.roleMember = user;
        this.memberRoles = undefined;
    }

    async unitChangeProp(prop:string, value:any):Promise<void> {
        await mainApi.unitChangeProp(this.unit.id, prop, value);
        this.unit[prop] = value;
    }

    async loadApps(): Promise<void> {
        if (this.apps !== undefined) return;
        this.apps = await mainApi.unitApps(this.unitId);
    }

    async loadUnit(): Promise<void> {
        if (this.unitId === undefined) return;
        console.log('loadUnit()');    
        let ret = await mainApi.unit(this.unitId);
        this.unit = ret;
        console.log("loadUnit unit=%s", JSON.stringify(ret));
        this.memberCount = await mainApi.unitMemberCount(this.unitId);
        let usqlServer = await devApi.usqlServer();
        let {url, urlDebug} = usqlServer;
        this.usqlServer = await getUrlOrDebug(url, urlDebug);
        console.log("usql-server: %s", JSON.stringify(this.usqlServer));
    }

    async stopUnitApp(appId:number): Promise<void> {
        await mainApi.unitDeleteApp(this.unit.id, appId, 1);
        let app = this.apps.find(v => v.id === appId);
        app.inUnit = 0;
    }

    async restoreUnitApp(appId:number): Promise<number> {
        let ret = await mainApi.unitAddApp(this.unit.id, appId);
        if (ret <= 0) return ret;
        let app = this.apps.find(v => v.id === appId);
        app.inUnit = 1;
        return 1;
    }

    async addUnitApp(app:UnitApp): Promise<number> {
        let ret = await mainApi.unitAddApp(this.unit.id, app.id);
        if (ret <= 0) return ret;
        this.apps.push(app);
        return 1;
    }

    async loadRoles(): Promise<void> {
        if (this.roles !== undefined) return;
        let ret = await mainApi.unitRoles(this.unit.id);
        ret.forEach(v => {
            switch (v.id) {
                case 1: 
                    v.name= '访客';
                    v.discription = '可以获取开放信息';
                    break;
                case 2: 
                    v.name= '普通';
                    v.discription = '能访问最基本的功能';
                    break;
            }
        });
        this.roles = ret;
    }

    async unitAddRole(name:string, discription:string): Promise<number> {
        let id = await mainApi.unitAddRole(this.unit.id, name, discription);
        if (id > 0) {
            this.roles.push({
                id: id,
                name: name,
                discription: discription,
                count: undefined,
            });
        }
        return id;
    }

    async roleChangeProp(prop:string, value:any):Promise<void> {
        await mainApi.unitRoleChangeProp(this.unit.id, this.role.id, prop, value);
        this.role[prop] = value;
    }

    async loadRoleApps():Promise<void> {
        let ret = await mainApi.unitRoleApps(this.unit.id, this.role.id);
        this.roleApps = ret.map(v => {
            return this.apps.find(app=>app.id === v.id);
        });
    }

    async setRoleApps(apps:UnitApp[]) {
        await mainApi.unitRoleSetApps(this.unit.id, this.role.id, apps.map(v=>v.id));
        this.roleApps = apps;
    }

    async loadMembers():Promise<void> {
        let ret = await mainApi.unitMembers(this.unit.id, this.role === undefined? 0:this.role.id, undefined, 0, 100);
        this.roleMembers = ret;
    }

    async unitAssignMember(assigned:string):Promise<void> {
        await mainApi.unitAssignMember(this.unit.id, this.roleMember.id, assigned);
        this.roleMember.assigned = assigned;
    }

    async loadMemberRoles():Promise<void> {
        let ret = await mainApi.unitMemberRoles(this.unit.id, this.roleMember.id);
        let roles:Role[] = ret.map(v => {
            let rId = v.id;
            let role = this.roles.find(r => r.id === rId);
            return _.clone(role);
        });
        this.memberRoles = roles;
    }

    async setMemberRoles(memberRoles:Role[]) {
        await mainApi.unitSetMemberRoles(this.unit.id, this.roleMember.id, memberRoles.map(v=>v.id));
        this.roles.forEach(role => {
            let rId = role.id;
            let org = this.memberRoles.find(v => v.id === rId);
            let cur = memberRoles.find(v => v.id === rId);
            if (org !== undefined) {
                if (cur !== undefined) return;
                role.count--;
                return;
            }
            if (cur === undefined) return;
            role.count++;
        });
        this.memberRoles = memberRoles;
    }
};

export const store = new Store();
