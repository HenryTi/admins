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
import * as React from 'react';
import { observable } from 'mobx';
import { Page } from './page';
import { netToken } from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import { appUrl, setAppInFrame, getExHash, getExHashPos } from '../net/appBridge';
import { LocalData } from '../local';
import { guestApi, logoutApis, setCenterUrl, setCenterToken, WSChannel, appInFrame, isDevelopment, host } from '../net';
import { wsBridge } from '../net/wsChannel';
import { resOptions } from './res';
import { Loading } from './loading';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va-form.css';
import '../css/va.css';
import '../css/animation.css';
const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|' +
    'Opera Mini|IEMobile|Mobile', 'i');
const isMobile = regEx.test(navigator.userAgent);
/*
export const mobileHeaderStyle = isMobile? {
    minHeight:  '3em'
} : undefined;
*/
const logo = require('../img/logo.svg');
let logMark;
const logs = [];
;
let stackKey = 1;
export class NavView extends React.Component {
    constructor(props) {
        super(props);
        this.waitCount = 0;
        this.isHistoryBack = false;
        this.clearError = () => {
            this.setState({ fetchError: undefined });
        };
        this.back = this.back.bind(this);
        this.navBack = this.navBack.bind(this);
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: 0,
            fetchError: undefined
        };
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            window.addEventListener('popstate', this.navBack);
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            nav.set(this);
            /*
            let start = this.props.start;
            if (start !== undefined) {
                await start();
            }
            else {
            */
            yield nav.start();
            //}
        });
    }
    get level() {
        return this.stack.length;
    }
    startWait() {
        if (this.waitCount === 0) {
            this.setState({ wait: 1 });
            this.waitTimeHandler = global.setTimeout(() => {
                this.waitTimeHandler = undefined;
                this.setState({ wait: 2 });
            }, 1000);
        }
        ++this.waitCount;
        this.setState({
            fetchError: undefined,
        });
    }
    endWait() {
        setTimeout(() => {
            /*
            this.setState({
                fetchError: undefined,
            });*/
            --this.waitCount;
            if (this.waitCount === 0) {
                if (this.waitTimeHandler !== undefined) {
                    clearTimeout(this.waitTimeHandler);
                    this.waitTimeHandler = undefined;
                }
                this.setState({ wait: 0 });
            }
        }, 100);
    }
    onError(fetchError) {
        return __awaiter(this, void 0, void 0, function* () {
            let err = fetchError.error;
            if (err !== undefined && err.unauthorized === true) {
                yield nav.showLogin(undefined);
                return;
            }
            this.setState({
                fetchError: fetchError,
            });
        });
    }
    show(view, disposer) {
        this.clear();
        return this.push(view, disposer);
    }
    push(view, disposer) {
        this.removeCeased();
        if (this.stack.length > 0) {
            window.history.pushState('forward', null, null);
        }
        let key = stackKey++;
        this.stack.push({
            key: key,
            view: view,
            ceased: false,
            disposer: disposer
        });
        this.refresh();
        //console.log('push: %s pages', this.stack.length);
        return key;
    }
    replace(view, disposer) {
        let item = undefined;
        let stack = this.stack;
        if (stack.length > 0) {
            item = stack.pop();
            //this.popAndDispose();
        }
        let key = stackKey++;
        this.stack.push({
            key: key,
            view: view,
            ceased: false,
            disposer: disposer
        });
        if (item !== undefined)
            this.dispose(item.disposer);
        this.refresh();
        //console.log('replace: %s pages', this.stack.length);
        return key;
    }
    ceaseTop(level = 1) {
        let p = this.stack.length - 1;
        for (let i = 0; i < level; i++, p--) {
            if (p < 0)
                break;
            let item = this.stack[p];
            item.ceased = true;
        }
    }
    pop(level = 1) {
        let stack = this.stack;
        let len = stack.length;
        //console.log('pop start: %s pages level=%s', len, level);
        if (level <= 0 || len <= 1)
            return;
        if (len < level)
            level = len;
        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0)
                break;
            //stack.pop();
            this.popAndDispose();
            ++backLevel;
        }
        if (backLevel >= len)
            backLevel--;
        this.refresh();
        if (this.isHistoryBack !== true) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(backLevel);
            //window.addEventListener('popstate', this.navBack);
        }
        //console.log('pop: %s pages', stack.length);
    }
    popTo(key) {
        if (key === undefined)
            return;
        if (this.stack.find(v => v.key === key) === undefined)
            return;
        while (this.stack.length > 0) {
            let len = this.stack.length;
            let top = this.stack[len - 1];
            if (top.key === key)
                break;
            this.pop();
        }
    }
    topKey() {
        let len = this.stack.length;
        if (len === 0)
            return undefined;
        return this.stack[len - 1].key;
    }
    removeCeased() {
        for (;;) {
            let p = this.stack.length - 1;
            if (p < 0)
                break;
            let top = this.stack[p];
            if (top.ceased === false)
                break;
            let item = this.stack.pop();
            let { disposer } = item;
            this.dispose(disposer);
        }
        this.refresh();
    }
    popAndDispose() {
        this.removeCeased();
        let item = this.stack.pop();
        if (item === undefined)
            return;
        let { disposer } = item;
        this.dispose(disposer);
        this.removeCeased();
        return item;
    }
    dispose(disposer) {
        if (disposer === undefined)
            return;
        let item = this.stack.find(v => v.disposer === disposer);
        if (item === undefined)
            disposer();
    }
    clear() {
        let len = this.stack.length;
        while (this.stack.length > 0)
            this.popAndDispose();
        //this.refresh();
        if (len > 1) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(len-1);
            //window.addEventListener('popstate', this.navBack);
        }
    }
    regConfirmClose(confirmClose) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0)
            return;
        let top = stack[len - 1];
        top.confirmClose = confirmClose;
    }
    navBack() {
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }
    back(confirm = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let stack = this.stack;
            let len = stack.length;
            if (len === 0)
                return;
            if (len === 1) {
                if (self != window.top) {
                    window.top.postMessage({ type: 'pop-app' }, '*');
                }
                return;
            }
            let top = stack[len - 1];
            if (confirm === true && top.confirmClose) {
                if ((yield top.confirmClose()) === true)
                    this.pop();
            }
            else {
                this.pop();
            }
        });
    }
    confirmBox(message) {
        return window.confirm(message);
    }
    render() {
        const { wait, fetchError } = this.state;
        let stack = this.state.stack;
        let top = stack.length - 1;
        let elWait = null, elError = null;
        switch (wait) {
            case 1:
                elWait = React.createElement("li", { className: "va-wait va-wait1" });
                break;
            case 2:
                elWait = React.createElement("li", { className: "va-wait va-wait2" },
                    React.createElement(Loading, null));
                break;
            //<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            //<span className="sr-only">Loading...</span>
        }
        if (fetchError)
            elError = React.createElement(FetchErrorView, Object.assign({ clearError: this.clearError }, fetchError));
        return (React.createElement("ul", { className: 'va' },
            stack.map((item, index) => {
                let { key, view } = item;
                return React.createElement("li", { key: key, style: index < top ? { visibility: 'hidden' } : undefined }, view);
            }),
            elWait,
            elError));
    }
    refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({ stack: this.stack });
        // this.forceUpdate();
    }
}
export class Nav {
    constructor() {
        this.local = new LocalData();
        this.user = undefined;
        let { lang, district } = resOptions;
        this.language = lang;
        this.culture = district;
    }
    get guest() {
        let guest = this.local.guest;
        if (guest === undefined)
            return 0;
        let g = guest.get();
        if (g === undefined)
            return 0;
        return g.guest;
    }
    set(nav) {
        //this.logo = logo;
        this.nav = nav;
    }
    registerReceiveHandler(handler) {
        if (this.ws === undefined)
            return;
        return this.ws.onWsReceiveAny(handler);
    }
    unregisterReceiveHandler(handlerId) {
        if (this.ws === undefined)
            return;
        if (handlerId === undefined)
            return;
        this.ws.endWsReceive(handlerId);
    }
    onReceive(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws === undefined)
                return;
            yield this.ws.receive(msg);
        });
    }
    getPredefinedUnitName() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let unitRes = yield fetch('unit.json', {});
                //if (unitRes)
                let res = yield unitRes.json();
                return res.unit;
            }
            catch (err) {
                this.local.unit.clear();
                return;
            }
        });
    }
    loadPredefinedUnit() {
        return __awaiter(this, void 0, void 0, function* () {
            let envUnit = process.env.REACT_APP_UNIT;
            if (envUnit !== undefined) {
                return Number(envUnit);
            }
            let unitName;
            let unit = this.local.unit.get();
            if (unit !== undefined) {
                if (isDevelopment !== true)
                    return unit.id;
                unitName = yield this.getPredefinedUnitName();
                if (unitName === undefined)
                    return;
                if (unit.name === unitName)
                    return unit.id;
            }
            else {
                unitName = yield this.getPredefinedUnitName();
                if (unitName === undefined)
                    return;
            }
            let unitId = yield guestApi.unitFromName(unitName);
            if (unitId !== undefined) {
                this.local.unit.set({ id: unitId, name: unitName });
            }
            return unitId;
        });
    }
    setSettings(settings) {
        this.navSettings = settings;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hash = document.location.hash;
                if (hash !== undefined && hash.length > 0) {
                    let pos = getExHashPos();
                    if (pos < 0)
                        pos = undefined;
                    this.hashParam = hash.substring(1, pos);
                }
                nav.clear();
                this.startWait();
                yield host.start();
                let { url, ws, resHost } = host;
                this.centerHost = url;
                this.resUrl = 'http://' + resHost + '/res/';
                this.wsHost = ws;
                setCenterUrl(url);
                let guest = this.local.guest.get();
                if (guest === undefined) {
                    guest = yield guestApi.guest();
                }
                nav.setGuest(guest);
                let exHash = getExHash();
                let appInFrame = setAppInFrame(exHash);
                if (exHash !== undefined && window !== window.parent) {
                    // is in frame
                    if (appInFrame !== undefined) {
                        this.ws = wsBridge;
                        console.log('this.ws = wsBridge in sub frame');
                        //nav.user = {id:0} as User;
                        if (self !== window.parent) {
                            window.parent.postMessage({ type: 'sub-frame-started', hash: appInFrame.hash }, '*');
                        }
                        // 下面这一句，已经移到 appBridge.ts 里面的 initSubWin，也就是响应从main frame获得user之后开始。
                        //await this.showAppView();
                        return;
                    }
                }
                let predefinedUnit = yield this.loadPredefinedUnit();
                appInFrame.predefinedUnit = predefinedUnit;
                let user = this.local.user.get();
                if (user === undefined) {
                    let { notLogined } = this.nav.props;
                    if (notLogined !== undefined) {
                        yield notLogined();
                    }
                    else {
                        yield nav.showLogin(undefined);
                    }
                    return;
                }
                yield nav.logined(user);
            }
            catch (err) {
            }
            finally {
                this.endWait();
            }
        });
    }
    showAppView() {
        return __awaiter(this, void 0, void 0, function* () {
            let { onLogined } = this.nav.props;
            if (onLogined === undefined) {
                nav.push(React.createElement("div", null, "NavView has no prop onLogined"));
                return;
            }
            nav.clear();
            yield onLogined();
            console.log('logined: AppView shown');
        });
    }
    setGuest(guest) {
        this.local.guest.set(guest);
        netToken.set(0, guest.token);
    }
    saveLocalUser() {
        this.local.user.set(this.user);
    }
    logined(user, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            logoutApis();
            let ws = this.ws = new WSChannel(this.wsHost, user.token);
            ws.connect();
            console.log("logined: %s", JSON.stringify(user));
            this.user = user;
            this.saveLocalUser();
            netToken.set(user.id, user.token);
            if (callback !== undefined) //this.loginCallbacks.has)
                callback(user);
            //this.loginCallbacks.call(user);
            else {
                yield this.showAppView();
            }
        });
    }
    loginTop(defaultTop) {
        return (this.navSettings && this.navSettings.loginTop) || defaultTop;
    }
    showLogin(callback, withBack) {
        return __awaiter(this, void 0, void 0, function* () {
            let lv = yield import('../entry/login');
            let loginView = React.createElement(lv.default, { withBack: withBack, callback: callback });
            if (withBack !== true) {
                this.nav.clear();
                this.pop();
            }
            this.nav.push(loginView);
        });
    }
    showLogout(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            nav.push(React.createElement(Page, { header: "\u5B89\u5168\u9000\u51FA", back: "close" },
                React.createElement("div", { className: "m-5 border border-info bg-white rounded p-3 text-center" },
                    React.createElement("div", null, "\u9000\u51FA\u5F53\u524D\u8D26\u53F7\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u5386\u53F2\u6570\u636E\uFF0C\u4E0B\u6B21\u767B\u5F55\u4F9D\u7136\u53EF\u4EE5\u4F7F\u7528\u672C\u8D26\u53F7"),
                    React.createElement("div", { className: "mt-3" },
                        React.createElement("button", { className: "btn btn-danger", onClick: () => this.logout(callback) }, "\u9000\u51FA")))));
        });
    }
    logout(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            appInFrame.unit = undefined;
            this.local.logoutClear();
            this.user = undefined; //{} as User;
            logoutApis();
            let guest = this.local.guest.get();
            setCenterToken(0, guest && guest.token);
            this.ws = undefined;
            /*
            if (this.loginCallbacks.has)
                this.logoutCallbacks.call();
            else {
                if (notShowLogin === true) return;
            }
            await nav.start();
            */
            if (callback === undefined)
                yield nav.start();
            else
                yield callback();
        });
    }
    changePassword() {
        return __awaiter(this, void 0, void 0, function* () {
            let cp = yield import('../entry/changePassword');
            nav.push(React.createElement(cp.ChangePasswordPage, null));
        });
    }
    get level() {
        return this.nav.level;
    }
    startWait() {
        this.nav.startWait();
    }
    endWait() {
        this.nav.endWait();
    }
    onError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nav.onError(error);
        });
    }
    show(view, disposer) {
        this.nav.show(view, disposer);
    }
    push(view, disposer) {
        this.nav.push(view, disposer);
    }
    replace(view, disposer) {
        this.nav.replace(view, disposer);
    }
    pop(level = 1) {
        this.nav.pop(level);
    }
    topKey() {
        return this.nav.topKey();
    }
    popTo(key) {
        this.nav.popTo(key);
    }
    clear() {
        this.nav.clear();
    }
    navBack() {
        this.nav.navBack();
    }
    ceaseTop(level) {
        this.nav.ceaseTop(level);
    }
    removeCeased() {
        this.nav.removeCeased();
    }
    back(confirm = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nav.back(confirm);
        });
    }
    regConfirmClose(confirmClose) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message) {
        return this.nav.confirmBox(message);
    }
    navToApp(url, unitId, apiId, sheetType, sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let sheet = this.centerHost.includes('http://localhost:') === true ? 'sheet_debug' : 'sheet';
                let uh = sheetId === undefined ?
                    appUrl(url, unitId) :
                    appUrl(url, unitId, sheet, [apiId, sheetType, sheetId]);
                console.log('navToApp: %s', JSON.stringify(uh));
                nav.push(React.createElement("article", { className: 'app-container' },
                    React.createElement("span", { id: uh.hash, onClick: () => this.back() },
                        React.createElement("i", { className: "fa fa-arrow-left" })),
                    React.createElement("iframe", { src: uh.url })), () => {
                    resolve();
                });
            });
        });
    }
    navToSite(url) {
        // show in new window
        window.open(url);
    }
    get logs() { return logs; }
    ;
    log(msg) {
        logs.push(msg);
    }
    logMark() {
        let date = new Date();
        logMark = date.getTime();
        logs.push('log-mark: ' + date.toTimeString());
    }
    logStep(step) {
        logs.push(step + ': ' + (new Date().getTime() - logMark));
    }
}
__decorate([
    observable
], Nav.prototype, "user", void 0);
export const nav = new Nav();
//# sourceMappingURL=nav.js.map