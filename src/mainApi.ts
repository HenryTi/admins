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

    async unitAdmins(unit:number) {
        return await this.get('unit/admins', {unit:unit});
    }

    async postMessage(toUser:number, msg:any) {
        return await this.post('test/post', {to: toUser, message: msg});
    }

    loadFollows(pageSize:number, minName:string) {
        return this.get('follows', {pageSize:pageSize, minName: minName});
    }
    tieHao(tie:number) {
        return this.get('tie-hao', {tie: tie});
    }
    toHome(tie:number) {
        return this.post('to-home', {tie: tie});
    }
    dbInit() {
        return this.get('dbInit', undefined).then(res => res);
    }
}

const mainApi = new MainApi('tv/');
export default mainApi;
