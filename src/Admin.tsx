import * as React from 'react';
import {Container, Row, Col} from 'reactstrap';
import {observer} from 'mobx-react';
import {nav, Page, meInFrame} from  'tonva-tools'; 
import {List, LMR, FA, StackedFA, PropGrid, Prop, Muted} from 'tonva-react-form';
import { VmPage, ViewModel, TypeViewModel, Coordinator } from 'tonva-react-usql';
import {StringValueEdit} from './tools';
import {appIcon, appItemIcon} from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {store} from './store';
import Administors from './Administors';
import Dev from './Dev';
import AppsPage from './Apps';
import {Members} from './Members';
import { mainApi } from 'api';
import { CrOrganization } from 'organization';

export class VmAdmin extends VmPage {
    private isProduction: boolean;
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
    protected async beforeStart(param?:any):Promise<void> {
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
    }

    async show() {
        if (this.isProduction === false && this.adminUnits.length > 1) {
            this.pushPage(<this.selectUnitPage />);
        }
        else {
            this.pushPage(<AdminPage />);
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
            <List items={this.adminUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
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
        this.popPage();
        this.pushPage(<AdminPage />);
    }
}

const logout = () => {
    store.logout();
}

interface Item {
    main: string;
    right?: string;
    icon: string|JSX.Element;
    page?: new (props:any) => React.Component;
    //onClick: () => nav.push(<Administors />),
    cr?: Coordinator;
}

@observer
default class AdminPage extends React.Component {
    private appsAction:Item = {
        main: 'App设置',
        right: '小号增减App',
        icon: 'cog',
        page: AppsPage,
    };
    private usersAction:Item = {
        main: '用户角色',
        right: '用户权限',
        icon: 'users',
        page: Members,
    };
    private devAction:Item = {
        main: '应用开发',
        right: '程序开发相关管理',
        icon: 'laptop',
        page: Dev,
    };
    private adminsAction:Item = {
        main: '系统管理员',
        right: '增删管理员',
        icon: 'universal-access',
        page: Administors,
    };
    private organizeAction:Item = {
        main: '组织结构',
        right: '组织，结构，人员，角色',
        icon: 'sitemap',
        cr: new CrOrganization
    };

    private noneAction:Item = {
        main: '请耐心等待分配任务',
        icon: 'hourglass-start',
    };

    private getItems():Item[] {
        let unit = store.unit;
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
                items.push(this.devAction);
            }
        }
        return items;
    }
    row(item:Item, index:number):JSX.Element {
        return <LMR className="py-2 px-3 align-items-center"
            left={typeof item.icon === 'string'? 
                <FA className="text-primary" name={item.icon} fixWidth={true} size="lg" /> :
                item.icon
            }
            right={<small className="text-muted">{item.right}</small>}>
            <div className="px-2"><b>{item.main}</b></div>
        </LMR>
    }
    async rowClick(item:Item) {
        //let {vm, page} = item;
        if (item.page !== undefined)
            nav.push(<item.page />);
        else {
            let {cr} = item;
            await cr.start();
        }
    }
    render() {
        let unit:Unit = store.unit;
        if (unit === undefined) {
            console.log("admin render without unit");
            return null;
        }
        console.log("admin render with unit");
        let items = this.getItems();
        if (items === undefined) {
            return <Page header="" />;
        }
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            let {name, nick, icon, discription} = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = <Container>
                <Row className='my-4 bg-white py-1 cursor-pointer' onClick={()=>nav.push(<UnitProps />)}>
                    <Col xs={2} className='d-flex justify-content-end align-items-start'>
                        <img className='w-75' src={icon || appIcon} />
                    </Col>
                    <Col xs="auto">
                        <h4 className='text-dark'>{name}</h4>
                        <h6><small className='text-secondary'>{nick}</small></h6>
                        <div className='text-info'>{discription}</div>
                    </Col>
                </Row>
            </Container>
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
