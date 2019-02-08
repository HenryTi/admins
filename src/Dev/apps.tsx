import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';
import {nav, Page} from 'tonva-tools';
import {Media, Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge, Muted} from 'tonva-react-form';
import {UnitSpan, IdDates, ServerSpan, UnitName} from '../tools';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjViewProps';
import {NewService, ServiceInfo} from './servicePage';
import { IdPickProps, createIdPick } from 'createIdPick';

@observer
class Info extends React.Component<DevModel.App> {
    @observable private uqs:ListProp = {
        label: '关联UQ', 
        type: 'list', 
        list: undefined, 
        row: UqRow
    };
    componentWillMount() {
        //store.dev.services.cur = undefined;
    }
    async componentDidMount() {
        await store.dev.apps.loadCurUqs();
        //await store.dev.services.loadAppServices(this.props.id);
        this.uqs.list = store.dev.apps.uqs;
    }
    render() {
        let {unit, name, discription, icon, server, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={icon || appIcon} main={name} discription={disp} />
            },
            '',
            {
                type: 'component', 
                label: '开发号', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> 
            },
            /*
            {
                type: 'component', 
                label: 'Service',
                vAlign: 'stretch',
                component: <ServiceRow />,
            },*/
            {
                label: 'URL',
                name: 'url',
                type: 'string',                
            },
            {
                type: 'component',
                label: '服务器',
                component: <ServerSpan id={server} />
            },
            '',
            this.uqs,
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>
    }
}

/*
@observer
export class ServiceRow extends React.Component {
    private newClick() {
        let dev = store.dev;
        nav.push(<NewService type={2} id={dev.apps.cur.id} />);
    }
    private infoClick() {
        nav.push(<ServiceInfo />);
    }
    private setProp(prop:string, value:any) {
        let service = store.dev.services.cur;
        switch (prop) {
            case 'url': service.url = value; break;
            case 'server': service.server = value; break;
        }
    }
    render() {
        let service = store.dev.services.cur;
        if (service === null) return '...';
        let content, click;
        if (service === undefined) {
            click = this.newClick;
            content = <Muted>无，点击设置</Muted>;
        }
        else {
            let {url, server} = service;
            click = this.infoClick;
            content = <div>
                <div>{url}</div>
                <ServerSpan id={server} />
            </div>;
        }
        return <div className="d-flex w-100 align-items-center cursor-pointer" style={{flex:1}} onClick={click}>
            {content}
        </div>;

    }
}
*/
class UqRow extends React.Component<any> {
    render() {
        let {name, discription, unit} = this.props;
        let disp: any;
        if (discription) disp = <div className="small text-muted">{discription}</div>;
        return <div className='form-control-plaintext'>
            <div><UnitName id={unit} /> / {name}</div>
            {disp}
        </div>
    }
}

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

const appsProps:ObjViewProps<DevModel.App> = {
    title: 'APP',
    formRows: [
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
    ],
    row: (item:DevModel.App):JSX.Element => {
        return <Row icon={item.icon || appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: ()=>store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
    extraMenuActions: [
        {icon: 'cogs', caption:'设置关联UQ', action: ()=>nav.push(<AppUqs />)}
    ],
};

@observer
class AppUqs extends React.Component {
    @observable anySelected: boolean = false;
    private list:List;
    private onSelect = (item: DevModel.UQ, isSelected:boolean, anySelected:boolean) => {
        this.anySelected = anySelected;
    }
    private row = (item: DevModel.UQ) => {
        let {name, unit, discription} = item;
        return <LMR className="p-2" right={<small className="text-muted">{discription}</small>}>
            <UnitSpan id={unit} />/{name}
        </LMR>;
    }
    private removeBind = () => {
        if (this.list === null) return;
        let {selectedItems} = this.list;
        if (selectedItems === undefined) return;
        if (selectedItems.length === 0) return;
        store.dev.apps.appBindUq(
            selectedItems.map(v => {
                return {id:v.id, access:['*']}
            }), 
            false);
    }
    render() {
        let btnProps = this.anySelected?
            {color:'danger', onClick:this.removeBind, icon:'trash', text:'取消'}:
            {color:'primary', onClick:()=>nav.push(<Uqs/>), icon:'plus', text:'新增'};
        let btn = (p)=><button 
            className={classNames('btn', 'btn-outline-'+p.color, 'btn-sm')} 
            onClick={p.onClick}>
            <i className={"fa fa-" + p.icon} /> {p.text}关联
        </button>;
        let listHeader = <div className="va-row py-1 justify-content-center">{btn(btnProps)}</div>;
        return <Page header="关联UQ">
            <List ref={list=>this.list=list} header={listHeader}
                items={store.dev.apps.uqs}
                item={{render: this.row, onSelect: this.onSelect}} />
        </Page>;
    }
}

@observer
class Uqs extends React.Component {
    onSearch = async (key:string) => {
        await store.dev.apps.searchUq(key);
    }
    onBind(uq: DevModel.UQ, bind: boolean) {
        store.dev.apps.appBindUq([{id:uq.id, access:['*']}], bind);
    }
    row = (uq: DevModel.UQ) => {
        let isConnected = store.dev.apps.uqs.find(a => a.id === uq.id) !== undefined;
        let cn = ['btn', 'btn-sm'];
        let btnContent:any, onClick:any;
        if (isConnected) {
            cn.push('btn-success');
            onClick = ()=>this.onBind(uq, false);
            btnContent = "已关联";
        }
        else {
            cn.push('btn-primary');
            onClick = ()=>this.onBind(uq, true);
            btnContent = <span><i className="fa fa-check"/> 关联</span>;
        }
        return <div className="d-flex justify-content-start py-1 px-3">
            <div className="align-self-center">{uq.name + ' - ' + uq.discription}</div>
            <footer className="ml-auto"><button className={classNames(cn)} onClick={onClick}>{btnContent}</button></footer>
        </div>
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索UQ名字" 
            maxLength={100} />;
        return <Page back="close" header={header}>
            <List items={store.dev.apps.searchedUqs} item={{render: this.row}} loading={null} />
        </Page>;
    }
}

export default appsProps;
