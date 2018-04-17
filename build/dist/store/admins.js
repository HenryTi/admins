var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
import { mainApi } from '../api';
export class Admins {
    constructor(store) {
        this.cur = undefined;
        this.owners = undefined;
        this.admins = undefined;
        this.fellows = undefined;
        this.store = store;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = this.store.unit;
            if (!unit || !unit.id)
                return;
            if (this.admins !== undefined)
                return;
            let all = yield mainApi.unitAdmins(unit.id);
            let owners = [];
            let admins = [];
            let fellows = [];
            all.forEach(ua => {
                let { isOwner, isAdmin } = ua;
                if (isOwner === 0 && isAdmin === 0)
                    fellows.push(ua);
                else {
                    if (isOwner === 1)
                        owners.push(ua);
                    if (isAdmin === 1)
                        admins.push(ua);
                }
            });
            this.owners = owners;
            this.admins = admins;
            this.fellows = fellows;
        });
    }
    removeCur(arr) {
        let index = arr.findIndex(v => v.id === this.cur.id);
        if (index >= 0)
            arr.splice(index, 1);
    }
    unitSetAdmin(isOwner, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            let cur = this.cur;
            cur.isOwner = isOwner;
            cur.isAdmin = isAdmin;
            let fellowId = cur.id, unitId = this.store.unit.id;
            yield mainApi.unitSetAdmin(fellowId, unitId, isOwner, isAdmin);
            this.removeCur(this.owners);
            this.removeCur(this.admins);
            this.removeCur(this.fellows);
            if (isOwner === 0 && isAdmin === 0)
                this.fellows.unshift(cur);
            else {
                if (isOwner === 1)
                    this.owners.unshift(cur);
                if (isAdmin === 1)
                    this.admins.unshift(cur);
            }
        });
    }
}
__decorate([
    observable
], Admins.prototype, "cur", void 0);
__decorate([
    observable
], Admins.prototype, "owners", void 0);
__decorate([
    observable
], Admins.prototype, "admins", void 0);
__decorate([
    observable
], Admins.prototype, "fellows", void 0);
//# sourceMappingURL=admins.js.map