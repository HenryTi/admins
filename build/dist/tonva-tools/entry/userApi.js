var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CenterApi } from '../net';
import { decodeUserToken } from '../user';
//import { nav } from '../ui';
export class UserApi extends CenterApi {
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            //(params as any).device = nav.local.device.get();
            let ret = yield this.get('login', params);
            switch (typeof ret) {
                default: return;
                case 'string': return decodeUserToken(ret);
                case 'object':
                    let token = ret.token;
                    let user = decodeUserToken(token);
                    let { nick, icon } = ret;
                    if (nick)
                        user.nick = nick;
                    if (icon)
                        user.icon = icon;
                    return user;
            }
            // !== undefined) return decodeToken(token);
        });
    }
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('register', params);
        });
    }
    setVerify(account, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('set-verify', { account: account, type: type });
        });
    }
    checkVerify(account, verify) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('check-verify', { account: account, verify: verify });
        });
    }
    isExists(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('is-exists', { account: account });
        });
    }
    resetPassword(account, password, verify, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('reset-password', { account: account, password, verify, type });
        });
    }
    userSetProp(prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('tie/user-set-prop', { prop: prop, value: value });
        });
    }
}
const userApi = new UserApi('tv/user/', undefined);
export default userApi;
//# sourceMappingURL=userApi.js.map