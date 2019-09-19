import {HttpChannel} from './httpChannel';
import { Caller } from './caller';

export async function refetchApi(channel:HttpChannel, url:string, options:any, 
    resolve:(values:any)=>any, reject:(reason:any)=>void)
{
    await channel.fetch(url, options, resolve, reject);
}

export abstract class ApiBase {
    protected token: string;
    protected path: string;
    protected showWaiting: boolean;

    constructor(path: string, showWaiting: boolean) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }

    protected abstract async getHttpChannel(): Promise<HttpChannel>;

    async xcall(caller:Caller<any>):Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.xcall(this.path, caller);
    }

    public async call(url:string, method:string, body:any):Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.callFetch(url, method, body);
    }

    public async get(path:string, params:any=undefined): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.get(this.path + path, params);
    }

    public async post(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.post(this.path + path, params);
    }

    public async put(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.put(this.path + path, params);
    }

    public async delete(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.delete(this.path + path, params);
    }
}
