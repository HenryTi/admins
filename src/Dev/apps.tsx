import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';
import {nav, Page} from 'tonva-tools';
import {Media, Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge, Muted} from 'tonva-react-form';
import {UnitSpan, IdDates, ServerSpan} from '../tools';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjViewProps';
import {NewService, ServiceInfo} from './servicePage';

@observer
class Info extends React.Component<DevModel.App> {
    @observable private usqs:ListProp = {label: '关联UQ', type: 'list', list: undefined, row: UsqRow};
    componentWillMount() {
        store.dev.services.cur = undefined;
    }
    async componentDidMount() {
        await store.dev.apps.loadCurUqs();
        await store.dev.services.loadAppServices(this.props.id);
        this.usqs.list = store.dev.apps.uqs;
    }
    render() {
        let {unit, name, discription, icon, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={icon || appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '开发号', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            this.usqs,
            '',
            {
                type: 'component', 
                label: 'Service',
                vAlign: 'stretch',
                component: <ServiceRow />,
            },
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>
    }
}

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

class UsqRow extends React.Component<any> {
    render() {
        let {name, discription} = this.props;
        let disp;
        if (discription) disp = <div className="small text-muted">{discription}</div>;
        return <div className='form-control-plaintext'>
            <div>{name}</div>
            {disp}
        </div>
    }
}

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
    private _list: List;

    private ref = (list:List) => {
        this._list = list;
    }
    /*
    async removeBind() {
        let apiIds:number[] = this._list.selectedItems.map(v => v.id);
        await store.dev.apps.appBindApi(apiIds, false);
    }*/
    private onSelect = (item: DevModel.App, isSelected:boolean, anySelected:boolean) => {
        this.anySelected = anySelected;
    }
    private row = (item: DevModel.App) => {
        return <LMR className="p-2" right={<small className="text-muted">{item.discription}</small>}>
            {item.name}
        </LMR>;
        /*
        return <div className="p-2">
            <div>{item.name}</div>
            <small className="ml-auto text-muted">{item.discription}</small>
        </div>;*/
    }
    render() {
        let btnProps = this.anySelected?
            {color:'danger', /*onClick:this.removeBind, */icon:'trash', text:'取消'}:
            {color:'primary', onClick:()=>nav.push(<Usqs/>), icon:'plus', text:'新增'};
        let btn = (p)=><button className={classNames('btn', 'btn-outline-'+p.color, 'btn-sm')} onClick={p.onClick}>
            <i className={"fa fa-" + p.icon} /> {p.text}关联
        </button>;
        let listHeader = <div className="va-row py-1 justify-content-center">{btn(btnProps)}</div>;
        return <Page header="关联UQ">
            <List ref={this.ref}
                header={listHeader}
                items={store.dev.apps.uqs}
                item={{render: this.row, onSelect: this.onSelect}} />
        </Page>;
    }
}

@observer
class Usqs extends React.Component {
    onSearch = async (key:string) => {
        await store.dev.apps.searchApi(key);
    }
    onBind(api: DevModel.UQ, bind: boolean) {
        store.dev.apps.appBindUq([{id:api.id, access:['*']}]);
    }
    row = (usq: DevModel.UQ) => {
        let isConnected = store.dev.apps.uqs.find(a => a.id === usq.id) !== undefined;
        let cn = ['btn', 'btn-sm'];
        let btnContent:any, onClick:any;
        if (isConnected) {
            cn.push('btn-success');
            onClick = ()=>this.onBind(usq, false);
            btnContent = "已关联";
        }
        else {
            cn.push('btn-primary');
            onClick = ()=>this.onBind(usq, true);
            btnContent = <span><i className="fa fa-check"/> 关联</span>;
        }
        return <div className="d-flex justify-content-start py-1 px-3">
            <div className="align-self-center">{usq.name + ' - ' + usq.discription}</div>
            <footer className="ml-auto"><button className={classNames(cn)} onClick={onClick}>{btnContent}</button></footer>
        </div>
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索UQ名字" 
            maxLength={100} />;
        return <Page back="close" header={header}>
            <List items={store.dev.apps.searchedApis} item={{render: this.row}} loading={null} />
        </Page>;
    }
}

export default appsProps;
