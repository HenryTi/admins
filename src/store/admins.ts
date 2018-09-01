import {observable, autorun} from 'mobx';
import {Unit, UnitApps, App, Api, UnitAdmin} from '../model';
import {mainApi} from '../api';
import {Store} from './index';

export class Admins {
    private store:Store;
    constructor(store:Store) {
        this.store = store;
    }

    @observable cur: UnitAdmin = undefined;
    @observable owners: UnitAdmin[] = undefined;
    @observable admins: UnitAdmin[] = undefined;
    @observable fellows: UnitAdmin[] = undefined;
    
    async load(): Promise<void> {
        let unit = this.store.unit;
        if (unit !== undefined && unit.id !== undefined) return;
        if (this.admins !== undefined) return;
        let all = await mainApi.unitAdmins(unit.id);
        let owners:UnitAdmin[] = [];
        let admins:UnitAdmin[] = [];
        let fellows:UnitAdmin[] = [];
        all.forEach(ua => {
            let {isOwner, isAdmin} = ua;
            if (isOwner === 0 && isAdmin === 0)
                fellows.push(ua);
            else {
                if (isOwner === 1) owners.push(ua);
                if (isAdmin === 1) admins.push(ua);
            }
        });
        this.owners = owners;
        this.admins = admins;
        this.fellows = fellows;
    }

    private removeCur(arr: UnitAdmin[]) {
        let index = arr.findIndex(v => v.id===this.cur.id);
        if (index >=0) arr.splice(index, 1);
    }

    async unitSetAdmin(isOwner:number, isAdmin:number) {
        let cur = this.cur;
        cur.isOwner = isOwner;
        cur.isAdmin = isAdmin;
        let fellowId = cur.id, unitId = this.store.unit.id;
        await mainApi.unitSetAdmin(fellowId, unitId, isOwner, isAdmin);
        this.removeCur(this.owners);
        this.removeCur(this.admins);
        this.removeCur(this.fellows);
        if (isOwner === 0 && isAdmin === 0)
            this.fellows.unshift(cur);
        else {
            if (isOwner === 1) this.owners.unshift(cur);
            if (isAdmin === 1) this.admins.unshift(cur);
        }
    }

    async addNew(user:string, isOwner:number, isAdmin:number):Promise<UnitAdmin> {
        let admin = await mainApi.unitAddAdmin(user, this.store.unit.id, isOwner, isAdmin);
        if (admin !== undefined) {
            let cur = this.cur = admin;
            this.removeCur(this.owners);
            this.removeCur(this.admins);
            this.removeCur(this.fellows);
            if (isOwner === 0 && isAdmin === 0)
                this.fellows.unshift(cur);
            else {
                if (isOwner === 1) this.owners.unshift(cur);
                if (isAdmin === 1) this.admins.unshift(cur);
            }
        }
        return admin;
    }
}
