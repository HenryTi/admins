import * as React from 'react';
import {observable} from 'mobx';
import {User, Guest/*, UserInNav*/} from '../user';
import {Page} from './page';
import {netToken} from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import {FetchError} from '../fetchError';
import {appUrl, setMeInFrame, logoutUqTokens} from '../net/appBridge';
import {LocalData} from '../local';
import {guestApi, logoutApis, setCenterUrl, setCenterToken, WSChannel, meInFrame, isDevelopment, host} from '../net';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va-form.css';
import '../css/va.css';
import '../css/animation.css';
import { WsBase, wsBridge } from '../net/wsChannel';
import { resOptions } from './res';
import { Loading } from './loading';
import { Callbacks, Callback } from './callbacks';

const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|'  +
    'Opera Mini|IEMobile|Mobile' , 
    'i');
const isMobile = regEx.test(navigator.userAgent);
export const mobileHeaderStyle = isMobile? {
    minHeight:  '3em'
} : undefined;

const logo = require('../img/logo.svg');
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
export interface State {
    stack: StackItem[];
    wait: 0|1|2;
    fetchError: FetchError
}

export class NavView extends React.Component<Props, State> {
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
    async componentWillMount() {
        window.addEventListener('popstate', this.navBack);
    }

    async componentDidMount()
    {
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
        throw new Error('to be designed');
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
        this.refresh();
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
            if (self != window.top) {
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
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </li>;
                break;
        }
        if (fetchError)
            elError = <FetchErrorView clearError={this.clearError} {...fetchError} />
        return (
        <ul className='va'>
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
        </ul>
        );
    }

    private refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({stack: this.stack });
        // this.forceUpdate();
    }
}

export class Nav {
    private nav:NavView;
    private ws: WsBase;
    private wsHost: string;
    private local: LocalData = new LocalData();
    @observable user: User/*InNav*/ = undefined;
    language: string;
    culture: string;
    resUrl: string;

    constructor() {
        let {lang, district} = resOptions;
        this.language = lang;
        this.culture = district;
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

    async onReceive(msg:any) {
        if (this.ws === undefined) return;
        await this.ws.receive(msg);
    }

    private async getUnitName() {
        try {
            let unitRes = await fetch('unit.json', {});
            //if (unitRes)
            let res = await unitRes.json();
            return res.unit;
        }
        catch (err) {
            this.local.unit.clear();
            return;
        }
    }

    private async loadUnit() {
        let unitName:string;
        let unit = this.local.unit.get();
        if (unit !== undefined) {
            if (isDevelopment !== true) return unit.id;
            unitName = await this.getUnitName();
            if (unitName === undefined) return;
            if (unit.name === unitName) return unit.id;
        }
        else {
            unitName = await this.getUnitName();
            if (unitName === undefined) return;
        }
        let unitId = await guestApi.unitFromName(unitName);
        if (unitId !== undefined) {
            this.local.unit.set({id: unitId, name: unitName});
        }
        return unitId;
    }

    private isInFrame:boolean;
    private centerHost: string;
    async start() {
        nav.clear();
        nav.push(<Page header={false}><Loading /></Page>);
        await host.start();
        let {url, ws, resHost} = host;
        this.centerHost = url;
        this.resUrl = 'http://' + resHost + '/res/';
        this.wsHost = ws;
        setCenterUrl(url);
        
        let unit = await this.loadUnit();
        meInFrame.unit = unit;

        let guest:Guest = this.local.guest.get();
        if (guest === undefined) {
            guest = await guestApi.guest();
        }
        nav.setGuest(guest);

        let hash = document.location.hash;
        // document.title = document.location.origin;
        console.log("url=%s hash=%s", document.location.origin, hash);
        this.isInFrame = hash !== undefined && hash !== '' && hash.startsWith('#tv');
        if (this.isInFrame === true) {
            let mif = setMeInFrame(hash);
            if (mif !== undefined) {
                this.ws = wsBridge;
                console.log('this.ws = wsBridge in sub frame');
                //nav.user = {id:0} as User;
                if (self !== window.parent) {
                    window.parent.postMessage({type:'sub-frame-started', hash: mif.hash}, '*');
                }
                // 下面这一句，已经移到 appBridge.ts 里面的 initSubWin，也就是响应从main frame获得user之后开始。
                //await this.showAppView();
                return;
            }
        }

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
    /*
    private loginCallbacks = new Callbacks<(user: User)=>Promise<void>>();
    private logoutCallbacks = new Callbacks<()=>Promise<void>>();
    registerLoginCallback(callback: (user:User)=>Promise<void>) {
        this.loginCallbacks.register(callback);
    }
    unregisterLoginCallback(callback: (user:User)=>Promise<void>) {
        this.loginCallbacks.unregister(callback);
    }
    registerLogoutCallback(callback: ()=>Promise<void>) {
        this.logoutCallbacks.register(callback);
    }
    unregisterLogoutCallback(callback: ()=>Promise<void>) {
        this.logoutCallbacks.unregister(callback);
    }
    */
    async logined(user: User, callback?: (user:User)=>Promise<void>) {
        let ws:WSChannel = this.ws = new WSChannel(this.wsHost, user.token);
        ws.connect();

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

    async showLogin(callback?: (user:User)=>Promise<void>, withBack?:boolean) {
        let lv = await import('../entry/login');
        let loginView = <lv.default withBack={withBack} callback={callback} />;
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
        this.local.logoutClear();
        this.user = undefined; //{} as User;
        logoutApis();
        logoutUqTokens();
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
                <span id={uh.hash} onClick={()=>this.back()} style={mobileHeaderStyle}>
                    <i className="fa fa-arrow-left" />
                </span>
                <iframe src={uh.url} />
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
