import { LocalMap, LocalCache, env } from '../tool';
import { UqData } from '../net';
import { UqMan } from './uqMan';
import { TuidImport, TuidInner } from './tuid';

export interface TVs {
    [uqName:string]: {
        [tuidName: string]: (values: any) => JSX.Element;
    }
}

export class UQsMan {
    private collection: {[uqName: string]: UqMan};
    private readonly tvs: TVs;

    readonly name: string;
    readonly appOwner: string;
    readonly appName: string;
    readonly localMap: LocalMap;
    readonly localData: LocalCache;
    id: number;

    constructor(tonvaAppName:string, tvs:TVs) {
        this.tvs = tvs || {};
        this.buildTVs();
        this.collection = {};
        let parts = tonvaAppName.split('/');
        if (parts.length !== 2) {
            throw new Error('tonvaApp name must be / separated, owner/app');
        }
        this.appOwner = parts[0];
        this.appName = parts[1];
        this.localMap = env.localDb.map(tonvaAppName);
        this.localData = this.localMap.child('uqData');
    }

    // to be removed in the future
    addUq(uq: UqMan) {
        this.collection[uq.name] = uq;
    }

    private buildTVs() {
        for (let i in this.tvs) {
            let uqTVs = this.tvs[i];
            if (uqTVs === undefined) continue;
            let l = i.toLowerCase();
            if (l === i) continue;
            this.tvs[l] = uqTVs;
            for (let j in uqTVs) {
                let en = uqTVs[j];
                if (en === undefined) continue;
                let lj = j.toLowerCase();
                if (lj === j) continue;
                uqTVs[lj] = en;
            }
        }
    }

    async init(uqsData:UqData[]):Promise<void> {
        let promiseInits: PromiseLike<void>[] = [];
        for (let uqData of uqsData) {
            let {uqOwner, uqName} = uqData;
            let uqFullName = uqOwner + '/' + uqName;
            //let uqUI = this.ui.uqs[uqFullName] as UqUI || {};
            //let cUq = this.newCUq(uqData, uqUI);
            //this.cUqCollection[uqFullName] = cUq;
            //this.uqs.addUq(cUq.uq);
            let uq = new UqMan(this, uqData, undefined, this.tvs[uqFullName] || this.tvs[uqName]);
            this.collection[uqFullName] = uq;
            let lower = uqFullName.toLowerCase();
            if (lower !== uqFullName) {
                this.collection[lower] = uq;
            }
            promiseInits.push(uq.init());
        }
        await Promise.all(promiseInits);
    }

    async load(): Promise<string[]> {
        let retErrors:string[] = [];
        let promises: PromiseLike<string>[] = [];
        for (let i in this.collection) {
            let uq = this.collection[i];
            promises.push(uq.loadEntities());
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
        return retErrors;
    }

    buildUQs(): any {
        let uqs:any = {};
        for (let i in this.collection) {
            let uqMan = this.collection[i];
            //let n = uqMan.name;
            let uqName = uqMan.uqName;
            let l = uqName.toLowerCase();
            let entities = uqMan.entities;
            let keys = Object.keys(entities);
            for (let key of keys) {
                let entity = entities[key];
                let {name, sName} = entity;
                if (name !== sName) entities[sName] = entity;
            }
            uqs[i] = entities;
            uqs[uqName] = entities;
            if (l !== uqName) uqs[l] = entities;
        }
        return uqs;
    }

    setTuidImportsLocal():string[] {
        let ret:string[] = [];
        for (let i in this.collection) {
            let uq = this.collection[i];
            for (let tuid of uq.tuidArr) {
                if (tuid.isImport === true) {
                    let error = this.setInner(tuid as TuidImport);
                    if (error) ret.push(error);
                }
            }
        }
        return ret;
    }

    private setInner(tuidImport: TuidImport):string {
        let {from} = tuidImport;
        let fromName = from.owner + '/' + from.uq;
        let uq = this.collection[fromName];
        if (uq === undefined) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} is not loaded`;
        }
        let iName = tuidImport.name
        let tuid = uq.tuid(iName);
        if (tuid === undefined) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} has no Tuid ${iName}`;
        }
        if (tuid.isImport === true) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} Tuid ${iName} is import`;
        }
        tuidImport.setFrom(tuid as TuidInner);
    }
}
