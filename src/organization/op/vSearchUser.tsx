import * as React from 'react';
import { VPage, Page, PageItems } from 'tonva';
import { SearchBox, List } from 'tonva';
import { centerApi } from 'tonva';
import { COpBinding } from './cOpBinding';

export class VSearchUser extends VPage<COpBinding> {
    private unit:number;
    private pageUsers = new PageUsers();

    private onUserClick = (item:any) => {
        this.closePage();
        this.returnCall(item);
    }
    private onSearch = async (key:string) => {
        await this.pageUsers.first({key: key, unit:this.unit, role:undefined});
    }
    private renderSelectUser = (item:any, index:number) => {
        return <div className="px-3 py-2">{JSON.stringify(item)}</div>;
    }
    async open(unit: number) {
        this.unit = unit;
        let search = <SearchBox className="w-100" onSearch={this.onSearch} placeholder="选择用户" />;
        this.openPageElement(<Page header={search}>
            <List
                before="搜索用户名"
                items={this.pageUsers}
                item={{render: this.renderSelectUser, onClick:this.onUserClick}} />
        </Page>);
    }
}

class PageUsers extends PageItems<any> {
    protected async load(param:{key:string, unit:number, role:number}, pageStart: any, pageSize: number): Promise<any[]> {
        let {unit, role, key} = param;
        let ret = await centerApi.get('unit/members', {key: key, unit:unit, role:role, pageStart:pageStart, pageSize:pageSize});
        return ret;
    }
    protected setPageStart(item: any): any {
        if (item === undefined)
            this.pageStart = 0;
        else
            this.pageStart = item.id;
    }
}