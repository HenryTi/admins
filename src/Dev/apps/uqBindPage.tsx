import * as React from 'react';
import { VPage, Page, nav } from "tonva-tools";
import { AppController, UqAccess } from ".";
import { LMR } from 'tonva-react-form';

export class UqBindPage extends VPage<AppController> {
    private uqAccess: UqAccess;
    private accesses: string[];
    private accessChecked:{[name:string]:boolean};
    async open(uqAccess: UqAccess) {
        this.uqAccess = uqAccess;
        let {uq, bind_access} = this.uqAccess;
        let {access} = uq;
        if (access) {
            this.accessChecked = {};
            this.accesses = access.split(',');
            for (let acc of this.accesses) {
                this.accessChecked[acc] = (bind_access && bind_access.find(bc => bc === acc)) !== undefined;
            }
        }
        this.openPage(this.page);
    }

    private onCheckChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let {target} = evt;
        this.accessChecked[target.name] = target.checked;
    }

    private saveUqBind = async () => {
        let acc:string[] = [];
        if (this.accesses) {
            for (let i in this.accessChecked) {
                if (this.accessChecked[i] === true) acc.push(i);
            }
        }
        await this.controller.saveUqBind(this.uqAccess.uq, acc);
        nav.pop();
    }

    private removeUqBind = async () => {
        await this.controller.removeUqBind(this.uqAccess.uq);
        nav.pop();
    }

    private page = ():JSX.Element => {
        let {uq, bind_access} = this.uqAccess;
        let {owner, name, discription, access} = uq;
        let btnDelete:any;
        if (bind_access !== null && bind_access !== undefined) {
            btnDelete = <button className="btn btn-outline-danger btn-sm" onClick={this.removeUqBind}>取消关联</button>;
        }
        let checkAccessList:any;
        if (this.accesses) {
            checkAccessList = <div className="mt-3">
            {
                this.accesses.map(v => {
                    let checked = this.accessChecked[v];
                    return <label key={v} className="d-inline-block mr-4">
                        <input onChange={this.onCheckChanged}
                            style={{width:'1.1rem', height:'1.1rem'}} 
                            name={v} type="checkbox" defaultChecked={checked} />&nbsp;{v}
                    </label>;
                })
            }
            </div>;
        }
        return <Page header="关联UQ">
            <div className="m-3 py-3 px-3 bg-white border">
                <div>{owner} / {name}</div>
                <div className="text-muted">{discription}</div>
                {checkAccessList}
                <LMR className="pt-3" right={btnDelete}>
                    <button className="btn btn-primary btn-sm" onClick={this.saveUqBind}>保存关联</button>
                </LMR>
            </div>
        </Page>;
    }
}