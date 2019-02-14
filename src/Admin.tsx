import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page, meInFrame, Controller, VPage} from  'tonva-tools'; 
import {List, LMR, FA, StackedFA, PropGrid, Prop, Muted} from 'tonva-react-form';
import {StringValueEdit} from './tools';
import {appIcon, appItemIcon} from './consts';
import {Unit, UnitApps, UnitAdmin, DevModel} from './model';
import {store} from './store';
import Administors from './Administors';
//import DevActions from './Dev';
import AppsPage from './Apps';
import {Members} from './Members';
import { mainApi } from 'api';
import { COrganization } from 'organization';
import {
    ObjViewProps, ObjView,
    //appsProps, 
    busesProps, 
    serversProps, /*uqdbsProps, */servicesProps, UQController} from './Dev';
import { AppController } from './Dev';
import { UsersController } from 'Users';

export class CAdmin extends Controller {
    isProduction: boolean;
    adminUnits: UnitAdmin[]; // 仅仅为Admins调试用。从登录用户获取units

    private async loadAdminUnits(): Promise<void> {
        let ret = await mainApi.userAdminUnits();
        this.adminUnits = ret;
        if (ret.length === 1) {
            meInFrame.unit = ret[0].id;
            await store.loadUnit();
        }
    }
    protected async internalStart(param?:any):Promise<void> {
        store.init();
        
        this.isProduction = document.location.hash.startsWith('#tv');
        console.log('admins isProduction %s', this.isProduction);

        if (this.isProduction === false) {
            await this.loadAdminUnits();
            this.showVPage(VAdmin);
            return;
        }
        await store.loadUnit();
        this.showVPage(VAdmin);
    /*
        let user = nav.user;
        if (user === undefined) {
            console.log('autorun: user has logged out');
            return;
        }
    
        console.log('autorun login');
        */
       /*
        setTimeout(async () => {
            // 等待 tonva-tools 里面的initSubWin的nav.user的赋值
            // 这个地方实际上有问题的，不应该这么写。程序逻辑顺序逻辑错误。
            // 2018-11-5: 临时凑合用延时的方式来解决。
            await store.loadUnit();
            this.showVPage(VAdmin);
        }, 200);
        */
    }
}

export class VAdmin extends VPage<CAdmin> {
    async showEntry() {
        let {isProduction, adminUnits} = this.controller;
        if (isProduction === false) {
            switch (adminUnits.length) {
                default: this.openPage(this.selectUnitPage); return;
                case 0: this.openPage(this.noUnitPage); return;
                case 1: this.openPageElement(<AdminPage />); return;
            }
        }

        if (store.unit === undefined) {
            this.openPage(this.noUnitPage);
            return;
        }
        this.openPageElement(<AdminPage />);
    }

    private selectUnitPage = () => {
        return <Page header="选择小号" logout={logout}>
            <List items={this.controller.adminUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>;
    }

    private noUnitPage = () => {
        let {nick, name} = nav.user;
        return <Page header="没有小号" logout={logout}>
            <div className="p-3 small text-info">
                {nick || name}: 没有需要管理的小号
            </div>
        </Page>
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
    right?: string | JSX.Element;
    icon: string|JSX.Element;
    page?: new (props:any) => React.Component;
    //onClick: () => nav.push(<Administors />),
    controller?: Controller;
}

interface DevItem<T extends DevModel.ObjBase> {
    title: string;
    count: number;
    icon: string;
    objProps?: ObjViewProps<T>;
    onClick?: ()=>void;
}

type Item = ActionItem|DevItem<DevModel.ObjBase>;

const rArrow = <FA name="chevron-right" />;

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
        main: '启停App',
        right: rArrow, //'增减',
        icon: 'play',
        page: AppsPage,
    };
    private usersAction:ActionItem = {
        main: '用户角色',
        right: rArrow,
        icon: 'users',
        page: Members,
    };
    private newUsersAction:ActionItem = {
        main: '用户管理',
        right: rArrow,
        icon: 'users',
        controller: new UsersController(undefined),
    };
    /*
    private devAction:Item = {
        main: <DevActions />,
        right: '程序开发相关管理',
        icon: 'laptop',
        //page: Dev,
    };*/
    private adminsAction:ActionItem = {
        main: '管理员',
        right: rArrow,
        icon: 'universal-access',
        page: Administors,
    };

    private cOrganization = new COrganization;
    private organizeAction:ActionItem = {
        main: this.cOrganization.label,
        right: rArrow,
        icon: this.cOrganization.icon,
        controller: this.cOrganization
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
        console.log('unit:', unit);
        if (isAdmin === 1) {
            if ((type & 2) !== 0 && unit.name !== '$$$') {
                // unit
                items.push(this.appsAction, this.usersAction, this.newUsersAction, this.organizeAction);
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
                        onClick: () => new AppController(undefined).start(unit.id),
                        //items: store.dev.apps,
                        //page: <ObjView {...appsProps} items={store.dev.apps} />
                        //objProps: appsProps
                    },
                    {
                        title: 'UQ', 
                        count: counts.uq, 
                        icon: 'database', 
                        onClick: () => new UQController(undefined).start(unit.id),
                        //items: store.dev.apis, 
                        //objProps: uqsProps,
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
                    /*
                    {
                        title: 'uqDB', 
                        count: counts.uqdb, 
                        icon: 'database', 
                        objProps: uqdbsProps,
                    },
                    */
                    ];
                    items.push(...devItems);
                }
            }
        }
        return items;
    }
    private row = (item:Item, index:number):JSX.Element => {
        let {title} = item as DevItem<DevModel.ObjBase>;
        let left:any, mid:any, r:any;
        if (title !== undefined) {
            let {icon, count} = item as DevItem<DevModel.ObjBase>;
            left = <FA className="text-primary" name={icon} fixWidth={true} size="lg" />;
            mid = title;
            r = count>0 && <span>{count}</span>;
        }
        else {
            let {right, main, icon} = item as ActionItem;
            left = typeof icon === 'string'? 
                <FA className="text-primary" name={icon} fixWidth={true} size="lg" /> :
                item.icon;
            mid = main;
            r = <span>{right}</span>;
        }
        return <LMR className="px-3 py-2 align-items-center" left={left} right={r}>
            <div className="px-3"><b>{mid}</b></div>
        </LMR>;
    }
    private rowClick = async (item:Item) => {
        let {title} = item as DevItem<DevModel.ObjBase>;
        if (title !== undefined) {
            let {objProps, onClick} = item as DevItem<DevModel.ObjBase>;
            if (objProps !== undefined)
                return nav.push(<ObjView {...objProps} />);
            else {
                onClick();
                return;
            }
        }
        else {
            let {page:P, controller} = item as ActionItem;
            if (P !== undefined)
                nav.push(<P />);
            else {
                await controller.start(store.unit.id);
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
            top = <LMR className='px-3 my-4 bg-white py-2 cursor-pointer' onClick={()=>nav.push(<UnitProps />)}
                left={<div><img src={icon || appIcon} /></div>}>
                <div className="px-3">
                    <h6 className='text-dark'>{name}</h6>
                    <h6><small className='text-secondary'>{nick}</small></h6>
                    <div className='small text-info'>{discription}</div>
                </div>
            </LMR>;
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
