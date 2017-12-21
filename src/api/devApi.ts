import {CenterApi} from 'tonva-tools';

class DevApi extends CenterApi {
    async counts(unit:number):Promise<any> {
        return await this.get('counts', {unit:unit});
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
    async loadAppApis(unit:number,app:number):Promise<any[]> {
        return await this.get('app-apis', {unit:unit, app: app});
    }
    async searchApi(unit:number,key:string):Promise<any[]> {
        return await this.get('api-search', {unit:unit, key:key});
    }
    async appBindApi(unit:number,app:number,apiIds:number[], bind:0|1):Promise<void> {
        await this.post('app-bind-api', {unit:unit, app:app, apiIds:apiIds, bind:bind});
    }
}

export const devApi = new DevApi('tv/dev/');
