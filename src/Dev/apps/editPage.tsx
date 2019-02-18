import * as React from 'react';
import { AppController } from '.';
import { VPage, nav, Page } from 'tonva-tools';
import { SubmitResult, DropdownActions, TonvaForm, FormRow } from 'tonva-react-form';
import { createIdPick, IdPickProps } from 'createIdPick';
import { DevModel } from 'model';
import { store } from 'store';

const ServerCaption = (item:DevModel.Server) => {
    let {discription, cloud, ip} = item;
    return <>{discription} {cloud} {ip}</>;
}
const idPickServerProps: IdPickProps = {
    caption: '选择服务器',
    searchPlaceHolder: '搜索服务器',
    candidateItems: async (params:any, key:string) => {
        await store.dev.searchServer.first(key);
        return store.dev.searchServer.items;
    },
    moreCandidates: async () => {
        await store.dev.searchServer.more();
    },
    row: (item:DevModel.Server, index:number) => {
        return <div className="px-3 py-2"><ServerCaption {...item} /></div>;
    },
};

const formRows:FormRow[] = [
    {
        label: '名称', 
        field: {name: 'name', type: 'string', maxLength: 100, required: true},
    },
    {
        label: '描述',
        field: {name: 'discription', type: 'string', maxLength: 250},
        face: {type: 'textarea'}
    },
    {
        label: '图标',
        field: {name: 'icon', type: 'string', maxLength: 250},
    },
    {
        label: 'URL',
        field: {name: 'url', type: 'string', maxLength: 200},
    },
    {
        label: '服务器',
        field: {name: 'server', type: 'id'},
        face: {
            type: 'pick-id', 
            initCaption: '请选择服务器', 
            pick: createIdPick(idPickServerProps),
            fromPicked: (item:DevModel.Server)=>{
                return {
                    id: item.id, 
                    caption: <ServerCaption {...item} />,
                };
            },
            itemFromId: (id:number)=>store.cacheServers.get(id),
        },
    },
    {
        label: '公开',
        field: {name: 'public', type: 'bool', defaultValue: 1}
    },
];

export abstract class EditBasePage extends VPage<AppController> {
    async open() {
        this.openPage(this.page);
    }
    protected onSubmit = async (values:any):Promise<SubmitResult> => {
        await this.controller.saveApp(values);
        nav.pop();
        return;
    }
    protected page: ()=>JSX.Element;
    protected form(initValues:any) {
        return <TonvaForm
            className="m-3"
            formRows={formRows} 
            onSubmit={this.onSubmit} initValues={initValues} />
    }
}

export class EditPage extends EditBasePage {
    protected page = () => {
        let {app} = this.controller;
        let {name} = app;
        return <Page header={'修改APP - ' + name} back="close">
            {this.form(app)}
        </Page>;
    }
}

export class NewPage extends EditBasePage {
    protected page = () => {
        return <Page header={'新建APP'} back="close">
            {this.form({})}
        </Page>;
    }
}
