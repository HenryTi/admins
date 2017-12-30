import {CenterApi} from 'tonva-tools';

class DevApi extends CenterApi {
    async counts(unit:number):Promise<any> {
        return await this.get('counts', {unit:unit});
    }
    async app(id:number):Promise<any> {
        return await this.get('app', {id:id});
    }
    async api(id:number):Promise<any> {
        return await this.get('api', {id:id});
    }
    async server(id:number):Promise<any> {
        return await this.get('server', {id:id});
    }
    async apps(unit:number):Promise<any[]> {
        return await this.get('apps', {unit:unit});
    }
    async apis(unit:number):Promise<any[]> {
        return await this.get('apis', {unit:unit});
    }
    async servers(unit:number):Promise<any[]> {
        return await this.get('servers', {unit:unit});
    }
    async services(unit:number):Promise<any[]> {
        return await this.get('services', {unit:unit});
    }
    async saveApp(values:any):Promise<number> {
        return await this.post('app-save', values);
    }
    async saveApi(values:any):Promise<number> {
        return await this.post('api-save', values);
    }
    async saveServer(values:any):Promise<number> {
        return await this.post('server-save', values);
    }
    async saveService(values:any):Promise<number> {
        return await this.post('service-save', values);
    }
    async delApp(unit:number,id:number):Promise<void> {
        return await this.post('app-del', {unit:unit, id:id});
    }
    async delApi(unit:number,id:number):Promise<void> {
        return await this.post('api-del', {unit:unit, id:id});
    }
    async delServer(unit:number,id:number):Promise<void> {
        return await this.post('server-del', {unit:unit, id:id});
    }
    async delService(unit:number,id:number):Promise<void> {
        return await this.post('service-del', {unit:unit, id:id});
    }
    async loadAppApis(app:number):Promise<any[]> {
        return await this.get('app-apis', {app: app});
    }
    async appBindApi(unit:number,app:number,apiIds:number[], bind:0|1):Promise<void> {
        await this.post('app-bind-api', {unit:unit, app:app, apiIds:apiIds, bind:bind});
    }
    async searchApi(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('api-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async searchApp(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('app-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async searchServer(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('server-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
}

export const devApi = new DevApi('tv/dev/');
