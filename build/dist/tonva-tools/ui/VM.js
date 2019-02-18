var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav } from './nav';
import { Page } from './page';
import { isDevelopment } from '../net';
export class Controller {
    constructor(res) {
        this.isDev = isDevelopment;
        this.onMessageReceive = (message) => __awaiter(this, void 0, void 0, function* () {
            yield this.onMessage(message);
        });
        this.res = res || {};
        this.x = this.res.x || {};
    }
    get user() { return nav.user; }
    get isLogined() {
        let { user } = nav;
        if (user === undefined)
            return false;
        return user.id > 0;
    }
    dispose() {
        // message listener的清理
        nav.unregisterReceiveHandler(this.receiveHandlerId);
        this.onDispose();
    }
    onDispose() {
    }
    openVPage(vp, param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new vp(this)).open(param);
        });
    }
    renderView(view, param) {
        return (new view(this)).render(param);
    }
    event(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onEvent(type, value);
        });
    }
    onEvent(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    msg(text) {
        alert(text);
    }
    errorPage(header, err) {
        this.openPage(React.createElement(Page, { header: "App error!" },
            React.createElement("pre", null, typeof err === 'string' ? err : err.message)));
    }
    onMessage(message) {
        return;
    }
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            console.log('this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);');
            this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
            console.log('return true');
            */
            return true;
        });
    }
    registerReceiveHandler() {
        this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
    }
    start(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.disposer = this.dispose.bind(this);
            this.registerReceiveHandler();
            let ret = yield this.beforeStart();
            if (ret === false)
                return;
            yield this.internalStart(param);
        });
    }
    get isCalling() { return this._resolve_$ !== undefined; }
    call(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._resolve_$ === undefined)
                this._resolve_$ = [];
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._resolve_$.push(resolve);
                yield this.start(param);
            }));
        });
    }
    vCall(vp, param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._resolve_$ === undefined)
                this._resolve_$ = [];
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._resolve_$.push(resolve);
                yield (new vp(this)).open(param);
            }));
        });
    }
    returnCall(value) {
        if (this._resolve_$ === undefined)
            return;
        let resolve = this._resolve_$.pop();
        if (resolve === undefined) {
            alert('the Coordinator call already returned, or not called');
            return;
        }
        resolve(value);
    }
    openPage(page) {
        nav.push(page, this.disposer);
        this.disposer = undefined;
    }
    replacePage(page) {
        nav.replace(page, this.disposer);
        this.disposer = undefined;
    }
    backPage() {
        nav.back();
    }
    closePage(level) {
        nav.pop(level);
    }
    ceasePage(level) {
        nav.ceaseTop(level);
    }
    removeCeased() {
        nav.removeCeased();
    }
    regConfirmClose(confirmClose) {
        nav.regConfirmClose(confirmClose);
    }
}
export class View {
    constructor(controller) {
        this.controller = controller;
        this.res = controller.res;
        this.x = controller.x;
    }
    get isDev() { return isDevelopment; }
    renderVm(vm, param) {
        return (new vm(this.controller)).render(param);
    }
    openVPage(vp, param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new vp(this.controller)).open(param);
        });
    }
    event(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            if (this._resolve_$_ !== undefined) {
                await this._resolve_$_({type:type, value:value});
                return;
            }*/
            yield this.controller.event(type, value);
        });
    }
    returnCall(value) {
        this.controller.returnCall(value);
    }
    openPage(view, param) {
        this.controller.openPage(React.createElement(view, param));
    }
    replacePage(view, param) {
        this.controller.replacePage(React.createElement(view, param));
    }
    openPageElement(page) {
        this.controller.openPage(page);
    }
    replacePageElement(page) {
        this.controller.replacePage(page);
    }
    backPage() {
        this.controller.backPage();
    }
    closePage(level) {
        this.controller.closePage(level);
    }
    ceasePage(level) {
        this.controller.ceasePage(level);
    }
    removeCeased() {
        this.controller.removeCeased();
    }
    regConfirmClose(confirmClose) {
        this.controller.regConfirmClose(confirmClose);
    }
}
export class VPage extends View {
    constructor(coordinator) {
        super(coordinator);
    }
    render(param) { return null; }
}
//# sourceMappingURL=VM.js.map