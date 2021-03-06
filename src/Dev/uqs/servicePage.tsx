import * as React from 'react';
import { observable } from 'mobx';
import { Page, VPage, nav } from 'tonva';
import { UQController } from './uqController';
import { DevModel } from 'model';
import { Prop, PropGrid } from 'tonva';
import { StringValueEdit, ServerSpan, TextValueEdit } from 'tools';

export class ServicePage extends VPage<UQController> {
    @observable private service: DevModel.Service;
    async open(service: DevModel.Service) {
        this.service = service;
        this.openPage(this.page);
    }
    private async changeProp(prop:string, value:any):Promise<any> {
        return await this.controller.changeServiceProp(this.service, prop, value);
    }
    private onUrlChanged = async (value:any, orgValue:any):Promise<string|void> => {
        /*
        if ((value as string).indexOf('/uq/')<0) {
            return 'URL必须包含/uq/';
        }
        */
        let ret = await this.changeProp('url', value);
        if (ret === 0) {
            //return 'URL已经被使用了';
            return;
        }
        this.service.url = value;
    }
    private onUrlTestChanged = async (value:any, orgValue:any):Promise<string|void> => {
        /*
        if ((value as string).indexOf('/uq/')<0) {
            return 'URL必须包含/uq/';
        }
        */
        let ret = await this.changeProp('urlTest', value);
        if (ret === 0) {
            //return 'URL已经被使用了';
            return;
        }
        this.service.urlTest = value;
    }
    private onDbChanged = async (value:any, orgValue:any):Promise<string|void> => {
        let ret = await this.changeProp('db', value);
        if (ret === 0) {
            return 'Db已经被使用了';
        }
        this.service.db = value;
    }
    /*
    private onDbTypeChanged = async (value:string, orgValue:any):Promise<string|void> => {
        if (value === undefined || value === null) return;
        if (value.toLowerCase().trim() !== 'mysql') return '目前只支持mysql';
        let ret = await this.changeProp('db_type', value);
        this.service.db_type = value;
    }
    private onConnectionChanged = async (value:string, orgValue:any):Promise<string|void> => {        
        await this.changeProp('connection', value);
        this.service.connection = value;
    }
    */
    private onDeleteClick = async () => {
        if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。")!==true) return;
        await this.controller.delService(this.service);
        nav.pop();
    }
    private page = () => {
        let {uq} = this.controller;
        let rows:Prop[] = [
            '',
            {
                type: 'string',
                name: 'url',
                label: 'URL',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="修改URL"
                    value={this.service.url}
                    onChanged={this.onUrlChanged} />)
            },
            {
                type: 'string',
                name: 'urlTest',
                label: 'URL-Test',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="修改URL-Test"
                    value={this.service.urlTest}
                    onChanged={this.onUrlTestChanged} />)
            },
            {
                type: 'component',
                label: '服务器',
                component: <ServerSpan id={this.service.server} />
            },
            /*
            {
                type: 'string',
                name: 'db_type',
                label: '数据库类型',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="数据库类型"
                    value={this.service.db_type}
                    onChanged={this.onDbTypeChanged} />)
            },
            */
            {
                type: 'string',
                name: 'db',
                label: '数据库名',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="数据库名字"
                    value={this.service.db}
                    onChanged={this.onDbChanged} />)
            },
            /*
            {
                type: 'string',
                name: 'connection',
                label: '连接字符串',
                onClick: ()=>nav.push(<TextValueEdit
                    title="连接字符串"
                    value={this.service.connection}
                    onChanged={this.onConnectionChanged} />)
            },
            */
        ];
        let right = <button onClick={this.onDeleteClick} className="btn btn-success">删除</button>;
        return <Page header={'UQ - ' + uq.name} right={right}>
            <PropGrid rows={rows} values={this.service} />
        </Page>
    }
}

