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
}

export const devApi = new DevApi('tv/dev/');
