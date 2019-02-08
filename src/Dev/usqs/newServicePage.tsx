import * as React from 'react';
import { DevModel } from "model";
import { IdPickProps, createIdPick } from 'createIdPick';
import { store } from 'store';
import { Field, FormRow, StringFace, TextAreaFace, TonvaForm, SubmitResult } from 'tonva-react-form';
import { UQController } from '.';
import { VPage, nav, Page } from 'tonva-tools';

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

const urlField:Field = {name: 'url', type: 'string', required:true, maxLength:200};
const serverField:Field = {name: 'server', type: 'id'};
const dbTypeField:Field = {name: 'db_type', type: 'string', maxLength:20, defaultValue:'mysql'};
const dbField:Field = {name: 'db', type: 'string', maxLength:50, required: true};
const connectionField:Field = {name:'connection', type:'string', maxLength:250};

const urlRow = {
    label: 'URL',
    field: urlField,
};

const serverRow = {
    label: '服务器', 
    field: serverField,
    face: {
        type: 'pick-id', 
        initCaption: '请选择服务器', 
        pick: createIdPick(idPickServerProps), //this.idPick,
        fromPicked: (item:DevModel.Server)=>{
            return {
                id: item.id, 
                caption: <ServerCaption {...item} />,
            };
        },
        itemFromId: (id:number)=>store.cacheServers.get(id),
    },
};

const dbTypeRow:FormRow = {
    label: '数据库类型',
    field: dbTypeField,
    face: {
        type: 'string',
        readonly: true,
    } as StringFace
};

const dbRow = {
    label: '数据库名字',
    field: dbField,
};

const connectionRow = {
    label: '连接字符串',
    field: connectionField,
    face: {
        type: 'textarea',
        maxLength: 250,
        rows: 8,
    } as TextAreaFace,
};

export class NewServicePage extends VPage<UQController> {
    private tonvaForm:TonvaForm;
    private formRows:FormRow[] = [
        urlRow,
        serverRow,
        dbTypeRow,
        dbRow,
        connectionRow
    ];
    async showEntry() {
        this.openPage(this.page);
    }
    private async onSubmit(values:any):Promise<SubmitResult | undefined> {
        values.type = 2; // uq type, to be removed
        values.bindId = this.controller.uq.id;
        let ret = await this.controller.saveService(values);
        if (ret === 0) {
            if (this.tonvaForm !== undefined) {
                this.tonvaForm.formView.setError('url', '已经有Service使用这个url');
            }
            return;
        }
        nav.pop();
        return;
    }
    private page = () => {
        return <Page header="新建Service">
            <TonvaForm ref={t=>this.tonvaForm=t} className="m-3" formRows={this.formRows} onSubmit={this.onSubmit} />
        </Page>
    }
}
