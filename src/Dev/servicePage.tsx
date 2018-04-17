import * as React from 'react';
import {Button} from 'reactstrap';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Step, Field, Prop, PropGrid, Media, 
    TonvaForm, FormRow, SubmitResult, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, ServerSpan, ApiSpan, AppSpan} from '../tools';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {StringValueEdit} from '../tools';
import {ObjViewProps} from './ObjView';
import {createIdPick, IdPickProps} from '../createIdPick';
import {devApi} from '../api';

const ServerCaption = (item:DevModel.Server) => {
    let {discription, cloud, ip} = item;
    return <>{item.discription} {item.cloud} {item.ip}</>;
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
        return <div><ServerCaption {...item} /></div>;
    },
};

const urlField:Field = {name: 'url', type: 'string', required:true, maxLength:200};
const serverField:Field = {name: 'server', type: 'id'};

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

interface Props {
    type: 1|2|3,
    id: number,     // apiId or appId
}

@observer
export class NewService extends React.Component<Props> {
    private formRows:FormRow[] = [
        urlRow,
        serverRow,
    ];
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    private async onSubmit(values:any):Promise<SubmitResult | undefined> {
        values.type = this.props.type;
        values.bindId = this.props.id;
        let dev = store.dev;
        await dev.services.saveCur(values);
        nav.pop();
        return;
    }
    render() {
        return <Page header="新建Service">
            <TonvaForm className="m-3" formRows={this.formRows} onSubmit={this.onSubmit} />
        </Page>
    }
}

@observer
export class ServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.onUrlChanged = this.onUrlChanged.bind(this);
    }
    private async onUrlChanged(value:any, orgValue:any):Promise<void> {
        await store.dev.services.changeProp('url', value);
    }
    private async onDeleteClick() {
        if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。")!==true) return;
        await store.dev.services.del();
        nav.pop();
    }
    render() {
        let cur = store.dev.services.cur;
        let {type, name, discription, server, url} = cur;
        let rows:Prop[] = [
            '',
            {
                type: 'component',
                component: <div className="px-3 py-2">
                    <b>{name}</b><br/><Muted>{discription}</Muted>
                </div>,
            },
            '',
            {
                type: 'string',
                name: 'url',
                label: 'URL',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="修改名称"
                    value={url}
                    onChanged={this.onUrlChanged} 
                    info="好的名字便于理解" />)
            },
            {
                type: 'component',
                label: '服务器',
                component: <ServerSpan id={server} />
            },
        ];
        let typeName;
        switch (type) {
            default: typeName = ''; break;
            case 2: typeName = 'APP'; break;
            case 3: typeName = 'API'; break;
        }
        let right = <Button onClick={this.onDeleteClick} color="success">删除</Button>;
        return <Page header={typeName + ' Service'} right={right}>
            <PropGrid rows={rows} values={cur} />
        </Page>
    }
}

