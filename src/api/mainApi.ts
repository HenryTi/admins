import {CenterApi, User, appInFrame} from 'tonva';
import { string } from 'prop-types';

class MainApi extends CenterApi {
    async stickies():Promise<any[]> {
        return await this.get('sticky/list', {start:0, pageSize:30});
    }

    async ties():Promise<any[]> {
        return await this.get('tie/list', {start:0, pageSize:30});
    }

    async apps(unit:number):Promise<any> {
        return await this.get('tie/apps', {unit:unit});
    }

    async appApi(unit:number, app:number, apiName:string) {
        return await this.get('tie/app-api', {unit:unit, app:app, apiName:apiName});
    }

    async userId(name:string):Promise<number> {
        return await this.get('tie/user-id', {name:name});
    }

    async userAdminUnits():Promise<any[]> {
        return await this.get('tie/user-admin-units', {});
    }

    async sendMessage(toUser:number, type:string, content:any) {
        let {unit} = appInFrame;
        let adminApp = 0;
        return await this.post('tie/send-message', {
            type: type, 
            fromUnit: unit, 
            fromApp: adminApp,
            toUser: toUser, 
            content: content, 
        });
    }

    async unit(unit:number):Promise<any> {
        return await this.get('unit/', {unit:unit});
    }

    async unitMemberCount(unit:number):Promise<number> {
        return await this.get('unit/member-count', {unit:unit});
    }

    async unitAdmins(unit:number):Promise<any[]> {
        return await this.get('unit/admins', {unit:unit});
    }

    async unitSetAdmin(fellow:number, unit:number, isOwner:number, isAdmin:number):Promise<any> {
        return await this.post('unit/set-admin', {fellow:fellow, unit:unit, isOwner:isOwner, isAdmin:isAdmin});
    }

    async unitAddAdmin(user:string, unit:number, isOwner:number, isAdmin:number):Promise<any> {
        return await this.post('unit/add-admin', {user:user, unit:unit, isOwner:isOwner, isAdmin:isAdmin});
    }

    async unitApps(unit:number):Promise<any[]> {
        return await this.get('unit/apps', {unit:unit});
    }

    async unitAddApp(unit:number, app:number):Promise<number> {
        let ret = await this.post('unit/add-app', {unit:unit, app:app});
        return ret;
    }

    async unitDeleteApp(unit:number, app:number, deleted:number):Promise<void> {
        await this.post('unit/delete-app', {unit:unit, app:app, deleted:deleted});
    }

    async unitChangeProp(unit:number, prop:string, value:any):Promise<void> {
        await this.post('unit/change-prop', {unit:unit, prop:prop, value:value});
    }

    async searchApp(unit:number, key:string, pageStart:any, pageSize:number):Promise<any[]> {
        return await this.get('unit/search-app', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }

    async unitRoles(unit:number):Promise<any[]> {
        return await this.get('unit/roles', {unit:unit});
    }

    async unitAddRole(unit:number, name:string, discription:string):Promise<number> {
        return await this.post('unit/add-role', {unit:unit, name:name, discription:discription});
    }

    async unitRoleChangeProp(unit:number, role:number, prop:string, value:any):Promise<void> {
        await this.post('unit/change-role-prop', {unit:unit, role:role, prop:prop, value:value});
    }

    async unitRoleApps(unit:number, role:number):Promise<any[]> {
        return await this.get('unit/role-apps', {unit:unit, role:role});
    }

    async unitRoleSetApps(unit:number, role:number, apps:number[]):Promise<void> {
        await this.post('unit/role-set-apps', {unit:unit, role:role, apps:apps});
    }

    async unitMembers(unit:number, role:number, key:string, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('unit/members', {unit:unit, role:role, key, pageStart, pageSize});
    }

    async unitAssignMember(unit:number, member:number, assigned:string):Promise<void> {
        await this.post('unit/assign-member', {unit:unit, member:member, assigned:assigned});
    }

    async unitMemberRoles(unit:number, member:number):Promise<any[]> {
        return await this.get('unit/member-roles', {unit:unit, member:member});
    }

    async unitSetMemberRoles(unit:number, member:number, roles:number[]):Promise<void> {
        await this.post('unit/member-set-roles', {unit:unit, member:member, roles:roles});
    }

    async unitUsers(unit:number, key:string, pageStart:number, pageSize:number):Promise<any> {
        return await this.get('unit/users', {unit: unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async unitAppUsers(unit:number, key:string, pageStart:number, pageSize:number):Promise<any> {
        return await this.get('unit/app-users', {unit: unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async unitOneAppUsers(unit:number, app:number, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('unit/one-app-users', {unit: unit, app:app, pageStart:pageStart, pageSize:pageSize});
    }
    async unitOneUserApps(unit:number, user:number, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('unit/one-user-apps', {unit: unit, user:user, pageStart:pageStart, pageSize:pageSize});
    }
    async unitAppEditUsers(unit:number, app:number, key:string, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('unit/app-edit-users', {unit: unit, app:app, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async unitUserEditApps(unit:number, user:number, key:string, pageStart:number, pageSize:number):Promise<any[]> {
        return await this.get('unit/user-edit-apps', {unit: unit, user:user, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async bindAppUser(unit:number, app:number, user:number, bind:number):Promise<void> {
        await this.post('unit/bind-app-user', {unit: unit, app:app, user:user, bind:bind});
    }

    async userFromKey(key:string):Promise<any> {
        return await this.get('tie/user-from-key', {key:key});
    }
    async unitAddUser(unit:number, user:number) {
        await this.post('unit/add-user', {unit:unit, user:user});
    }
}

export const mainApi = new MainApi('tv/', undefined);
