import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Step, Field, Prop, PropGrid, Media, 
    TonvaForm, FormRow, SubmitResult, Muted, TextAreaFace, StringFace} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {ServerSpan, StringValueEdit, TextValueEdit} from '../tools';
import {DevModel} from '../model';
import {store} from '../store';
import {createIdPick, IdPickProps} from '../createIdPick';

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

interface Props {
    type: 1|2|3,
    id: number,     // apiId or appId
}

@observer
export class NewService extends React.Component<Props> {
    private tonvaForm:TonvaForm;
    private formRows:FormRow[] = [
        urlRow,
        serverRow,
        dbTypeRow,
        dbRow,
        connectionRow
    ];
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    private async onSubmit(values:any):Promise<SubmitResult | undefined> {
        values.type = this.props.type;
        values.bindId = this.props.id;
        let dev = store.dev;
        dev.services.cur = undefined;
        let ret = await dev.services.saveCur(values);
        if (ret === false) {
            if (this.tonvaForm !== undefined) {
                this.tonvaForm.formView.setError('url', '已经有Service使用这个url');
            }
            return;
        }
        nav.pop();
        return;
    }
    render() {
        return <Page header="新建Service">
            <TonvaForm ref={t=>this.tonvaForm=t} className="m-3" formRows={this.formRows} onSubmit={this.onSubmit} />
        </Page>
    }
}

@observer
export class ServiceInfo extends React.Component {
    private onUrlChanged = async (value:any, orgValue:any):Promise<string|void> => {
        let ret = await store.dev.services.changeProp('url', value);
        if (ret === 0) {
            return 'URL已经被使用了';
        }
    }
    private onDbChanged = async (value:any, orgValue:any):Promise<string|void> => {
        let ret = await store.dev.services.changeProp('db', value);
        if (ret === 0) {
            return 'Db已经被使用了';
        }
    }
    private onDbTypeChanged = async (value:string, orgValue:any):Promise<string|void> => {
        if (value === undefined || value === null) return;
        if (value.toLowerCase().trim() !== 'mysql') return '目前只支持mysql';
        let ret = await store.dev.services.changeProp('db_type', value);
    }
    private onConnectionChanged = async (value:string, orgValue:any):Promise<string|void> => {        
        await store.dev.services.changeProp('connection', value);
    }
    private onDeleteClick = async () => {
        if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。")!==true) return;
        await store.dev.services.del();
        nav.pop();
    }
    render() {
        let uq = store.dev.uqs.cur;
        let cur = store.dev.services.cur;
        let {type, name, discription, server, url, db, db_type, connection} = cur;
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
            <PropGrid rows={rows} values={cur} />
        </Page>
    }
}

