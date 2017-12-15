import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {store} from '../store';
import NewFellow from './NewFellow';
import EditAdmin from './EditAdmin';

@observer
export default class AdministorsPage extends React.Component<{}, null> {
    async componentDidMount() {
        await store.admins.load();
    }

    converter(admin: UnitAdmin):ListItem {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon : admin.icon || consts.appItemIcon,
            //right: <aside>ddd</aside>
            //unread: 0,
        };
    }
    onNewFellow() {
        nav.push(<NewFellow />);
    }
    onItemClick(ua:UnitAdmin) {
        store.admins.cur = ua;
        nav.push(<EditAdmin />);
    }
    render() {
        let me = nav.local.user.get().id;
        let {unit} = store;
        let {owners, admins, fellows} = store.admins;
        let right = <Button color="success" size="sm" onClick={this.onNewFellow}>新增成员</Button>;

        let showOwners = false, showAdmins = false;
        let ownersView, adminsView, fellowsView;
        if (unit.isRoot === 1) {
            showOwners = true;
            showAdmins = true;
        }
        if (unit.isOwner === 1) showAdmins = true;
        if (showOwners === true) ownersView = <ListView 
            className='my-4' 
            header='高管' items={owners}
            none='[ 无高管 ]'
            itemClick={this.onItemClick}
            converter={this.converter} />;
        if (showAdmins === true) adminsView = <ListView 
            className='my-4' 
            header='管理员' items={admins} 
            none='[ 无管理员 ]'
            itemClick={this.onItemClick}
            converter={this.converter} />;
        fellowsView = <ListView 
            className='my-4' 
            header='成员' items={fellows} 
            none='[ 无普通成员 ]'
            itemClick={this.onItemClick}
            converter={this.converter} />;

        return <Page header={"管理员"} right={right}>
            {ownersView}
            {adminsView}
            {fellowsView}
            <Card className='mx-1 my-4'>
                <CardHeader>说明</CardHeader>
                <CardBody>
                    <ul>
                    <li><CardText>管理组包括创始人、高管、管理员和成员</CardText></li>
                    <li><CardText>小号创始人可以增减高管</CardText></li>
                    <li><CardText>高管可以增减管理员和普通成员</CardText></li>
                    <li><CardText>管理员可以小号，程序的开发，以及用户</CardText></li>
                    </ul>
                </CardBody>
            </Card>
        </Page>;
    }
}
