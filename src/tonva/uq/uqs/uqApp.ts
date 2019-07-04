import { Uq } from './uq';
import { TuidImport, TuidLocal } from './tuid';
//import { loadAppUqs } from '../../net';

export class UqApp {
    name: string;
    id: number;
    appOwner: string;
    appName: string;
    private collection: {[uqName: string]: Uq} = {};

    constructor(tonvaAppName:string) {
        this.name = name;
        let parts = tonvaAppName.split('/');
        if (parts.length !== 2) {
            throw 'tonvaApp name must be / separated, owner/app';
        }
        this.appOwner = parts[0];
        this.appName = parts[1];
    }

    addUq(uq: Uq) {
        this.collection[uq.name] = uq;
    }

    setTuidImportsLocal() {
        for (let i in this.collection) {
            let uq = this.collection[i];
            for (let tuid of uq.tuidArr) {
                if (tuid.isImport === true) {
                    this.setLocal(tuid as TuidImport);
                }
            }
        }
    }

    private setLocal(tuidImport: TuidImport) {
        let {from} = tuidImport;
        let uq = this.collection[from.owner + '/' + from.uq];
        if (uq === undefined) {
            //debugger;
            return;
        }
        let tuid = uq.tuid(tuidImport.name);
        if (tuid === undefined) {
            //debugger;
            return;
        }
        if (tuid.isImport === true) {
            //debugger;
            return;
        }
        tuidImport.setFrom(tuid as TuidLocal);
    }

    /*
    async load(): Promise<string[]> {
        let uqAppData = await loadAppUqs(this.appOwner, this.appName);
        let {id, uqs} = uqAppData;
        this.id = id;

        let retErrors:string[] = [];

        let promises: PromiseLike<string>[] = [];
        let promiseChecks: PromiseLike<boolean>[] = [];
        for (let uqData of uqs) {
            //let {id:uqId, uqOwner, uqName, access} = uqData;
            //let uqn = uqOwner + '/' + uqName;
            let uq = new Uq(this, uqData);
            this.collection[uq.name] = uq;
            promises.push(uq.loadSchema());
            promiseChecks.push(uq.checkAccess());
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
}
