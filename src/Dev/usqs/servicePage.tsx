import * as React from 'react';
import { Page, VPage, nav } from "tonva-tools";
import { UQController } from '.';
import { DevModel } from 'model';
import { Prop, PropGrid } from 'tonva-react-form';
import { StringValueEdit, ServerSpan, TextValueEdit } from 'tools';

export class ServicePage extends VPage<UQController> {
    private service: DevModel.Service;
    async showEntry(service: DevModel.Service) {
        this.service = service;
        this.openPage(this.page);
    }
    private async changeProp(prop:string, value:any):Promise<any> {
        return await this.controller.changeServiceProp(this.service, 'url', value);
    }
    private onUrlChanged = async (value:any, orgValue:any):Promise<string|void> => {
        let ret = await this.changeProp('url', value);
        if (ret === 0) {
            return 'URL已经被使用了';
        }
    }
    private onDbChanged = async (value:any, orgValue:any):Promise<string|void> => {
        let ret = await this.changeProp('db', value);
        if (ret === 0) {
            return 'Db已经被使用了';
        }
    }
    private onDbTypeChanged = async (value:string, orgValue:any):Promise<string|void> => {
        if (value === undefined || value === null) return;
        if (value.toLowerCase().trim() !== 'mysql') return '目前只支持mysql';
        let ret = await this.changeProp('db_type', value);
    }
    private onConnectionChanged = async (value:string, orgValue:any):Promise<string|void> => {        
        await this.changeProp('connection', value);
    }
    private onDeleteClick = async () => {
        if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。")!==true) return;
        await this.controller.delService(this.service);
        nav.pop();
    }
    private page = () => {
        let {uq} = this.controller;
        let {type, name, discription, server, url, db, db_type, connection} = this.service;
        let rows:Prop[] = [
            '',
            /*
            {
                type: 'component',
                component: <div className="px-3 py-2">
                    <b>{name}</b><br/><Muted>{discription}</Muted>
                </div>,
            },
            '',*/
            {
                type: 'string',
                name: 'url',
                label: 'URL',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="修改URL"
                    value={url}
                    onChanged={this.onUrlChanged} />)
            },
            {
                type: 'component',
                label: '服务器',
                component: <ServerSpan id={server} />
            },
            {
                type: 'string',
                name: 'db_type',
                label: '数据库类型',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="数据库类型"
                    value={db_type}
                    onChanged={this.onDbTypeChanged} />)
            },
            {
                type: 'string',
                name: 'db',
                label: '数据库名',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="数据库名字"
                    value={db}
                    onChanged={this.onDbChanged} />)
            },
            {
                type: 'string',
                name: 'connection',
                label: '连接字符串',
                onClick: ()=>nav.push(<TextValueEdit
                    title="连接字符串"
                    value={connection}
                    onChanged={this.onConnectionChanged} />)
            },
        ];
        let right = <button onClick={this.onDeleteClick} className="btn btn-success">删除</button>;
        return <Page header={'UQ - ' + uq.name} right={right}>
            <PropGrid rows={rows} values={this.service} />
        </Page>
    }
}

