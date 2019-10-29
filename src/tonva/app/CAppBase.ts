//import _ from 'lodash';
import { Controller, nav } from "../components";
import { Tuid, Action, Sheet, Query, Map, UQsMan, TVs } from "../uq";
import { appInFrame, loadAppUqs, UqAppData } from "../net";
import { centerApi } from "./centerApi";
import { VUnitSelect, VErrorsPage, VStartError, VUnsupportedUnit } from "./vMain";

type EntityType = Tuid | Action | Sheet | Query | Map;

export interface IConstructor<T> {
    new (...args: any[]): T;

    // Or enforce default constructor
    // new (): T;
}

export interface AppConfig {
    appName: string;        // 格式: owner/appName
    version: string;        // 版本变化，缓存的uqs才会重载
    tvs: TVs;
    uqNameMap?: {[uqName:string]: string};      // uqName='owner/uq' 映射到内存简单名字：uq, 可以注明映射，也可以自动。有可能重
    loginTop?: JSX.Element;
    oem?: string;               // 用户注册发送验证码的oem厂家，默认同花
}

export abstract class CAppBase extends Controller {
    protected _uqs: any;

    protected readonly name: string;
    protected readonly version: string;

    readonly uqsMan: UQsMan;
    appUnits:any[];

    // appName: owner/name
    constructor(config: AppConfig) {
        super(undefined);
        let {appName, version, tvs} = config;
        this.name = appName;
        if (appName === undefined) {
            throw new Error('appName like "owner/app" must be defined in MainConfig');
        }
        this.version = version;
        this.uqsMan = new UQsMan(this.name, tvs);
    }

    get uqs(): any {return this._uqs;}

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
                this.appUnits = await centerApi.userAppUnits(this.uqsMan.id);
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
                this.openVPage(VErrorsPage, retErrors);
                return false;
            }
            return true;
        }
        catch (err) {
            this.openVPage(VStartError, err);
            return false;
        }
    }

    private async load(): Promise<string[]> {
        let {appOwner, appName} = this.uqsMan;
        let {localData} = this.uqsMan;
        let uqAppData:UqAppData = localData.get();
        if (!uqAppData || uqAppData.version !== this.version) {
            uqAppData = await loadAppUqs(appOwner, appName);
            uqAppData.version = this.version;
            localData.set(uqAppData);
            // 
            for (let uq of uqAppData.uqs) uq.newVersion = true;
        }
        let {id, uqs} = uqAppData;
        this.uqsMan.id = id;
        await this.uqsMan.init(uqs);
        let retErrors = await this.uqsMan.load();
        if (retErrors.length === 0) {
            retErrors.push(...this.uqsMan.setTuidImportsLocal());
            if (retErrors.length === 0) {
                this._uqs = this.uqsMan.buildUQs();
                /*
                _.merge(this.uqs, this.uqsMan.uqsColl);
                for (let i in this.uqs) {
                    let p = i.indexOf('/');
                    if (p < 0) continue;
                    let uq = this.uqs[i];
                    
                    let n = i.substr(p+1);
                    let l = n.toLowerCase();
                    this.uqs[n] = uq;
                    if (l !== n) this.uqs[l] = uq;
                }
                */
                return;
            }
        }
        return retErrors;
    }

    private showUnsupport(predefinedUnit: number) {
        nav.clear();
        this.openVPage(VUnsupportedUnit, predefinedUnit);
    }
}
