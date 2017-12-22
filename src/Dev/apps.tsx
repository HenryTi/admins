import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as _ from 'lodash';
import {Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {FormRow, EasyDate, Media, Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge} from 'tonva-react-form';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjView';

@observer
class Info extends React.Component<DevModel.App> {
    private rows: Prop[];
    @observable private apis:ListProp = {label: '关联API', type: 'list', list: undefined, row: ApiRow};
    constructor(props:any) {
        super(props);
    }
    async componentWillMount() {
        let {name, discription, icon, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <small className="text-muted">
                上次修改: <EasyDate date={date_update}/>
                <i className="fa fa-fw" />
                创建: <EasyDate date={date_init}/>
            </small>
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={icon || consts.appIcon} main={name} discription={disp} />},
            '',
            this.apis,
        ];
    }
    async componentDidMount() {
        await store.dev.apps.loadCurApis();
        this.apis.list = store.dev.apps.apis;
    }
    render() {
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
        </div>
    }
}

class ApiRow extends React.Component<any> {
    render() {
        let {name, discription} = this.props;
        let disp;
        if (discription) disp = <small className="col-sm col-sm-auto text-muted">{discription}</small>;
        return <div className='row form-control-plaintext align-items-center'>
            <div className='col'>{name}</div>
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
    fields: [
        {
            type: 'string',
            name: 'name',
            label: '名称',
            rules: ['required','maxlength:100'],
        },
        {
            type: 'text',
            name: 'discription',
            label: '描述',
            rules: ['maxlength:250'],
        },
        {
            type: 'string',
            name: 'icon',
            label: '图标',
            rules: ['maxlength:250'],
        },
        {
            type: 'checkbox',
            name: 'public',
            label: '公开',
            defaultValue: 0,
        },
    ],
    row: (item:DevModel.App):JSX.Element => {
        return <Row icon={item.icon || consts.appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
    extraMenuActions: [
        {icon:'cogs', caption:'设置关联API', action: ()=>nav.push(<AppApis />)}
    ],
};

interface SelectedApi {
    selected:boolean;
    api: DevModel.Api;
}
@observer
class AppApis extends React.Component {
    @observable someSelected: boolean = false;
    @computed private get items():SelectedApi[] {
        return store.dev.apps.apis.map(a => {return {selected:false, api:a}});
    };

    private menuItems = [
        //{caption:'新增API关联' + this.props.title, action:this.editItem.bind(this), icon:'edit' },
        //{caption:'取消API关联', action:this.deleteItem.bind(this), icon:'trash-o' }
    ];

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.row = this.row.bind(this);
        this.removeBind = this.removeBind.bind(this);
    }
    async removeBind() {
        let apiIds:number[] = this.items.filter(si => si.selected === true).map(v => v.api.id);
        await store.dev.apps.appBindApi(apiIds, false);
        this.calcSomeSelected();
    }    
    private calcSomeSelected() {
        this.someSelected = (this.items.some(v => v.selected === true));
    }
    //onSelect(selectedApi: SelectedApi, selected:boolean) {
    onSelect(item: DevModel.App, isSelected:boolean, anySelected:boolean) {
        //{selectedApi.selected = e.target.checked}
        //selectedApi.selected = selected;
        //if (selected === true) this.someSelected = true;
        //else this.calcSomeSelected();
        this.someSelected = anySelected;
    }
    //row(selectedApi: SelectedApi) {
    row(item: DevModel.App) {
        return <div>
            <div>{item.name}</div>
            <small className="ml-auto text-muted">{item.discription}</small>
        </div>;
        /*
        let {selected, api} = selectedApi;
        return <li key={api.id} className="va-row p-0">
            <label className="w-100 mb-0 px-3 py-2">
                <label className="custom-control custom-checkbox mb-0 mr-0">
                    <input type='checkbox' className="custom-control-input"
                        //checked={selected}
                        onChange={(e)=>this.onSelect(selectedApi, e.target.checked)} />
                    <span className="custom-control-indicator" />
                    <div className="custom-control-description  d-flex justify-content-end">
                        <div>{api.name}</div>
                        <small className="ml-auto text-muted">{api.discription}</small>
                    </div>
                    
                </label>
            </label>
        </li>
        */
    }
    render() {
        let btnProps = this.someSelected?
            {color:'danger', onClick:this.removeBind, icon:'trash', text:'取消'}:
            {color:'primary', onClick:()=>nav.push(<Apis/>), icon:'plus', text:'新增'};
        let btn = (p)=><Button outline={true} color={p.color} size="sm" onClick={p.onClick}>
            <i className={"fa fa-" + p.icon} /> {p.text}关联
        </Button>;
        let listHeader = <li className="va-row py-1 justify-content-center">{btn(btnProps)}</li>;
        return <Page header="关联API">
            <List
                header={listHeader}
                items={this.items}
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
        store.dev.apps.appBindApi([api.id], bind);
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
        return <div>
            <div>{api.name + ' - ' + api.discription}</div>
            <footer><Button {...btnProps}>{btnContent}</Button></footer>
        </div>
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索API名字" 
            maxLength={100} />;
        return <Page close={true} header={header}>
            <List items={store.dev.apps.searchedApis} item={{render: this.row}} loading={null} />
        </Page>;
    }
}

export default appsProps;
