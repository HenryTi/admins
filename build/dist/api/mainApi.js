var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CenterApi, meInFrame } from 'tonva-tools';
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
    userId(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/user-id', { name: name });
        });
    }
    userAdminUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/user-admin-units', {});
        });
    }
    sendMessage(toUser, type, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let { unit } = meInFrame;
            let adminApp = 0;
            return yield this.post('tie/send-message', {
                type: type,
                fromUnit: unit,
                fromApp: adminApp,
                toUser: toUser,
                content: content,
            });
        });
    }
    unit(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/', { unit: unit });
        });
    }
    unitMemberCount(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/member-count', { unit: unit });
        });
    }
    unitAdmins(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/admins', { unit: unit });
        });
    }
    unitSetAdmin(fellow, unit, isOwner, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('unit/set-admin', { fellow: fellow, unit: unit, isOwner: isOwner, isAdmin: isAdmin });
        });
    }
    unitAddAdmin(user, unit, isOwner, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('unit/add-admin', { user: user, unit: unit, isOwner: isOwner, isAdmin: isAdmin });
        });
    }
    unitApps(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/apps', { unit: unit });
        });
    }
    unitAddApp(unit, app) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('unit/add-app', { unit: unit, app: app });
            return ret;
        });
    }
    unitDeleteApp(unit, app, deleted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/delete-app', { unit: unit, app: app, deleted: deleted });
        });
    }
    unitChangeProp(unit, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/change-prop', { unit: unit, prop: prop, value: value });
        });
    }
    searchApp(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/search-app', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    unitRoles(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/roles', { unit: unit });
        });
    }
    unitAddRole(unit, name, discription) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('unit/add-role', { unit: unit, name: name, discription: discription });
        });
    }
    unitRoleChangeProp(unit, role, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/change-role-prop', { unit: unit, role: role, prop: prop, value: value });
        });
    }
    unitRoleApps(unit, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/role-apps', { unit: unit, role: role });
        });
    }
    unitRoleSetApps(unit, role, apps) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/role-set-apps', { unit: unit, role: role, apps: apps });
        });
    }
    unitMembers(unit, role, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/members', { unit: unit, role: role, key, pageStart, pageSize });
        });
    }
    unitAssignMember(unit, member, assigned) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/assign-member', { unit: unit, member: member, assigned: assigned });
        });
    }
    unitMemberRoles(unit, member) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('unit/member-roles', { unit: unit, member: member });
        });
    }
    unitSetMemberRoles(unit, member, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post('unit/member-set-roles', { unit: unit, member: member, roles: roles });
        });
    }
}
export const mainApi = new MainApi('tv/', undefined);
//# sourceMappingURL=mainApi.js.map