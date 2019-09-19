//import _ from 'lodash';
import { nav, Controller, TypeVPage, resLang, NavSettings} from '../../components';
import { loadAppUqs, appInFrame, getExHash, UqData} from '../../net';
import { CUq, UqUI } from '../cUq';
import { centerApi } from '../centerApi';
import { UQsMan } from '../../uq';
import { VUnsupportedUnit, VAppMain, VUnitSelect, VErrorsPage, VAppStartError } from './vApp';

export interface RoleAppUI {
    CApp?: typeof CApp;
    CUq?: typeof CUq;
    main?: TypeVPage<CApp>;
    uqs: {[uq:string]: UqUI | (()=>Promise<UqUI>)};
    res?: any;
}

export interface AppUI extends RoleAppUI, NavSettings {
    appName: string;        // 格式: owner/appName
    version: string;        // 版本变化，缓存的uqs才会重载
    roles?: {[role:string]: RoleAppUI | (()=>Promise<RoleAppUI>)};
}

export class CApp extends Controller {
    private readonly cUqCollection: {[uq:string]: CUq} = {};
    private readonly cImportUqs: {[uq:string]: CUq} = {};
    protected ui:AppUI;
    readonly name: string;
    readonly version: string;
    readonly uqs: UQsMan;
    readonly caption: string; // = 'View Model 版的 Uq App';
    appUnits:any[];

    constructor(ui:AppUI) {
        super(resLang(ui && ui.res));
        nav.setSettings(ui);
        this.name = ui.appName;
        this.version = ui.version;
        if (this.name === undefined) {
            throw new Error('appName like "owner/app" must be defined in UI');
        }
        this.uqs = new UQsMan(this.name, undefined);
        if (ui.uqs === undefined) ui.uqs = {};
        this.ui = ui;
        this.caption = this.res.caption || 'Tonva';
    }
    
    getImportUq(uqOwner:string, uqName:string):CUq {
        let uq = uqOwner + '/' + uqName;
        let cUq = this.cImportUqs[uq];
        if (cUq !== undefined) return cUq;
        //let ui = this.ui && this.ui.uqs && this.ui.uqs[uq];
        //let uqId = -1; // unknown
        this.cImportUqs[uq] = cUq = this.getCUq(uq);
        return cUq;
    }

    protected newCUq(uqData: UqData, uqUI: UqUI) {
        let cUq = new (this.ui.CUq || CUq)(this, uqData, uqUI);
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

    getCUq(uq:string):CUq {
        return this.cUqCollection[uq];
    }

    protected get VAppMain():TypeVPage<CApp> {return (this.ui&&this.ui.main) || VAppMain}
    protected async beforeStart():Promise<boolean> {
        try {
            let retErrors = await this.load();
            //let app = await loadAppUqs(this.appOwner, this.appName);
            // if (isDevelopment === true) {
            // 这段代码原本打算只是在程序员调试方式下使用，实际上，也可以开放给普通用户，production方式下
            let {predefinedUnit} = appInFrame;
            //let {id} = app;
            //this.id = id;
            let {user} = nav;
            if (user !== undefined && user.id > 0) {
                this.appUnits = await centerApi.userAppUnits(this.uqs.id);
                switch (this.appUnits.length) {
                    case 0:
                        this.showUnsupport(predefinedUnit);
                        return false;
                    case 1:
                        let appUnit = this.appUnits[0].id;
                        if (appUnit === undefined || appUnit < 0 || 
                            (predefinedUnit !== undefined && appUnit !== predefinedUnit))
                        {
                            this.showUnsupport(predefinedUnit);
                            return false;
                        }
                        appInFrame.unit = appUnit;
                        break;
                    default:
                        if (predefinedUnit>0 && this.appUnits.find(v => v.id===predefinedUnit) !== undefined) {
                            appInFrame.unit = predefinedUnit;
                            break;
                        }
                        //nav.push(<this.selectUnitPage />)
                        this.openVPage(VUnitSelect);
                        return false;
                }
            }
            if (retErrors !== undefined) {
                this.openVPage(VErrorsPage);
                return false;
            }
            return true;
        }
        catch (err) {
            this.openVPage(VAppStartError);
            return false;
        }
    }

    private async load(): Promise<string[]> {
        let {appOwner, appName} = this.uqs;
        let {localData} = this.uqs;
        let uqAppData = localData.get();
        if (!uqAppData || uqAppData.version !== this.version) {
            uqAppData = await loadAppUqs(appOwner, appName);
            uqAppData.version = this.version;
            localData.set(uqAppData);
            for (let uq of uqAppData.uqs) uq.newVersion = true;
        }
        let {id, uqs} = uqAppData;
        this.uqs.id = id;

        let retErrors:string[] = [];

        let promiseInits: PromiseLike<void>[] = [];
        let promises: PromiseLike<string>[] = [];
        for (let uqData of uqs) {
            let {uqOwner, uqName} = uqData;
            let uqFullName = uqOwner + '/' + uqName;
            let uqUI = this.ui.uqs[uqFullName] as UqUI || {};
            let cUq = this.newCUq(uqData, uqUI);
            this.cUqCollection[uqFullName] = cUq;
            this.uqs.addUq(cUq.uq);
            promiseInits.push(cUq.init());
        }
        await Promise.all(promiseInits);

        for (let i in this.cUqCollection) {
            let cUq = this.cUqCollection[i];
            promises.push(cUq.loadEntities());
        }
        let results = await Promise.all(promises);
        for (let result of results)
        {
            let retError = result; // await cUq.loadSchema();
            if (retError !== undefined) {
                retErrors.push(retError);
                continue;
            }
        }
        if (retErrors.length === 0) {
            retErrors.push(...this.uqs.setTuidImportsLocal());
            if (retErrors.length === 0) {
                return;
            }
        }
        return retErrors;
    }

    protected async internalStart(param:any) {
        if (param !== true) {
            this.clearPrevPages();
        }
        await this.showMainPage();
    }

    /*
    render(): JSX.Element {
        return this.renderView(this.VAppMain);
    }*/

    // 如果是独立app，删去显示app之前的页面。
    // 如果非独立app，则不删
    protected clearPrevPages() {
        nav.clear();
    }

    private showUnsupport(predefinedUnit: number) {
        this.clearPrevPages();
        this.openVPage(VUnsupportedUnit, predefinedUnit);
    }

    private async showMainPage() {
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
                    await cUq.navSheet(sheetTypeId, sheetId);
                    return;
                }
            }
        }
        this.openVPage(this.VAppMain);
    }

    private getCUqFromId(uqId:number): CUq {
        for (let i in this.cUqCollection) {
            let cUq = this.cUqCollection[i];
            if (cUq.uq.id === uqId) return cUq;
        }
        return;
    }
}
