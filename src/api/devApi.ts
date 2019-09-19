import {CenterApiBase} from 'tonva';

class DevApi extends CenterApiBase {
    async userAppUnits(app:number):Promise<any[]> {
        return await this.get('tie/user-app-units', {app:app});
    }
    async uqBuilderUrl():Promise<any> {
        let ret = await this.get('uq-builder-url', undefined);
        return ret;
    }    
    async counts(unit:number):Promise<any> {
        return await this.get('counts', {unit:unit});
    }
    async app(id:number):Promise<any> {
        return await this.get('app', {id:id});
    }
    async uq(id:number):Promise<any> {
        return await this.get('uq', {id:id});
    }
    async server(id:number):Promise<any> {
        return await this.get('server', {id:id});
    }
    async apps(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('apps', {unit:unit, pageSize: pageSize});
    }
    async uqs(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('uqs', {unit:unit, pageSize: pageSize});
    }
    async buses(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('buses', {unit:unit, pageSize: pageSize});
    }
    async servers(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('servers', {unit:unit, pageSize: pageSize});
    }
    async services(unit:number, pageSize:number=30):Promise<any[]> {
        return await this.get('services', {unit:unit, pageSize: pageSize});
    }
    async saveApp(values:any):Promise<number> {
        return await this.post('app-save', values);
    }
    async saveUq(values:any):Promise<number> {
        return await this.post('uq-save', values);
    }
    async saveBus(values:any):Promise<number> {
        return await this.post('bus-save', values);
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
    async delUq(unit:number,id:number):Promise<void> {
        return await this.post('uq-del', {unit:unit, id:id});
    }
    async delBus(unit:number,id:number):Promise<void> {
        return await this.post('bus-del', {unit:unit, id:id});
    }
    async delServer(unit:number,id:number):Promise<void> {
        return await this.post('server-del', {unit:unit, id:id});
    }
    async delUqdb(unit:number,id:number):Promise<void> {
        return await this.post('uqdb-del', {unit:unit, id:id});
    }
    async delService(unit:number,id:number):Promise<void> {
        return await this.post('service-del', {unit:unit, id:id});
    }
    async loadAppUqs(app:number):Promise<any[]> {
        return await this.get('app-uqs', {app: app});
    }
    async appBindUq(unit:number,app:number,uqs:{id:number, access:string[]}[]):Promise<void> {
        let uqsText:string;
        if (uqs !== undefined) {
            uqsText = uqs.map(v => String(v.id)+'|'+v.access.join(',')).join(';');
        }
        await this.post('app-bind-uq', {unit:unit, app:app, uqs:uqsText});
    }
    async searchUq(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('uq-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async getMyUqs(unit:number):Promise<any[]> {
        return await this.get('my-uqs', {unit:unit});
    }
    async searchApp(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('app-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async searchServer(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('server-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async searchUqdb(unit:number,key:string,pageStart:number,pageSize:number):Promise<any[]> {
        return await this.get('uqdb-search', {unit:unit, key:key, pageStart:pageStart, pageSize:pageSize});
    }
    async loadUqServices(unit:number, uq:number):Promise<any[]> {
        return await this.get('uq-services', {unit:unit, uq:uq});
    }
    async changeServiceProp(unit:number, service:number, prop:string, value:any):Promise<number> {
        return await this.post('service-change-prop', {unit:unit, service:service, prop:prop, value:value});
    }
    async uqGetEntities(unit:number, uq:number):Promise<any[][]> {
        return await this.get('uq-get-entities', {unit:unit, uq:uq});
    }
}

export const devApi = new DevApi('tv/dev/', undefined);
