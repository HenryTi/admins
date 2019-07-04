var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { List, LMR, FA, Page, nav, Controller, VPage, resLang } from '../../ui';
import { loadAppUqs, appInFrame, getExHash } from '../../net';
import { CUq } from './cUq';
import { centerApi } from '../centerApi';
import { UqApp } from '../uqs';
export class CApp extends Controller {
    constructor(ui) {
        super(resLang(ui && ui.res));
        this.cImportUqs = {};
        this.cUqCollection = {};
        this.renderRow = (item, index) => {
            let { id, nick, name } = item;
            return React.createElement(LMR, { className: "px-3 py-2", right: 'id: ' + id },
                React.createElement("div", null, nick || name));
        };
        this.onRowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            appInFrame.unit = item.id; // 25;
            yield this.start();
        });
        this.selectUnitPage = () => {
            return React.createElement(Page, { header: "\u9009\u62E9\u5C0F\u53F7", logout: true },
                React.createElement(List, { items: this.appUnits, item: { render: this.renderRow, onClick: this.onRowClick } }));
        };
        nav.setSettings(ui);
        this.name = ui.appName;
        if (this.name === undefined) {
            throw 'appName like "owner/app" must be defined in UI';
        }
        if (ui.uqs === undefined)
            ui.uqs = {};
        this.ui = ui;
        this.caption = this.res.caption || 'Tonva';
    }
    /*
    async startDebug() {
        let appName = this.appOwner + '/' + this.appName;
        let cApp = new CApp({appName: appName, uqs:{}} );
        let keepNavBackButton = true;
        await cApp.start(keepNavBackButton);
    }
    */
    /*
    protected async loadUqs(uqAppData:UqAppData): Promise<string[]> {
        let retErrors:string[] = [];
        let unit = appInFrame.unit;
        //let app = await loadAppUqs(this.appOwner, this.appName);
        let {id, uqs} = uqAppData;
        this.id = id;

        let promises: PromiseLike<string>[] = [];
        let promiseChecks: PromiseLike<boolean>[] = [];
        let roleAppUI = await this.buildRoleAppUI();
        this.ui = roleAppUI;
        for (let appUq of uqs) {
            let {id:uqId, uqOwner, uqName, access} = appUq;
            let uq = uqOwner + '/' + uqName;
            let uqUI = roleAppUI && roleAppUI.uqs && roleAppUI.uqs[uq];
            let cUq = this.newCUq(uq, uqId, access, uqUI || {});
            this.cUqCollection[uq] = cUq;
            promises.push(cUq.loadSchema());
            promiseChecks.push(cUq.uq.uqApi.checkAccess());
        }
        let results = await Promise.all(promises);
        Promise.all(promiseChecks).then((checks) => {
            for (let c of checks) {
                if (c === false) {
                    //debugger;
                    //nav.start();
                    //return;
                }
            }
        });
        for (let result of results)
        {
            let retError = result; // await cUq.loadSchema();
            if (retError !== undefined) {
                retErrors.push(retError);
                continue;
            }
        }
        if (retErrors.length === 0) return;
        return retErrors;
    }
    */
    /*
    private async buildRoleAppUI():Promise<AppUI> {
        if (!this.ui) return undefined;
        let {hashParam} = nav;
        if (!hashParam) return this.ui;
        let {roles} = this.ui;
        let roleAppUI = roles && roles[hashParam];
        if (!roleAppUI) return this.ui;
        let ret:AppUI = {} as any;
        for (let i in this.ui) {
            if (i === 'roles') continue;
            ret[i] = this.ui[i];
        }
        if (typeof roleAppUI === 'function') roleAppUI = await roleAppUI();
        _.merge(ret, roleAppUI);
        return ret;
    }
    */
    getImportUq(uqOwner, uqName) {
        let uq = uqOwner + '/' + uqName;
        let cUq = this.cImportUqs[uq];
        if (cUq !== undefined)
            return cUq;
        let ui = this.ui && this.ui.uqs && this.ui.uqs[uq];
        let uqId = -1; // unknown
        this.cImportUqs[uq] = cUq = this.getCUq(uq);
        //this.newCUq(uq, uqId, undefined, ui || {});
        /*
        let retError = await cUq.loadSchema();
        if (retError !== undefined) {
            console.error(retError);
            debugger;
            return;
        }
        */
        return cUq;
    }
    newCUq(uqData, uqUI) {
        let cUq = new (this.ui.CUq || CUq)(this, uqData, uqUI);
        Object.setPrototypeOf(cUq.x, this.x);
        return cUq;
    }
    get cUqArr() {
        let ret = [];
        for (let i in this.cUqCollection) {
            ret.push(this.cUqCollection[i]);
        }
        return ret;
    }
    getCUq(uq) {
        return this.cUqCollection[uq];
    }
    get VAppMain() { return (this.ui && this.ui.main) || VAppMain; }
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let retErrors = yield this.load();
                //let app = await loadAppUqs(this.appOwner, this.appName);
                // if (isDevelopment === true) {
                // 这段代码原本打算只是在程序员调试方式下使用，实际上，也可以开放给普通用户，production方式下
                let { predefinedUnit } = appInFrame;
                //let {id} = app;
                //this.id = id;
                let { user } = nav;
                if (user !== undefined && user.id > 0) {
                    this.appUnits = yield centerApi.userAppUnits(this.uqApp.id);
                    switch (this.appUnits.length) {
                        case 0:
                            this.showUnsupport(predefinedUnit);
                            return false;
                        case 1:
                            let appUnit = this.appUnits[0].id;
                            if (appUnit === undefined || appUnit < 0 ||
                                predefinedUnit !== undefined && appUnit != predefinedUnit) {
                                this.showUnsupport(predefinedUnit);
                                return false;
                            }
                            appInFrame.unit = appUnit;
                            break;
                        default:
                            if (predefinedUnit > 0 && this.appUnits.find(v => v.id === predefinedUnit) !== undefined) {
                                appInFrame.unit = predefinedUnit;
                                break;
                            }
                            nav.push(React.createElement(this.selectUnitPage, null));
                            return false;
                    }
                }
                //}
                //let retErrors = await this.loadUqs(app);
                if (retErrors !== undefined) {
                    this.openPage(React.createElement(Page, { header: "ERROR" },
                        React.createElement("div", { className: "m-3" },
                            React.createElement("div", null, "Load Uqs \u53D1\u751F\u9519\u8BEF\uFF1A"),
                            retErrors.map((r, i) => React.createElement("div", { key: i }, r)))));
                    return false;
                }
                return true;
            }
            catch (err) {
                nav.push(React.createElement(Page, { header: "App start error!" },
                    React.createElement("pre", null, typeof err === 'string' ? err : err.message)));
                return false;
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uqApp = new UqApp(this.name);
            let { appOwner, appName } = this.uqApp;
            let uqAppData = yield loadAppUqs(appOwner, appName);
            let { id, uqs } = uqAppData;
            this.uqApp.id = id;
            let retErrors = [];
            let promiseInits = [];
            let promises = [];
            let promiseChecks = [];
            for (let uqData of uqs) {
                let { id, uqOwner, uqName, access } = uqData;
                let uqFullName = uqOwner + '/' + uqName;
                let uqUI = this.ui.uqs[uqFullName] || {};
                let cUq = this.newCUq(uqData, uqUI);
                this.cUqCollection[uqFullName] = cUq;
                this.uqApp.addUq(cUq.uq);
                promiseInits.push(cUq.init());
            }
            yield Promise.all(promiseInits);
            for (let i in this.cUqCollection) {
                let cUq = this.cUqCollection[i];
                promises.push(cUq.loadEntities());
                promiseChecks.push(cUq.checkEntities());
            }
            let results = yield Promise.all(promises);
            Promise.all(promiseChecks).then((checks) => {
                for (let c of checks) {
                    if (c === false) {
                        //debugger;
                        //nav.start();
                        //return;
                    }
                }
            });
            for (let result of results) {
                let retError = result; // await cUq.loadSchema();
                if (retError !== undefined) {
                    retErrors.push(retError);
                    continue;
                }
            }
            if (retErrors.length === 0) {
                this.uqApp.setTuidImportsLocal();
                return;
            }
            return retErrors;
        });
    }
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (param !== true) {
                this.clearPrevPages();
            }
            yield this.showMainPage();
        });
    }
    render() {
        return this.renderView(this.VAppMain);
    }
    // 如果是独立app，删去显示app之前的页面。
    // 如果非独立app，则不删
    clearPrevPages() {
        nav.clear();
    }
    showUnsupport(predefinedUnit) {
        this.clearPrevPages();
        let { user } = nav;
        let userName = user ? user.name : '[未登录]';
        let { appOwner, appName } = this.uqApp;
        this.openPage(React.createElement(Page, { header: "APP\u65E0\u6CD5\u8FD0\u884C", logout: true },
            React.createElement("div", { className: "m-3 text-danger container" },
                React.createElement("div", { className: "form-group row" },
                    React.createElement("div", { className: "col-sm-3 font-weight-bold" }, "\u767B\u5F55\u7528\u6237"),
                    React.createElement("div", { className: "col-sm text-body" }, userName)),
                React.createElement("div", { className: "form-group row" },
                    React.createElement("div", { className: "col-sm-3 font-weight-bold" }, "App"),
                    React.createElement("div", { className: "col-sm text-body" }, `${appOwner}/${appName}`)),
                React.createElement("div", { className: "form-group row" },
                    React.createElement("div", { className: "col-sm-3 font-weight-bold" }, "\u9884\u8BBE\u5C0F\u53F7"),
                    React.createElement("div", { className: "col-sm text-body" }, predefinedUnit || React.createElement("small", { className: "" }, "[\u65E0\u9884\u8BBE\u5C0F\u53F7]"))),
                React.createElement("div", { className: "form-group row" },
                    React.createElement("div", { className: "col-sm-3 font-weight-bold" },
                        "\u53EF\u80FD\u539F\u56E0",
                        React.createElement(FA, { name: "exclamation-triangle" })),
                    React.createElement("div", { className: "col-sm text-body" },
                        React.createElement("ul", { className: "p-0" },
                            React.createElement("li", null,
                                "\u6CA1\u6709\u5C0F\u53F7\u8FD0\u884C ",
                                this.ui.appName),
                            React.createElement("li", null,
                                "\u7528\u6237 ",
                                React.createElement("b", null, userName),
                                " \u6CA1\u6709\u52A0\u5165\u4EFB\u4F55\u4E00\u4E2A\u8FD0\u884C",
                                this.ui.appName,
                                "\u7684\u5C0F\u53F7"),
                            predefinedUnit &&
                                React.createElement("li", null,
                                    "\u9884\u8BBE\u5C0F\u53F7 ",
                                    React.createElement("b", null, predefinedUnit),
                                    " \u6CA1\u6709\u8FD0\u884CApp ",
                                    this.ui.appName)))),
                React.createElement("div", { className: "form-group row" },
                    React.createElement("div", { className: "col-sm-3 font-weight-bold" },
                        "\u5C0F\u53F7",
                        predefinedUnit),
                    React.createElement("div", { className: "col-sm text-body" },
                        "\u9884\u8BBE\u5C0F\u53F7\u5B9A\u4E49\u5728 public/unit.json \u6587\u4EF6\u4E2D\u3002 \u5B9A\u4E49\u4E86\u8FD9\u4E2A\u6587\u4EF6\u7684\u7A0B\u5E8F\uFF0C\u53EA\u80FD\u7531url\u76F4\u63A5\u542F\u52A8\u3002 \u7528\u6237\u7B2C\u4E00\u6B21\u8BBF\u95EEapp\u4E4B\u540E\uFF0C\u4F1A\u7F13\u5B58\u5728localStorage\u91CC\u3002",
                        React.createElement("br", null),
                        "\u5982\u679C\u8981\u5220\u53BB\u7F13\u5B58\u7684\u9884\u5B9A\u4E49Unit\uFF0Clogout\u7136\u540E\u518Dlogin\u3002")))));
    }
    showMainPage() {
        return __awaiter(this, void 0, void 0, function* () {
            // #tv-RwPBwMef-23-sheet-api-108
            let exHash = getExHash();
            if (exHash !== undefined) {
                let parts = exHash.split('-');
                if (parts.length > 3) {
                    let action = parts[3];
                    // sheet_debug 表示centerUrl是debug方式的
                    if (action === 'sheet' || action === 'sheet_debug') {
                        let uqId = Number(parts[4]);
                        let sheetTypeId = Number(parts[5]);
                        let sheetId = Number(parts[6]);
                        let cUq = this.getCUqFromId(uqId);
                        if (cUq === undefined) {
                            alert('unknown uqId: ' + uqId);
                            return;
                        }
                        this.clearPrevPages();
                        yield cUq.navSheet(sheetTypeId, sheetId);
                        return;
                    }
                }
            }
            this.openVPage(this.VAppMain);
        });
    }
    getCUqFromId(uqId) {
        for (let i in this.cUqCollection) {
            let cUq = this.cUqCollection[i];
            if (cUq.uq.id === uqId)
                return cUq;
        }
        return;
    }
}
class VAppMain extends VPage {
    constructor() {
        super(...arguments);
        this.appPage = () => {
            let { caption } = this.controller;
            return React.createElement(Page, { header: caption, logout: () => __awaiter(this, void 0, void 0, function* () { appInFrame.unit = undefined; }) }, this.appContent());
        };
        this.appContent = () => {
            let { cUqArr } = this.controller;
            let content;
            if (cUqArr.length === 0) {
                content = React.createElement("div", { className: "text-danger" },
                    React.createElement(FA, { name: "" }),
                    " \u6B64APP\u6CA1\u6709\u7ED1\u5B9A\u4EFB\u4F55\u7684UQ");
            }
            else {
                content = cUqArr.map((v, i) => React.createElement("div", { key: i }, v.render()));
            }
            return React.createElement(React.Fragment, null, content);
        };
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.appPage);
        });
    }
    render(param) {
        return this.appContent();
    }
}
//# sourceMappingURL=CApp.js.map