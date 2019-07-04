import * as React from 'react';
import { Page, FA, SearchBox, List } from '../../../ui';
import { PageItems } from '../../../pageItems';
import { Query } from '../../uqs';
import { VEntity } from '../CVEntity';
import { QueryUI, CQuerySelect } from './cQuery';
import { DefaultRow } from './defaultRow';

export class VQuerySelect extends VEntity<Query, QueryUI, CQuerySelect> {
    private row: React.StatelessComponent;

    PageItems:QueryPageItems;
    ownerId: number;

    async open(param?:any) {
        let {row, selectRow} = this.ui;
        this.row = selectRow || row || DefaultRow;
        //this.entity = this.controller.entity;
        this.PageItems = new QueryPageItems(this.entity);
        await this.onSearch(param);
        this.openPage(this.view);
    }
    onSearch = async (key:string) => {
        await this.PageItems.first(key);
    }

    renderRow = (item:any, index:number) => <this.row {...item} />;

    private callOnSelected(item:any) {
       this.closePage();
       this.returnCall(item);
    }
    clickRow = (item:any) => {
        this.callOnSelected(item);
    }

    view = () => {
        let header = <SearchBox className="mx-1 w-100"
            initKey={''}
            onSearch={this.onSearch} placeholder={'搜索'+this.label} />;
        return <Page header={header}>
            <List
                items={this.PageItems.items}
                item={{render: this.renderRow, onClick: this.clickRow}}
                before={'搜索'+this.label+'资料'} />
        </Page>;
    };
}

export class QueryPageItems extends PageItems<any> {
    private query: Query;
    constructor(query: Query) {
        super();
        this.query = query;
    }
    protected async load():Promise<any[]> {
        await  this.query.loadSchema();
        let ret:any[];
        if (this.query.isPaged === true)
            ret = await this.query.page(this.param, this.pageStart, this.pageSize);
        else {
            let data = await this.query.query(this.param);
            //let data = await this.query.unpackReturns(res);
            ret = data[this.query.returns[0].name];
        }
        return ret;
    }
    protected setPageStart(item:any) {
        if (item === undefined) this.pageStart = 0;
    }
}
