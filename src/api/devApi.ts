import {CenterApi} from 'tonva-tools';

class DevApi extends CenterApi {
    async usqlServer():Promise<any> {
        let ret = await this.get('usql-server', undefined);
        return ret;
    }    
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
    async usqldb(id:number):Promise<any> {
        return await this.get('usqldb', {id:id});
    }
    async apps(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('apps', {unit:unit, pageSize: pageSize});
    }
    async apis(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('apis', {unit:unit, pageSize: pageSize});
    }
    async buses(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('buses', {unit:unit, pageSize: pageSize});
    }
    async servers(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('servers', {unit:unit, pageSize: pageSize});
    }
    async usqldbs(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('usqldbs', {unit:unit, pageSize: pageSize});
    }
    async services(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('services', {unit:unit, pageSize: pageSize});
    }
    async saveApp(values:any):Promise<number> {
        return await this.post('app-save', values);
    }
    async saveApi(values:any):Promise<number> {
        return await this.post('api-save', values);
    }
    async saveBus(values:any):Promise<number> {
        return await this.post('bus-save', values);
    }
    async saveServer(values:any):Promise<number> {
        return await this.post('server-save', values);
    }
    async saveUsqldb(values:any):Promise<number> {
        return await this.post('usqldb-save', values);
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
    async delBus(unit:number,id:number):Promise<void> {
        return await this.post('bus-del', {unit:unit, id:id});
    }
    async delServer(unit:number,id:number):Promise<void> {
        return await this.post('server-del', {unit:unit, id:id});
    }
    async delUsqldb(unit:number,id:number):Promise<void> {
        return await this.post('usqldb-del', {unit:unit, id:id});
    }
    async delService(unit:number,id:number):Promise<void> {
        return await this.post('service-del', {unit:unit, id:id});
    }
    async loadAppApis(app:number):Promise<any[]> {
        return await this.get('app-apis', {app: app});
    }
    async appBindApi(unit:number,app:number,apis:{id:number, access:string[]}[]):Promise<void> {
        let apisText:string;
        if (apis !== undefined) {
            apisText = apis.map(v => String(v.id)+'|'+v.access.join(',')).join(';');
        }
        await this.post('app-bind-api', {unit:unit, app:app, apis:apisText});
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
    async searchUsqldb(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('usqldb-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async loadAppServices(unit:number, app:number):Promise<any[]> {
        return await this.get('app-services', {unit:unit, app:app});
    }
    async loadApiServices(unit:number, api:number):Promise<any[]> {
        return await this.get('api-services', {unit:unit, api:api});
    }
    async changeServiceProp(unit:number, service:number, prop:string, value:any):Promise<number> {
        return await this.post('service-change-prop', {unit:unit, service:service, prop:prop, value:value});
    }
}

export const devApi = new DevApi('tv/dev/');
