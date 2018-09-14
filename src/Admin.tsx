import * as React from 'react';
import {Container, Row, Col} from 'reactstrap';
import {observer} from 'mobx-react';
import {nav, Page, meInFrame} from  'tonva-tools'; 
import {List, LMR, FA, StackedFA, PropGrid, Prop, Muted} from 'tonva-react-form';
import { Coordinator, VmPage } from 'tonva-react-usql';
import {StringValueEdit} from './tools';
import {appIcon, appItemIcon} from './consts';
import {Unit, UnitApps, UnitAdmin, DevModel} from './model';
import {store} from './store';
import Administors from './Administors';
//import DevActions from './Dev';
import AppsPage from './Apps';
import {Members} from './Members';
import { mainApi } from 'api';
import { CrOrganization } from 'organization';
import {
    ObjViewProps, ObjView,
    appsProps, usqsProps, busesProps, 
    serversProps, usqldbsProps, servicesProps} from './Dev';

export class CrAdmin extends Coordinator {
    isProduction: boolean;
    adminUnits: UnitAdmin[]; // 仅仅为Admins调试用。从登录用户获取units

    private async loadAdminUnits(): Promise<void> {
        let ret = await mainApi.userAdminUnits();
        this.adminUnits = ret;
        if (ret.length === 1) {
            meInFrame.unit = ret[0].id;
            await store.loadUnit();
            let a:List
        }
    }
    protected async internalStart(param?:any):Promise<void> {
        store.init();
        
        this.isProduction = document.location.hash.startsWith('#tv');
        console.log('admins isProduction %s', this.isProduction);

        if (this.isProduction === false) {
            await this.loadAdminUnits();
        }
        else {
            let user = nav.user;
            if (user === undefined) {
                console.log('autorun: user has logged out');
                return;
            }
        
            console.log('autorun login');
            await store.loadUnit();
        }
        this.showVm(VmAdmin);
    }
}

export class VmAdmin extends VmPage {
    protected coordinator: CrAdmin;

    async showEntry() {
        let {isProduction, adminUnits} = this.coordinator;
        if (isProduction === false && adminUnits.length > 1) {
            this.openPage(this.selectUnitPage);
        }
        else {
            this.openPageElement(<AdminPage />);
        }
        /*
        if (this.isProduction === true) return <AdminPage />;
        let {adminUnits} = store;
        if (adminUnits === undefined)
            return <Page>loading ... </Page>;
        if (adminUnits.length === 1)
            return <AdminPage />;
        return <SelectUnit />;
        */
    }

    private selectUnitPage = () => {
        return <Page header="选择小号" logout={logout}>
            <List items={this.coordinator.adminUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>;
    }

    protected get view() {return undefined}

    renderRow = (item: UnitAdmin, index: number):JSX.Element => {
        return <LMR className="p-2" right={'id: ' + item.id}>
            <div>{item.nick || item.name}</div>
        </LMR>;
    }
    onRowClick = async (item: UnitAdmin) => {
        meInFrame.unit = item.id; // 25;
        await store.loadUnit();
        this.closePage();
        this.openPageElement(<AdminPage />);
    }
}

const logout = () => {
    store.logout();
}

interface ActionItem {
    main: string | JSX.Element;
    right?: string;
    icon: string|JSX.Element;
    page?: new (props:any) => React.Component;
    //onClick: () => nav.push(<Administors />),
    cr?: Coordinator;
}

interface DevItem<T extends DevModel.ObjBase> {
    title: string;
    count: number;
    icon: string;
    objProps: ObjViewProps<T>
}

type Item = ActionItem|DevItem<DevModel.ObjBase>;

@observer
default class AdminPage extends React.Component {
    private caption:string;

    async componentWillMount() {
        let {unit, dev} = store;
        let {isAdmin, isOwner, type} = unit;
        if ((type & 1) !== 0) {
            // dev unit
            this.caption = '开发号';
            await store.dev.loadCounts();
        }
        else {
            this.caption = '小号';
        }
    }

    private appsAction:ActionItem = {
        main: 'App设置',
        right: '增减',
        icon: 'cog',
        page: AppsPage,
    };
    private usersAction:ActionItem = {
        main: '用户角色',
        right: '权限',
        icon: 'users',
        page: Members,
    };
    /*
    private devAction:Item = {
        main: <DevActions />,
        right: '程序开发相关管理',
        icon: 'laptop',
        //page: Dev,
    };*/
    private adminsAction:ActionItem = {
        main: '系统管理员',
        right: '增减',
        icon: 'universal-access',
        page: Administors,
    };
    private organizeAction:ActionItem = {
        main: '组织结构',
        right: '调整',
        icon: 'sitemap',
        cr: new CrOrganization
    };

    private noneAction:ActionItem = {
        main: '请耐心等待分配任务',
        icon: 'hourglass-start',
    };

    private buildItems():Item[] {
        let {unit, dev} = store;
        let {isAdmin, isOwner, type} = unit;
        let items:Item[] = [];
        if (isOwner === 1) {
            items.push(this.adminsAction);
        }
        if (isAdmin === 1) {
            if ((type & 2) !== 0) {
                // unit
                items.push(this.appsAction, this.usersAction, this.organizeAction);
            }
            if ((type & 1) !== 0) {
                // dev unit
                let {counts} = dev;
                if (counts !== undefined) {
                    let devItems:DevItem<DevModel.ObjBase>[] = [
                    {
                        title: 'APP', 
                        count: counts.app, 
                        icon: 'tablet', 
                        //items: store.dev.apps,
                        //page: <ObjView {...appsProps} items={store.dev.apps} />
                        objProps: appsProps
                    },
                    {
                        title: 'USQ', 
                        count: counts.usq, 
                        icon: 'cogs', 
                        //items: store.dev.apis, 
                        objProps: usqsProps,
                        //page: <ObjView {...apisProps} items={store.dev.apis} />
                    },
                    {
                        title: 'BUS', 
                        count: counts.bus, 
                        icon: 'cogs', 
                        objProps: busesProps,
                    },
                    {
                        title: 'Server', 
                        count: counts.server, 
                        icon: 'server', 
                        //items: store.dev.servers, 
                        //page: <ObjView {...serversProps} items={store.dev.servers} />
                        objProps: serversProps,
                    },
                    /*
                    {
                        title: 'Service', 
                        count: counts.service, 
                        icon: 'microchip', 
                        //items: store.dev.services, 
                        //page: <ObjView {...servicesProps} items={store.dev.services} />
                        objProps: servicesProps,
                    },*/
                    {
                        title: 'UsqlDB', 
                        count: counts.usqldb, 
                        icon: 'database', 
                        objProps: usqldbsProps,
                    },
                    ];
                    items.push(...devItems);
                }
            }
        }
        return items;
    }
    private row = (item:Item, index:number):JSX.Element => {
        let {title} = item as DevItem<DevModel.ObjBase>;
        let left, mid, r;
        if (title !== undefined) {
            let {icon, count} = item as DevItem<DevModel.ObjBase>;
            left = <FA className="text-primary" name={icon} fixWidth={true} size="lg" />;
            mid = title;
            r = count>0 && <small className="text-muted">{count}</small>;
        }
        else {
            let {right, main, icon} = item as ActionItem;
            left = typeof icon === 'string'? 
                <FA className="text-primary" name={icon} fixWidth={true} size="lg" /> :
                item.icon;
            mid = main;
            r = <small className="text-muted">{right}</small>;
        }
        return <LMR className="px-3 py-2 align-items-center" left={left} right={r}>
            <div className="px-3"><b>{mid}</b></div>
        </LMR>;
    }
    private rowClick = async (item:Item) => {
        //let {vm, page} = item;
        let {title} = item as DevItem<DevModel.ObjBase>;
        if (title !== undefined) {
            let {objProps} = item as DevItem<DevModel.ObjBase>;
            return nav.push(<ObjView {...objProps} />);
        }
        else {
            let {page:P, cr} = item as ActionItem;
            if (P !== undefined)
                nav.push(<P />);
            else {
                await cr.start();
            }
        }
    }
    render() {
        let unit:Unit = store.unit;
        if (unit === undefined) {
            console.log("admin render without unit");
            return null;
        }
        console.log("admin render with unit");
        let items = this.buildItems();
        if (items === undefined) {
            return <Page header="" />;
        }
        let title = this.caption;
        let header = title, top;
        if (unit !== undefined) {
            let {name, nick, icon, discription} = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = <div className='row px-3 my-4 bg-white py-2 cursor-pointer' onClick={()=>nav.push(<UnitProps />)}>
                    <Col xs="auto">
                        <img src={icon || appIcon} />
                    </Col>
                    <Col xs="auto">
                        <h6 className='text-dark'>{name}</h6>
                        <h6><small className='text-secondary'>{nick}</small></h6>
                        <div className='text-info'>{discription}</div>
                    </Col>
                </div>;
        }
        return <Page header={header} logout={logout}>
            {top}
            <List items={items} item={{render:this.row, onClick:this.rowClick}} />
        </Page>;
    }
}

class UnitProps extends React.Component {
    private rows:Prop[] = [
        '',
        {label: '标志图', type: 'string', name: 'icon'},
        '=',
        {label: '唯一号', type: 'string', name: 'name'},
        {
            label: '名称', 
            type: 'string',
            name: 'nick', 
            onClick:()=>nav.push(<StringValueEdit 
                title="修改名称"
                value={store.unit.nick}
                onChanged={this.onNickChanged} 
                info="好的名字会提升接受度" />)
        },
        {
            label: '说明',
            type: 'string',
            name: 'discription',
            onClick:()=>nav.push(<StringValueEdit 
                title="修改说明"
                value={store.unit.discription}
                onChanged={this.onDiscriptionChanged} 
                info="对小号做一个说明" />)
        },
    ];
    async onNickChanged(value:any, orgValue:any):Promise<void> {
        await store.unitChangeProp('nick', value);
    }
    async onDiscriptionChanged(value:any, orgValue:any):Promise<void> {
        await store.unitChangeProp('discription', value);
    }
    render() {
        return <Page header="小号信息">
            <PropGrid rows={this.rows} values={store.unit} alignValue="right" />
        </Page>;
    }
}
