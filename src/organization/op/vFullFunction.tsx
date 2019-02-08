import * as React from 'react';
import { VPage, Page, nav } from "tonva-tools";
import { COpBinding } from "./cOpBinding";
import { Uq } from './model';
import { List, FA, SearchBox } from 'tonva-react-form';
import { observable } from 'mobx';
import { CMap, CQuery, QueryPageItems, Query, Tuid, CTuid } from 'tonva-react-uq';

export class PageUsers extends QueryPageItems {
    protected setPageStart(item:any) {
        this.pageStart = item === undefined? 0 : item.id;
    }
}

export class VFullFunction extends VPage<COpBinding> {
    private uq: Uq;
    @observable private users: any[] = [];
    private entityOpUserFully:CMap;
    private pageUsers: PageUsers;
    private tuidUser: CTuid<Tuid>;
    async showEntry(uq: Uq) {
        this.uq = uq;
        this.entityOpUserFully = this.controller.cUq.cFromName('map', 'entityOpUserFully') as CMap;
        this.tuidUser = this.controller.cUq.cFromName('tuid', 'user') as CTuid<Tuid>;
        await this.entityOpUserFully.entity.loadSchema();
        let all = await this.entityOpUserFully.entity.queries.all.query({_uq: this.uq.id});
        let right = <button className="btn btn-sm btn-success" onClick={this.addClick}><FA name="plus" /></button>;
        this.users.push(...all.ret);
        this.openPageElement(<Page header={'全功能用户'} right={right}>
            <List items={this.users} item={{render:this.renderUser, onClick: this.onStopFully}} />
        </Page>);
        return;
    }

    private onStopFully = async (item:any) => {
        this.openPageElement(<Page header={'停止全功能'}>
            <div className="p-3">
                <div><b className="text-danger h4">{item.user.content()}</b> 停止全功能用户。<br/>请确认。</div>
                <div className="p-3">
                    <button className="btn btn-success" onClick={()=>this.onSumitStopFully(item)}>停止全功能</button>
                    <button className="ml-3 btn btn-outline-danger" onClick={this.onCancelStop}>不停</button>
                </div>
            </div>
        </Page>);
    }

    private onSumitStopFully = async (item:any) => {
        let data = {_uq: this.uq.id, arr1:[{_user: item.user.id}]};
        await this.entityOpUserFully.entity.actions.del.submit(data);
        let index = this.users.findIndex(v => v === item);
        if (index >= 0) this.users.splice(index, 1);
        this.closePage();
    }

    private onCancelStop = () => this.closePage();

    private addClick = async () => {
        let user = await this.controller.callSearchUser(this.uq);
        this.onUserSelected(user);
        /*
        let searchUser = this.controller.cUq.cFromName('query', 'SearchUser') as CQuery;
        this.pageUsers = new PageUsers(searchUser.entity);
        this.openPage(this.usersView);
        */
    }

    private renderUser = (item:any, index:number) => {
        return <div className="px-3 py-2">{item.user.content()}</div>;
    }

    private onSearch = async (key:string) => {
        await this.pageUsers.first({key: key});
    }
    private onSetFully = async (item:any) => {
        await this.entityOpUserFully.entity.actions.add.submit({_uq: this.uq.id, arr1:[{_user: item.id}]});
        this.tuidUser.entity.useId(item.id);
        let row = {
            uq: this.uq.id,
            user: this.tuidUser.entity.boxId(item.id),
        }
        this.users.push(row);
        this.closePage(2);
    }
    private onCancelFully = () => {this.backPage()}
    private onUserSelected = (item:any) => {
        this.openPageElement(<Page header="确认">
            <div className="p-3">
                <div><b className="text-danger h4">{item.name}</b> 将设置为全功能用户。只有系统管理员或者测试人员才需要全功能，可以操作所有数据。<br/>请确认。</div>
                <div className="p-3">
                    <button className="btn btn-success" onClick={()=>this.onSetFully(item)}>设置为全功能用户</button>
                    <button className="ml-3 btn btn-outline-danger" onClick={this.onCancelFully}>取消</button>
                </div>
            </div>
        </Page>);
    }
    private renderSelectUser = (item:any, index:number) => {
        return <div className="px-3 py-2">{JSON.stringify(item)}</div>;
    }
    private usersView = () => {
        let search = <SearchBox className="w-100" onSearch={this.onSearch} placeholder="选择用户" />;
        return <Page header={search}>            
            <List
                before="搜索用户名"
                items={this.pageUsers} 
                item={{render: this.renderSelectUser, onClick:this.onUserSelected}} />
        </Page>;
    };
}

