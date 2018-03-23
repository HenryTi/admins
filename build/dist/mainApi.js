var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CenterApi } from 'tonva-tools';
class MainApi extends CenterApi {
    stickies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sticky/list', { start: 0, pageSize: 30 });
        });
    }
    ties() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/list', { start: 0, pageSize: 30 });
        });
    }
    apps(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/apps', { unit: unit });
        });
    }
    appApi(unit, app, apiName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/app-api', { unit: unit, app: app, apiName: apiName });
        });
    }
    unit(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/', { unit: unit });
        });
    }
    unitAdmins(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/admins', { unit: unit });
        });
    }
    postMessage(toUser, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('test/post', { to: toUser, message: msg });
        });
    }
    loadFollows(pageSize, minName) {
        return this.get('follows', { pageSize: pageSize, minName: minName });
    }
    tieHao(tie) {
        return this.get('tie-hao', { tie: tie });
    }
    toHome(tie) {
        return this.post('to-home', { tie: tie });
    }
    dbInit() {
        return this.get('dbInit', undefined).then(res => res);
    }
}
const mainApi = new MainApi('tv/');
export default mainApi;
//# sourceMappingURL=mainApi.js.map