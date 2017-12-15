import * as React from 'react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {observer} from 'mobx-react';
import {nav, Page, ListView, ListItem, rowIcon} from 'tonva-tools';
import consts from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {store} from './store';
import Administors from './Administors';
import Dev from './Dev';

@observer
export default class AdminPage extends React.Component {
    private appsAction:ListItem = {
        main: 'App设置',
        right: '小号增减App',
        icon: rowIcon('mobile-phone'),
        onClick: () => nav.push(<Administors />),
    };
    private usersAction:ListItem = {
        main: '会员管理',
        right: '会员权限',
        icon: rowIcon('users'),
        onClick: () => nav.push(<Administors />),
    };
    private devAction:ListItem = {
        main: '应用开发',
        right: '程序开发相关管理',
        icon: rowIcon('laptop'),
        onClick: () => nav.push(<Dev />),
    };
    private adminsAction:ListItem = {
        main: '系统管理员',
        right: '增删管理员',
        icon: rowIcon('universal-access'),
        onClick: () => nav.push(<Administors />),
    };
    private noneAction:ListItem = {
        main: '请耐心等待分配任务',
        // right: '增删管理员',
        icon: rowIcon('hourglass-start'),
        // onClick: () => nav.push(<AdministorsPage />),
    };
    constructor(props) {
        super(props);
        //if (this.props.isOwner === 0) this.items.shift();
        this.state = {items: undefined};
    }
    private getItems():ListItem[] {
        // store.init();
        // await store.loadUnit();
        let unit = store.unit;
        if (unit === undefined) return;
        let {isAdmin, isOwner} = unit;
        let items:ListItem[];
        if (isOwner === 1) {
            items = [this.appsAction, this.usersAction, this.adminsAction, this.devAction];
        }
        else if (isAdmin === 1) {
            items = [this.appsAction, this.usersAction, this.devAction];
        }
        else {
            items = [this.noneAction];
        }
        return items;
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
            <ListView items={items} />
        </Page>;
    }
}
