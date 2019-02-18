import * as React from 'react';
import { observer } from 'mobx-react';
import { List, FA } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { TuidMain, Query, Entity } from '../../entities';
import { VForm } from '../form';
import { VEntity } from '../CVEntity';
import { QueryUI, CQuery } from './cQuery';
import { DefaultRow } from './defaultRow';

export class VQueryMain extends VEntity<Query, QueryUI, CQuery> {
    protected vForm: VForm;
    private row: React.StatelessComponent;

    async open(param?:any):Promise<void> {
        this.vForm = this.createForm(this.onSubmit, param);
        let {row, queryRow} = this.ui;
        this.row = queryRow || row || DefaultRow;
        this.openPage(this.view);
    }

    onSubmit = async () => {
        let params = this.vForm.getValues();
        if (this.entity.isPaged === true) {
            await this.entity.resetPage(30, params);
            await this.entity.loadPage();
            this.replacePage(this.pageResult);
        }
        else {
            let data = await this.entity.query(params);
            this.replacePage(this.queryResult, data);
        }
    }

    again = () => {
        this.vForm.reset();
        this.replacePage(this.view);
    }

    renderExtra() {
        return;
    }

    renderRow = (item:any, index:number) => <this.row {...item} />;

    protected view = () => <Page header={this.label}>
        {this.vForm.render('mx-3 my-2')}
        {this.renderExtra()}
    </Page>;

    protected pageResult = () => {
        let {name, list} = this.entity;
        let rightClose = <button
            className="btn btn-outline-success"
            onClick={this.again}>
            <FA name="search" /> 再查询
        </button>;
        return <Page header={this.label} right={rightClose}>
            <List items={list} item={{render: this.renderRow}} />
        </Page>;
    }

    protected queryResult = observer((result:any) => {
        let rightClose = <button
            className="btn btn-outline-success"
            onClick={this.again}>
            <FA name="search" /> 再查询
        </button>;
        return <Page header={this.label} right={rightClose}>
            <pre>{JSON.stringify(result, undefined, '\t')}</pre>
        </Page>;
    })
}
