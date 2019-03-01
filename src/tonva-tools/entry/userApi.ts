import {CenterApi} from '../net';
import {User, decodeUserToken} from '../user';
//import { nav } from '../ui';

export class UserApi extends CenterApi {
    async login(params: {user: string, pwd: string, guest: number}): Promise<any> {
        //(params as any).device = nav.local.device.get();
        let ret = await this.get('login', params);
        switch (typeof ret) {
            default: return;
            case 'string': return decodeUserToken(ret);
            case 'object':
                let token = ret.token;
                let user = decodeUserToken(token);
                let {nick, icon} = ret;
                if (nick) user.nick = nick;
                if (icon) user.icon = icon;
                return user;
        }
        // !== undefined) return decodeToken(token);
    }
    async register(params: {
        nick:string, 
        user:string, 
        pwd:string,
        country:number, 
        mobile:number, 
        email:string,
        verify:string,
    }): Promise<any>
    {
        return await this.post('register', params);
    }

    async setVerify(account:string, type:'mobile'|'email') {
        return await this.post('set-verify', {account:account, type:type});
    }

    async checkVerify(account:string, verify:string) {
        return await this.post('check-verify', {account:account, verify:verify});
    }

    async isExists(account:string) {
        return await this.get('is-exists', {account:account});
    }

    async resetPassword(account:string, password:string, verify:string, type:'mobile'|'email') {
        return await this.post('reset-password', {account:account, password, verify, type});
    }
}

const userApi = new UserApi('tv/user/', undefined);

export default userApi;
