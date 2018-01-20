import {CenterApi, User, meInFrame} from 'tonva-tools';

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

    async sendMessage(to:string, type:string, message:any, norepeat?:boolean) {
        let {unit, app} = meInFrame;
        return await this.post('tie/send-message', {
            to:to, 
            unit:unit, 
            app:app,
            type:type, 
            message:message, 
            norepeat:norepeat
        });
    }

    async unit(unit:number):Promise<any> {
        return await this.get('unit/', {unit:unit});
    }

    async unitAdmins(unit:number):Promise<any[]> {
        return await this.get('unit/admins', {unit:unit});
    }

    async unitSetAdmin(fellow:number, unit:number, isOwner:number, isAdmin:number):Promise<any> {
        return await this.post('unit/set-admin', {fellow:fellow, unit:unit, isOwner:isOwner, isAdmin:isAdmin});
    }

    async unitApps(unit:number):Promise<any[]> {
        return await this.get('unit/apps', {unit:unit});
    }

    async unitAddApp(unit:number, app:number):Promise<void> {
        await this.post('unit/add-app', {unit:unit, app:app});
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

    async unitRoleSetApps(unit:number, role:number, apps:number[]):Promise<any[]> {
        return await this.post('unit/role-set-apps', {unit:unit, role:role, apps:apps});
    }

    async postMessage(toUser:number, msg:any) {
        return await this.post('test/post', {to: toUser, message: msg});
    }
}

export const mainApi = new MainApi('tv/');
