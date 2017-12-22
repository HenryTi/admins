import * as React from 'react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {observer} from 'mobx-react';
import {nav, Page} from 'tonva-tools';
import {List, LMR, FA, StackedFA} from 'tonva-react-form';
import consts from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {store} from './store';
import Administors from './Administors';
import Dev from './Dev';

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
        page: Administors,
        //onClick: () => nav.push(<Administors />),
    };
    private usersAction:Item = {
        main: '会员管理',
        right: '会员权限',
        icon: 'users',
        page: Administors,
        //onClick: () => nav.push(<Administors />),
    };
    private devAction:Item = {
        main: '应用开发',
        right: '程序开发相关管理',
        icon: 'laptop',
        page: Dev,
        //onClick: () => nav.push(<Dev />),
    };
    private adminsAction:Item = {
        main: '系统管理员',
        right: '增删管理员',
        icon: 'universal-access',
        page: Administors,
        //onClick: () => nav.push(<Administors />),
    };
    private noneAction:Item = {
        main: '请耐心等待分配任务',
        // right: '增删管理员',
        icon: 'hourglass-start',
        // onClick: () => nav.push(<AdministorsPage />),
    };
    constructor(props) {
        super(props);
        //if (this.props.isOwner === 0) this.items.shift();
        this.state = {items: undefined};
    }
    private getItems():Item[] {
        // store.init();
        // await store.loadUnit();
        let unit = store.unit;
        if (unit === undefined) return;
        let {isAdmin, isOwner} = unit;
        let items:Item[];
        if (isOwner === 1) {
            items = [this.appsAction, this.usersAction, this.adminsAction, this.devAction];
        }
        else if (isAdmin === 1) {
            items = [this.appsAction, this.usersAction, this.devAction];
        }
        else {
            items = [];
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
        let items = this.getItems();
        if (items === undefined) return null;
        let unit:Unit = store.unit;
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            let {name, nick, icon, discription} = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = <Container>
                <Row className='my-4'>
                    <Col xs={2} className='d-flex justify-content-end align-items-start'>
                        <img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
                    </Col>
                    <Col xs="auto">
                        <h4 className='text-dark'>{name}</h4>
                        <h6><small className='text-secondary'>{nick}</small></h6>
                        <div className='text-info'>{discription}</div>
                    </Col>
                </Row>
            </Container>
        }
        return <Page header={header} debugLogout={true}>
            {top}
            <List items={items} item={{render:this.row, onClick:this.rowClick}} />
        </Page>;
    }
}
