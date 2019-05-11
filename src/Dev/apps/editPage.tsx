import * as React from 'react';
import _ from 'lodash';
import { AppController } from '.';
import { VPage, nav, Page, ItemSchema, UiSchema, StringSchema, BoolSchema, UiTextItem, UiTextAreaItem, UiCheckItem, Form, ButtonSchema, Context, ImageSchema, UiImageItem, IdSchema, UiIdItem } from 'tonva-tools';
import { SubmitResult, DropdownActions, TonvaForm, FormRow } from 'tonva-react-form';
import { createIdPick, IdPickProps } from 'createIdPick';
import { DevModel } from 'model';
import { store } from 'store';
import { IdPickPage, ServerSpan } from '../../tools';
import { observer } from 'mobx-react';

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

const schema:ItemSchema[] = [
    {name: 'name', type: 'string', maxLength: 100, required: true} as StringSchema,
    {name: 'caption', type: 'string', maxLength: 100} as StringSchema,
    {name: 'discription', type: 'string', maxLength: 250} as StringSchema,
    {name: 'url', type: 'string', maxLength: 200} as StringSchema,
    {name: 'public', type: 'boolean'} as BoolSchema,
    {name: 'server', type: 'id'} as IdSchema,
    {name: 'icon', type: 'image'} as ImageSchema,
    {name: 'submit', type: 'submit'} as ButtonSchema,
];

export abstract class EditBasePage extends VPage<AppController> {
    private candidateItems = async (params:any, key:string):Promise<any[]> => {
        await store.dev.searchServer.first(key);
        return store.dev.searchServer.items;
    }

    private moreCandidates = async ():Promise<void> => {
        await store.dev.searchServer.more();
    }

    private renderRow = (item:DevModel.Server, index:number): JSX.Element => {
        return <div className="px-3 py-2"><ServerCaption {...item} /></div>;
    }

    private pickServerId = (context:Context, name:string, value:number): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            nav.push(<IdPickPage 
                caption="选择服务器" 
                searchPlaceHolder="搜索服务器"
                candidateItems={this.candidateItems}
                moreCandidates={this.moreCandidates}
                row={this.renderRow}
                idFromItem={(item:DevModel.Server) => item.id}
                resolve={resolve} params={undefined} />, 
                ()=> {
                    reject();
                });
        });
    }

    private renderServerInput = (itemId:number): JSX.Element => {
        return <ServerSpan id={itemId} />;
    };

    private uiSchema:UiSchema = {
        items: {
            name: {widget: 'text', label: '名称'} as UiTextItem,
            caption: {widget: 'text', label: '标题'} as UiTextItem,
            discription: {widget: 'textarea', label: '描述', rows: 5} as UiTextAreaItem,
            url: {widget: 'text', label: 'URL', placeholder: 'http(s)://APP地址'} as UiTextItem,
            'public': {widget: 'checkbox', label: '公开', } as UiCheckItem,
            server: {widget: 'id', label: '服务器', pickId: this.pickServerId, Templet: this.renderServerInput} as UiIdItem,
            icon: {widget: 'image', label: '标志图'} as UiImageItem,
            submit: {widget: 'button', label: '提交', className: 'btn btn-primary'}
        }
    }
    
    async open() {
        this.openPage(this.page);
    }
    private onButtonClick = async (name:string, context: Context) => {
        let {data} = context;
        let app:DevModel.App = _.clone(this.controller.app) || {} as any;
        _.merge(app, data);
        await this.controller.saveApp(app);
        nav.pop();
    }
    protected page: ()=>JSX.Element;
    protected form = observer(() => {
        return <Form fieldLabelSize={2}
            className="m-3" 
            schema={schema} 
            uiSchema={this.uiSchema}
            formData={this.initValues}
            onButtonClick={this.onButtonClick} />
    });
    abstract get initValues():any;
}

export class EditPage extends EditBasePage {
    get initValues():any {return this.controller.app}
    protected page = () => {
        let {app} = this.controller;
        let {name} = app;
        return <Page header={'修改APP - ' + name} back="close">
            <this.form />
        </Page>;
    }
}

export class NewPage extends EditBasePage {
    get initValues():any {return {}}
    protected page = () => {
        return <Page header={'新建APP'} back="close">
            <this.form />
        </Page>;
    }
}
