import * as React from 'react';
import _ from 'lodash';
import { Page, loadAppUqs, nav, meInFrame, Controller, TypeVPage, VPage, resLang} from 'tonva-tools';
import { List, LMR, FA } from 'tonva-react-form';
import { CUq, EntityType, UqUI } from './uq';
import { centerApi } from '../centerApi';

export interface AppUI {
    CApp?: typeof CApp;
    CUq?: typeof CUq;
    main?: TypeVPage<CApp>;
    uqs: {[uq:string]: UqUI};
    res?: any;
}

export class CApp extends Controller {
    private appOwner:string;
    private appName:string;
    private isProduction:boolean;
    private cImportUqs: {[uq:string]: CUq} = {};
    protected ui:AppUI;
    id: number;
    appUnits:any[];

    constructor(tonvaApp:string, ui?:AppUI) {
        super(resLang(ui && ui.res));
        let parts = tonvaApp.split('/');
        if (parts.length !== 2) {
            throw 'tonvaApp name must be / separated, owner/app';
        }
        this.appOwner = parts[0];
        this.appName = parts[1];
        this.ui = ui || {uqs:{}};
        this.caption = this.res.caption || 'Tonva';
    }
    
    readonly caption: string; // = 'View Model 版的 Uq App';
    cUqCollection: {[uq:string]: CUq} = {};

    async startDebug() {
        let appName = this.appOwner + '/' + this.appName;
        let cApp = new CApp(appName, {uqs:{}} );
        let keepNavBackButton = true;
        await cApp.start(keepNavBackButton);    
    }

    protected async loadUqs(): Promise<string[]> {
        let retErrors:string[] = [];
        let unit = meInFrame.unit;
        let app = await loadAppUqs(this.appOwner, this.appName);
        let {id, uqs} = app;
        this.id = id;

        let promises: PromiseLike<string>[] = [];
        let promiseChecks: PromiseLike<boolean>[] = [];
        for (let appUq of uqs) {
            let {id:uqId, uqOwner, uqName, url, urlDebug, ws, access, token} = appUq;
            let uq = uqOwner + '/' + uqName;
            let ui = this.ui && this.ui.uqs && this.ui.uqs[uq];
            let cUq = this.newCUq(uq, uqId, access, ui || {});
            this.cUqCollection[uq] = cUq;
            promises.push(cUq.loadSchema());
            promiseChecks.push(cUq.entities.uqApi.checkAccess());
        }
        let results = await Promise.all(promises);
        Promise.all(promiseChecks).then((checks) => {
            for (let c of checks) {
                if (c === false) {
                    nav.start();
                    return;
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

    async getImportUq(uqOwner:string, uqName:string):Promise<CUq> {
        let uq = uqOwner + '/' + uqName;
        let cUq = this.cImportUqs[uq];
        if (cUq !== undefined) return cUq;
        let ui = this.ui && this.ui.uqs && this.ui.uqs[uq];
        let uqId = -1; // unknown
        this.cImportUqs[uq] = cUq = this.newCUq(uq, uqId, undefined, ui || {});
        let retError = await cUq.loadSchema();
        if (retError !== undefined) {
            console.error(retError);
            debugger;
            return;
        }
        return cUq;
    }

    protected newCUq(uq:string, uqId:number, access:string, ui:any) {
        let cUq = new (this.ui.CUq || CUq)(this, uq, this.id, uqId, access, ui);        
        Object.setPrototypeOf(cUq.x, this.x);
        return cUq;
    }

    get cUqArr():CUq[] {
        let ret:CUq[] = [];
        for (let i in this.cUqCollection) {
            ret.push(this.cUqCollection[i]);
        }
        return ret;
    }

    getCUq(apiName:string):CUq {
        return this.cUqCollection[apiName];
    }

    protected get VAppMain():TypeVPage<CApp> {return (this.ui&&this.ui.main) || VAppMain}
    protected async beforeStart():Promise<boolean> {
        //if (await super.beforeStart() === false) return false;
        try {
            let hash = document.location.hash;
            if (hash.startsWith('#tvdebug')) {
                this.isProduction = false;
                //await this.showMainPage();
                //return;
            }
            else {
                this.isProduction = hash.startsWith('#tv');
            }
            let {unit} = meInFrame;
            if (this.isProduction === false && (unit===undefined || unit<=0)) {
                let app = await loadAppUqs(this.appOwner, this.appName);
                let {id} = app;
                this.id = id;
                await this.loadAppUnits();
                switch (this.appUnits.length) {
                    case 0:
                        this.showUnsupport();
                        return false;
                    case 1:
                        unit = this.appUnits[0].id;
                        if (unit === undefined || unit < 0) {
                            this.showUnsupport();
                            return false;
                        }
                        meInFrame.unit = unit;
                        break;
                    default: 
                        //nav.clear();
                        nav.push(<this.selectUnitPage />)
                        return false;
                }
            }

            let retErrors = await this.loadUqs();
            if (retErrors !== undefined) {
                this.openPage(<Page header="ERROR">
                    <div className="m-3">
                        <div>Load Uqs 发生错误：</div>
                        {retErrors.map((r, i) => <div key={i}>{r}</div>)}
                    </div>
                </Page>);
                return false;
            }
            return true;
        }
        catch (err) {
            nav.push(<Page header="App start error!">
                <pre>
                    {typeof err === 'string'? err : err.message}
                </pre>
            </Page>);
            return false;
        }
    }

    protected async internalStart(param:any) {
        if (param !== true) {
            this.clearPrevPages();
        }
        await this.showMainPage();
    }
    async load() {
        await this.beforeStart();
    }

    render(): JSX.Element {
        return this.renderView(this.VAppMain);
    }

    // 如果是独立app，删去显示app之前的页面。
    // 如果非独立app，则不删
    protected clearPrevPages() {
        nav.clear();
    }

    private showUnsupport() {
        this.clearPrevPages();
        this.openPage(<Page header="APP无法运行" logout={true}>
            <div className="m-3 text-danger container">
                <div className="form-group row">
                    <div className="col-2">
                        <FA name="exclamation-triangle" />
                    </div>
                    <div className="col">
                        用户不支持APP
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-2">用户: </div>
                    <div className="col">{`${nav.user.name}`}</div>
                </div>
                <div className="form-group row">
                    <div className="col-2">App:</div>
                    <div className="col">{`${this.appOwner}/${this.appName}`}</div>
                </div>
            </div>
        </Page>)
    }

    private async showMainPage() {
        // #tvRwPBwMef-23-sheet-api-108
        let parts = document.location.hash.split('-');
        if (parts.length > 2) {
            let action = parts[2];
            // sheet_debug 表示centerUrl是debug方式的
            if (action === 'sheet' || action === 'sheet_debug') {
                let uqId = Number(parts[3]);
                let sheetTypeId = Number(parts[4]);
                let sheetId = Number(parts[5]);
                let cUq = this.getCUqFromId(uqId);
                if (cUq === undefined) {
                    alert('unknown uqId: ' + uqId);
                    return;
                }
                this.clearPrevPages();
                await cUq.navSheet(sheetTypeId, sheetId);
                return;
            }
        }
        this.openVPage(this.VAppMain);
    }

    private getCUqFromId(uqId:number): CUq {
        for (let i in this.cUqCollection) {
            let cUq = this.cUqCollection[i];
            if (cUq.id === uqId) return cUq;
        }
        return;
    }

    private async loadAppUnits() {
        let ret = await centerApi.userAppUnits(this.id);
        this.appUnits = ret;
        if (ret.length === 1) {
            meInFrame.unit = ret[0].id;
        }
    }

    renderRow = (item: any, index: number):JSX.Element => {
        let {id, nick, name} = item;
        return <LMR className="px-3 py-2" right={'id: ' + id}>
            <div>{nick || name}</div>
        </LMR>;
    }
    onRowClick = async (item: any) => {
        meInFrame.unit = item.id; // 25;
        await this.start();
    }

    protected selectUnitPage = () => {
        return <Page header="选择小号" logout={true}>
            <List items={this.appUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>
    }
}

class VAppMain extends VPage<CApp> {
    async open(param?:any) {
        this.openPage(this.appPage);
    }

    render(param?:any) {
        return this.appContent();
    }

    protected appPage() {
        let {caption} = this.controller;
        return <Page header={caption} logout={()=>{meInFrame.unit = undefined}}>
            {this.appContent()}
        </Page>;
    }

    protected appContent = () => {
        let {cUqArr} = this.controller;
        let content:any;
        if (cUqArr.length === 0) {
            content = <div className="text-danger">
                <FA name="" /> 此APP没有绑定任何的UQ
            </div>;
        }
        else {
            content = cUqArr.map((v,i) => <div key={i}>{v.render()}</div>);
        }
        return <>{content}</>;
    };
}
