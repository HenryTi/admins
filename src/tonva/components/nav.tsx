import * as React from 'react';
import {observable} from 'mobx';
import {User, Guest/*, UserInNav*/} from '../tool/user';
import {Page} from './page';
import {netToken} from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import {FetchError} from '../net/fetchError';
import {appUrl, setAppInFrame, getExHash, getExHashPos} from '../net/appBridge';
import {LocalData, env} from '../tool';
import {guestApi, logoutApis, setCenterUrl, setCenterToken, WSChannel, appInFrame, host, resUrlFromHost} from '../net';
import { WsBase, wsBridge } from '../net/wsChannel';
import { resOptions } from './res';
import { Loading } from './loading';

import 'font-awesome/css/font-awesome.min.css';
import '../css/va-form.css';
import '../css/va.css';
import '../css/animation.css';
import { FA } from './simple';

/*
const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|'  +
    'Opera Mini|IEMobile|Mobile' , 
    'i');
const isMobile = regEx.test(navigator.userAgent);
*/
/*
export const mobileHeaderStyle = isMobile? {
    minHeight:  '3em'
} : undefined;
*/
//const logo = require('../img/logo.svg');
let logMark: number;
const logs:string[] = [];

export interface Props //extends React.Props<Nav>
{
    //view: JSX.Element | (()=>JSX.Element);
    //start?: ()=>Promise<void>;
    onLogined: ()=>Promise<void>;
    notLogined?: ()=>Promise<void>;
};
let stackKey = 1;
export interface StackItem {
    key: number;
    view: JSX.Element;
    ceased: boolean;
    confirmClose?: ()=>Promise<boolean>;
    disposer?: ()=>void;
}
export interface NavViewState {
    stack: StackItem[];
    wait: 0|1|2;
    fetchError: FetchError
}

export class NavView extends React.Component<Props, NavViewState> {
    private stack: StackItem[];
    private htmlTitle: string;
    private waitCount: number = 0;
    private waitTimeHandler?: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
        this.navBack = this.navBack.bind(this);
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: 0,
            fetchError: undefined
        };
    }
    /*
    async componentWillMount() {
        window.addEventListener('popstate', this.navBack);
    }
    */
    async componentDidMount()
    {
        window.addEventListener('popstate', this.navBack);
        nav.set(this);
        /*
        let start = this.props.start;
        if (start !== undefined) {
            await start();
        }
        else {
        */
            await nav.start();
        //}
    }

    get level(): number {
        return this.stack.length;
    }

    startWait() {
        if (this.waitCount === 0) {
            this.setState({wait: 1});
            this.waitTimeHandler = global.setTimeout(
                () => {
                    this.waitTimeHandler = undefined;
                    this.setState({wait: 2});
                },
                1000) as NodeJS.Timer;
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
                this.setState({wait: 0});
            }
        },100);
    }

    async onError(fetchError: FetchError)
    {
        let err = fetchError.error;
        if (err !== undefined && err.unauthorized === true) {
            await nav.showLogin(undefined);
            return;
        }
        this.setState({
            fetchError: fetchError,
        });
    }

    private upgradeUq = () => {
        nav.start();
    }

    async showUpgradeUq(uq:string, version:number):Promise<void> {
        this.show(<Page header={false}>
            <div>
                UQ升级了，请点击按钮升级 <br />
                <small className="text-muted">{uq} ver-{version}</small>
                <button className="btn btn-primary" onClick={this.upgradeUq}>升级</button>
            </div>
        </Page>)
    }

    show(view: JSX.Element, disposer?: ()=>void): number {
        this.clear();
        return this.push(view, disposer);
    }

    push(view: JSX.Element, disposer?: ()=>void): number {
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

    replace(view: JSX.Element, disposer?: ()=>void): number {
        let item:StackItem = undefined;
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
        if (item !== undefined) this.dispose(item.disposer);
        this.refresh();
        //console.log('replace: %s pages', this.stack.length);
        return key;
    }

    ceaseTop(level:number = 1) {
        let p = this.stack.length - 1;
        for (let i=0; i<level; i++, p--) {
            if (p < 0) break;
            let item = this.stack[p];
            item.ceased = true;
        }
    }

    pop(level:number = 1) {
        let stack = this.stack;
        let len = stack.length;
        //console.log('pop start: %s pages level=%s', len, level);
        if (level <= 0 || len <= 1) return;
        if (len < level) level = len;
        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) break;
            //stack.pop();
            this.popAndDispose();
            ++backLevel;
        }
        if (backLevel >= len) backLevel--;
        this.refresh();
        if (this.isHistoryBack !== true) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(backLevel);
            //window.addEventListener('popstate', this.navBack);
        }
        //console.log('pop: %s pages', stack.length);
    }

    popTo(key: number) {
        if (key === undefined) return;
        if (this.stack.find(v => v.key === key) === undefined) return;
        while (this.stack.length >0) {
            let len = this.stack.length;
            let top = this.stack[len-1];
            if (top.key === key) break;
            this.pop();
        }
    }

    topKey():number {
        let len = this.stack.length;
        if (len === 0) return undefined;
        return this.stack[len-1].key;
    }

    removeCeased() {
        for (;;) {
            let p=this.stack.length-1;
            if (p < 0) break;
            let top = this.stack[p];
            if (top.ceased === false) break;
            let item = this.stack.pop();
            let {disposer} = item;
            this.dispose(disposer);
        }
        this.refresh();
    }

    private popAndDispose() {
        this.removeCeased();
        let item = this.stack.pop();
        if (item === undefined) return;
        let {disposer} = item;
        this.dispose(disposer);
        this.removeCeased();
        return item;
    }

    private dispose(disposer:()=>void) {
        if (disposer === undefined) return;
        let item = this.stack.find(v => v.disposer === disposer);
        if (item === undefined) disposer();
    }

    clear() {
        let len = this.stack.length;
        while (this.stack.length > 0) this.popAndDispose();
        //this.refresh();
        if (len > 1) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(len-1);
            //window.addEventListener('popstate', this.navBack);
        }
    }

    regConfirmClose(confirmClose:()=>Promise<boolean>) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        let top = stack[len-1];
        top.confirmClose = confirmClose;
    }

    private isHistoryBack:boolean = false;
    navBack() {
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }

    async back(confirm:boolean = true) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        if (len === 1) {
            if (window.self !== window.top) {
                window.top.postMessage({type:'pop-app'}, '*');
            }
            return;
        }
        let top = stack[len-1];
        if (confirm===true && top.confirmClose) {
            if (await top.confirmClose()===true) this.pop();
        }
        else {
            this.pop();
        }
    }

    confirmBox(message?:string): boolean {
        return window.confirm(message);
    }
    clearError = () => {
        this.setState({fetchError: undefined});
    }
    /*
    private clickCount = 0;
    private firstClick: number = 0;
    private clickRange = 3000;
    private clickMax = 6;
    private onClick = () => {
        let now = Date.now();
        if (now - this.firstClick > this.clickRange) {
            this.clickCount = 1;
            this.firstClick = now;
            return;
        }
        ++this.clickCount;
        if (this.clickCount >= this.clickMax) {
            nav.reverseTest();
            this.firstClick = 0;
            return;
        }
    }
    */
    /*
    private onTestClick = () => {
        nav.testing = false;
        nav.push(<Page header={false}>
            <div className="m-5 border border-info bg-white rounded p-4 text-center">
                <div>当前运行在测试模式</div>
                <div className="mt-4">
                    <button className="btn btn-danger" onClick={nav.toNormal}>正常模式</button>
                    <button className="btn btn-outline-info ml-3" onClick={()=>{nav.testing=true;this.pop()}}>测试模式</button>
                </div>
            </div>
        </Page>);
    }
    */
    render() {
        const {wait, fetchError} = this.state;
        let stack = this.state.stack;
        let top = stack.length - 1;
        let elWait = null, elError = null;
        switch (wait) {
            case 1:
                elWait = <li className="va-wait va-wait1">
                </li>;
                break;
            case 2:
                elWait = <li className="va-wait va-wait2">
                    <Loading />
                </li>;
                break;
        }
        if (fetchError)
            elError = <FetchErrorView clearError={this.clearError} {...fetchError} />;
        let test = nav.testing===true && 
            <span className="cursor-pointer position-absolute" style={{lineHeight:0}}>
                <FA className="text-warning" name="info-circle" />
            </span>;
        //onClick={this.onClick}
        return (
        <ul className="va">
            {
                stack.map((item, index) => {
                    let {key, view} = item;
                    return <li key={key} style={index<top? {visibility: 'hidden'}:undefined}>
                        {view}
                    </li>
                })
            }
            {elWait}
            {elError}
            {test}
        </ul>
        );
    }

    private refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({stack: this.stack });
        // this.forceUpdate();
    }
}

export interface NavSettings {
    loginTop?: JSX.Element;
}

export class Nav {
    private nav:NavView;
    private ws: WsBase;
    private wsHost: string;
    private local: LocalData = new LocalData();
    private navSettings: NavSettings;
    @observable user: User/*InNav*/ = undefined;
    testing: boolean;
    language: string;
    culture: string;
    resUrl: string;

    constructor() {
        let {lang, district} = resOptions;
        this.language = lang;
        this.culture = district;
        this.testing = false;
    }

    get guest(): number {
        let guest = this.local.guest;
        if (guest === undefined) return 0;
        let g = guest.get();
        if (g === undefined) return 0;
        return g.guest;
    }

    set(nav:NavView) {
        //this.logo = logo;
        this.nav = nav;
    }

    registerReceiveHandler(handler: (message:any)=>Promise<void>):number {
        if (this.ws === undefined) return;
        return this.ws.onWsReceiveAny(handler);
    }

    unregisterReceiveHandler(handlerId:number) {
        if (this.ws === undefined) return;
        if (handlerId === undefined) return;
        this.ws.endWsReceive(handlerId);
    }

    /*
    private static testMode = '测试';
    private static normalMode = '正常';
    private setTesting(testing:boolean) {
        this.testing = testing;
        this.local.testing.set(testing);
    };
    private resetTest = () => {
        this.setTesting(!this.testing);
        //this.pop();
        this.start();
    }
    toNormal = () => {
        this.setTesting(false);
        this.start();
    }
    reverseTest() {
        let m1:string, m2:string;
        if (this.testing === true) {
            m1 = Nav.testMode;
            m2 = Nav.normalMode;
        }
        else {
            m1 = Nav.normalMode;
            m2 = Nav.testMode;
        }

        this.push(<Page back="close" header={false}>
            <div className="m-5 border border-info bg-white rounded p-4 text-center">
                <div>
                    <p>从{m1}模式切换到{m2}模式吗?</p>
                    <p className="small text-muted">测试模式下，页面左上角会有一个 <FA className="text-warning" name="info-circle" /></p>
                </div>
                <div className="mt-4">
                    <button className="btn btn-danger" onClick={this.resetTest}>切换</button>
                    <button className="btn btn-outline-info ml-3" onClick={()=>this.pop()}>取消</button>
                </div>
            </div>
        </Page>);
    }
    */

    async onReceive(msg:any) {
        if (this.ws === undefined) return;
        await this.ws.receive(msg);
    }

    private async getPredefinedUnitName() {
        try {
            let unitJsonPath = this.unitJsonPath();
            let unitRes = await fetch(unitJsonPath, {});
            let res = await unitRes.json();
            return res.unit;
        }
        catch (err) {
            this.local.unit.remove();
            return;
        }
    }

    private async loadPredefinedUnit() {
        let envUnit = process.env.REACT_APP_UNIT;
        if (envUnit !== undefined) {
            return Number(envUnit);
        }
        let unitName:string;
        let unit = this.local.unit.get();
        if (unit !== undefined) {
            if (env.isDevelopment !== true) return unit.id;
            unitName = await this.getPredefinedUnitName();
            if (unitName === undefined) return;
            if (unit.name === unitName) return unit.id;
        }
        else {
            unitName = await this.getPredefinedUnitName();
            if (unitName === undefined) return;
        }
        let unitId = await guestApi.unitFromName(unitName);
        if (unitId !== undefined) {
            this.local.unit.set({id: unitId, name: unitName});
        }
        return unitId;
    }

    setSettings(settings?: NavSettings) {
        this.navSettings = settings;
    }

    hashParam: string;
    private centerHost: string;
    private arrs = ['/test', '/test/'];
    private unitJsonPath():string {
        let {href} = document.location;
        href = href.toLowerCase();
        for (let item of this.arrs) {
            if (href.endsWith(item) === true) {
                href = href.substr(0, href.length - item.length);
                break;
            }
        }
        if (href.endsWith('/') === true || href.endsWith('\\') === true) {
            href = href.substr(0, href.length-1);
        }
        return href + '/unit.json';
    }
    async start() {
        try {
            this.testing = env.testing;
            await host.start(this.testing);
            let hash = document.location.hash;
            if (hash !== undefined && hash.length > 0) {
                let pos = getExHashPos();
                if (pos < 0) pos = undefined;
                this.hashParam = hash.substring(1, pos);
            }
            nav.clear();
            this.startWait();
            let {url, ws, resHost} = host;
            this.centerHost = url;
            this.resUrl = resUrlFromHost( resHost);
            this.wsHost = ws;
            setCenterUrl(url);
            
            let guest:Guest = this.local.guest.get();
            if (guest === undefined) {
                guest = await guestApi.guest();
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
                    if (window.self !== window.parent) {
                        window.parent.postMessage({type:'sub-frame-started', hash: appInFrame.hash}, '*');
                    }
                    // 下面这一句，已经移到 appBridge.ts 里面的 initSubWin，也就是响应从main frame获得user之后开始。
                    //await this.showAppView();
                    return;
                }
            }

            let predefinedUnit = await this.loadPredefinedUnit();
            appInFrame.predefinedUnit = predefinedUnit;

            let user: User = this.local.user.get();
            if (user === undefined) {
                let {notLogined} = this.nav.props;
                if (notLogined !== undefined) {
                    await notLogined();
                }
                else {
                    await nav.showLogin(undefined);
                }
                return;
            }

            await nav.logined(user);
        }
        catch (err) {
        }
        finally {
            this.endWait();
        }
    }

    async showAppView() {
        let {onLogined} = this.nav.props;
        if (onLogined === undefined) {
            nav.push(<div>NavView has no prop onLogined</div>);
            return;
        }
        nav.clear();
        await onLogined();
        console.log('logined: AppView shown');
    }

    setGuest(guest: Guest) {
        this.local.guest.set(guest);
        netToken.set(0, guest.token);
    }

    saveLocalUser() {
        this.local.user.set(this.user);
    }

    async logined(user: User, callback?: (user:User)=>Promise<void>) {
        logoutApis();
        console.log("logined: %s", JSON.stringify(user));
        this.user = user;
        this.saveLocalUser();
        netToken.set(user.id, user.token);
        if (callback !== undefined) //this.loginCallbacks.has)
            callback(user);
            //this.loginCallbacks.call(user);
        else {
            await this.showAppView();
        }
    }

    wsConnect() {
        let ws:WSChannel = this.ws = new WSChannel(this.wsHost, this.user.token);
        ws.connect();
    }

    loginTop(defaultTop:JSX.Element) {
        return (this.navSettings && this.navSettings.loginTop) || defaultTop;
    }

    async showLogin(callback?: (user:User)=>Promise<void>, withBack?:boolean) {
        let lv = await import('../entry/login');
        let loginView = <lv.default 
            withBack={withBack} 
            callback={callback} />;
        if (withBack !== true) {
            this.nav.clear();
            this.pop();
        }
        this.nav.push(loginView);
    }

    async showLogout(callback?: ()=>Promise<void>) {
        nav.push(<Page header="安全退出" back="close">
            <div className="m-5 border border-info bg-white rounded p-3 text-center">
                <div>退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号</div>
                <div className="mt-3">
                    <button className="btn btn-danger" onClick={()=>this.logout(callback)}>退出</button>
                </div>
            </div>
        </Page>);
    }

    async logout(callback?:()=>Promise<void>) { //notShowLogin?:boolean) {
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
            await nav.start();
        else
            await callback();
    }

    async changePassword() {
        let cp = await import('../entry/changePassword');
        nav.push(<cp.ChangePasswordPage />);
    }

    get level(): number {
        return this.nav.level;
    }
    startWait() {
        this.nav.startWait();
    }
    endWait() {
        this.nav.endWait();
    }
    async onError(error: FetchError) {
        await this.nav.onError(error);
    }
    async showUpgradeUq(uq:string, version:number):Promise<void> {
        await this.nav.showUpgradeUq(uq, version);
    }

    show (view: JSX.Element, disposer?: ()=>void): void {
        this.nav.show(view, disposer);
    }
    push(view: JSX.Element, disposer?: ()=>void): void {
        this.nav.push(view, disposer);
    }
    replace(view: JSX.Element, disposer?: ()=>void): void {
        this.nav.replace(view, disposer);
    }
    pop(level:number = 1) {
        this.nav.pop(level);
    }
    topKey():number {
        return this.nav.topKey();
    }
    popTo(key:number) {
        this.nav.popTo(key);
    }
    clear() {
        this.nav.clear();
    }
    navBack() {
        this.nav.navBack();
    }
    ceaseTop(level?:number) {
        this.nav.ceaseTop(level);
    }
    removeCeased() {
        this.nav.removeCeased();
    }
    async back(confirm:boolean = true) {
        await this.nav.back(confirm);
    }
    regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message?:string): boolean {
        return this.nav.confirmBox(message);
    }
    async navToApp(url: string, unitId: number, apiId?:number, sheetType?:number, sheetId?:number):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let sheet = this.centerHost.includes('http://localhost:') === true? 'sheet_debug':'sheet'
            let uh = sheetId === undefined?
                    appUrl(url, unitId) :
                    appUrl(url, unitId, sheet, [apiId, sheetType, sheetId]);
            console.log('navToApp: %s', JSON.stringify(uh));
            nav.push(<article className='app-container'>
                <span id={uh.hash} onClick={()=>this.back()} /*style={mobileHeaderStyle}*/>
                    <i className="fa fa-arrow-left" />
                </span>
                {
                    // eslint-disable-next-line 
                    <iframe src={uh.url} title={String(sheetId)} />
                }
            </article>, 
            ()=> {
                resolve();
            });
        });
    }

    navToSite(url: string) {
        // show in new window
        window.open(url);
    }

    get logs() {return logs};
    log(msg:string) {
        logs.push(msg);
    }
    logMark() {
        let date = new Date();
        logMark = date.getTime();
        logs.push('log-mark: ' + date.toTimeString());
    }
    logStep(step:string) {
        logs.push(step + ': ' + (new Date().getTime() - logMark));
    }
}
export const nav: Nav = new Nav();
