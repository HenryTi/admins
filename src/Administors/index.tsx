import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {mainData} from '../mainData';
import NewFellowPage from './NewFellowPage';

@observer
export default class AdministorsPage extends React.Component<{}, null> {
    async componentDidMount() {
        await mainData.loadUnitAdmins();
    }

    converter(admin: UnitAdmin):ListItem {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon : admin.icon || consts.appItemIcon,
            right: <aside>ddd</aside>
            //unread: 0,
        };
    }
    onNewFellow() {
        
    }
    render() {
        let me = nav.local.user.get().id;
        let list = mainData.unitAdmins && mainData.unitAdmins.sort((a, b) => {
            if (a.isOwner === 1)
                if (b.isOwner === 1) return a.id < b.id? -1:1;
                else return -1;
            if (b.isOwner === 1) return -1;
            return a.id < b.id? -1:1;
        });
        let right = <Button color="success" size="sm" onClick={()=>nav.push(<NewFellowPage />)}>新增成员</Button>;
        return <Page header={"管理员"} right={right}>
            <ListView items={list} converter={this.converter} />
            <Card>
                <CardHeader>说明</CardHeader>
                <CardBody>
                    <ul>
                    <li><CardText>管理组包括主人，高管，管理员和成员</CardText></li>
                    <li><CardText>主人可以增减高管和管理员</CardText></li>
                    <li><CardText>高管可以增减管理员</CardText></li>
                    <li><CardText>管理员可以增减管理用户以及机构的开发等</CardText></li>
                    </ul>
                </CardBody>
            </Card>
        </Page>;
    }
}
