import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as _ from 'lodash';
import {Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {FormRow, EasyDate, Media, 
    Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge, Muted} from 'tonva-react-form';
import {UnitSpan, IdDates, ServerSpan} from '../tools';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjView';
import {NewService, ServiceInfo} from './servicePage';

@observer
class Info extends React.Component<DevModel.App> {
    @observable private apis:ListProp = {label: '关联API', type: 'list', list: undefined, row: ApiRow};
    componentWillMount() {
        store.dev.services.cur = undefined;
    }
    async componentDidMount() {
        await store.dev.apps.loadCurApis();
        await store.dev.services.loadAppServices(this.props.id);
        this.apis.list = store.dev.apps.apis;
    }
    render() {
        let {unit, name, discription, icon, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={icon || consts.appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            this.apis,
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

class ApiRow extends React.Component<any> {
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
            field: {name: 'public', type: 'bool', defaultValue: 0}
        },
    ],
    row: (item:DevModel.App):JSX.Element => {
        return <Row icon={item.icon || consts.appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: ()=>store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
    extraMenuActions: [
        {icon:'cogs', caption:'设置关联API', action: ()=>nav.push(<AppApis />)}
    ],
};

@observer
class AppApis extends React.Component {
    @observable anySelected: boolean = false;
    private _list: List;

    constructor(props) {
        super(props);
        this.row = this.row.bind(this);
        this.ref = this.ref.bind(this);
        //this.removeBind = this.removeBind.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }
    ref(list:List) {
        this._list = list;
    }
    /*
    async removeBind() {
        let apiIds:number[] = this._list.selectedItems.map(v => v.id);
        await store.dev.apps.appBindApi(apiIds, false);
    }*/
    onSelect(item: DevModel.App, isSelected:boolean, anySelected:boolean) {
        this.anySelected = anySelected;
    }
    row(item: DevModel.App) {
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
            {color:'primary', onClick:()=>nav.push(<Apis/>), icon:'plus', text:'新增'};
        let btn = (p)=><Button outline={true} color={p.color} size="sm" onClick={p.onClick}>
            <i className={"fa fa-" + p.icon} /> {p.text}关联
        </Button>;
        let listHeader = <div className="va-row py-1 justify-content-center">{btn(btnProps)}</div>;
        return <Page header="关联API">
            <List ref={this.ref}
                header={listHeader}
                items={store.dev.apps.apis}
                item={{render: this.row, onSelect: this.onSelect}} />
        </Page>;
    }
}

@observer
class Apis extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.row = this.row.bind(this);
    }
    onSearch(key:string) {
        store.dev.apps.searchApi(key);
    }
    onBind(api: DevModel.Api, bind: boolean) {
        store.dev.apps.appBindApi([{id:api.id, access:['*']}]);
    }
    row(api: DevModel.Api) {
        let isConnected = store.dev.apps.apis.find(a => a.id === api.id) !== undefined;
        let btnProps = {
            outline:true,
            size:'sm'
        } as any, btnContent:any;
        if (isConnected) {
            _.assign(btnProps, {onClick:()=>this.onBind(api, false), color:'success'});
            btnContent = "已关联";
        }
        else {
            _.assign(btnProps, {onClick:()=>this.onBind(api, true), color:'primary'});
            btnContent = <span><i className="fa fa-check"/> 关联</span>;
        }
        return <div className="d-flex justify-content-start py-1 px-2">
            <div className="align-self-center">{api.name + ' - ' + api.discription}</div>
            <footer className="ml-auto"><Button {...btnProps}>{btnContent}</Button></footer>
        </div>
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索API名字" 
            maxLength={100} />;
        return <Page back="close" header={header}>
            <List items={store.dev.apps.searchedApis} item={{render: this.row}} loading={null} />
        </Page>;
    }
}

export default appsProps;
