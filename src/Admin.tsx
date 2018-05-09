import * as React from 'react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, meInFrame} from 'tonva-tools';
import {List, LMR, FA, StackedFA, PropGrid, Prop, Muted} from 'tonva-react-form';
import {StringValueEdit} from './tools';
import consts from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {store} from './store';
import Administors from './Administors';
import Dev from './Dev';
import AppsPage from './Apps';
import {Members} from './Members';

@observer
export class StartPage extends React.Component {
    private isDebug:boolean;
    constructor(props) {
        super(props);
        this.isDebug = document.location.hash.startsWith('#tv');
    }
    async componentWillMount() {
        if (!this.isDebug) return;
        await store.loadAdminUnits();
    }
    render() {
        if (!this.isDebug) return <AdminPage />;
        let {adminUnits} = store;
        if (adminUnits === undefined)
            return <Page>loading ... </Page>;
        if (adminUnits.length === 1)
            return <AdminPage />;
        return <SelectUnit />;
    }
}

//@observer 
class SelectUnit extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }
    async toAdminPage() {
        meInFrame.unit = 25;
        await store.loadUnit();
        nav.pop();
        nav.push(<AdminPage />);
    }
    private renderRow(item: UnitAdmin, index: number):JSX.Element {
        return <LMR className="p-2" right={'id: ' + item.id}>
            <div>{item.nick || item.name}</div>
        </LMR>;
    }
    private async onRowClick(item: UnitAdmin) {
        meInFrame.unit = item.id; // 25;
        await store.loadUnit();
        nav.pop();
        nav.push(<AdminPage />);
    }
    render() {
        let {adminUnits} = store;
        return <Page header="选择小号">
            <List items={adminUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>
    }
}

interface Item {
    main: string;
    right?: string;
    icon: string|JSX.Element;
    page?: new (props:any) => React.Component;
    //onClick: () => nav.push(<Administors />),
}

@observer
export default class AdminPage extends React.Component {
    private appsAction:Item = {
        main: 'App设置',
        right: '小号增减App',
        // 'mobile-phone'
        icon: 'cog',
        /*<StackedFA>
            <FA name="square-o" className="fa-stack-2x text-secondary" />
            <FA name="cog" className="fa-stack-1x text-primary"  />
        </StackedFA>*/
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
    private noneAction:Item = {
        main: '请耐心等待分配任务',
        icon: 'hourglass-start',
    };
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }
    private logout() {
        store.logout();
    }
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
                items.push(this.appsAction, this.usersAction);
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
            <b>{item.main}</b>
        </LMR>
    }
    rowClick(item:Item) {
        nav.push(<item.page />);
    }
    render() {
        console.log("admin render without unit");
        let unit:Unit = store.unit;
        if (unit === undefined) {
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
                        <img className='w-75' src={icon || consts.appIcon} />
                    </Col>
                    <Col xs="auto">
                        <h4 className='text-dark'>{name}</h4>
                        <h6><small className='text-secondary'>{nick}</small></h6>
                        <div className='text-info'>{discription}</div>
                    </Col>
                </Row>
            </Container>
        }
        return <Page header={header} logout={this.logout}>
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
