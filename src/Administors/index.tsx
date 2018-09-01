import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {store} from '../store';
import NewFellow from './NewFellow';
import EditAdmin from './EditAdmin';
import {LMR, Badge, List} from 'tonva-react-form';

export interface RowProps {
    icon: string;
    main: string;
    vice: string;
}

export class Row extends React.Component<RowProps> {
    render() {
        let {icon, main, vice} = this.props;
        return <LMR className="py-1 px-2 align-items-stretch"
            left={<Badge size="sm"><img src={icon} /></Badge>}>
            <b>{main}</b>
            <small>{vice}</small>
        </LMR>;
    }
}

@observer
export default class AdministorsPage extends React.Component<{}, null> {
    async componentDidMount() {
        await store.admins.load();
    }

    onNewFellow() {
        //nav.push(<NewFellow />);
    }
    onItemClick(ua:UnitAdmin) {
        store.admins.cur = ua;
        nav.push(<EditAdmin />);
    }
    row(item:UnitAdmin) {
        return <Row icon={item.icon|| appItemIcon} main={item.name} vice={item.nick} />
    }
    onNewAdmin(isOwner:boolean, isAdmin:boolean) {
        nav.push(<NewFellow isOwner={isOwner} isAdmin={isAdmin} />);
    } 
    render() {
        //let n = nav;
        //let me = n.local.user.get().id;
        let {unit} = store;
        if (unit === undefined) return;
        let {owners, admins, fellows} = store.admins;
        let right = <Button color="success" size="sm" onClick={this.onNewFellow}>新增成员</Button>;

        let showOwners = false, showAdmins = false;
        let ownersView, adminsView, fellowsView;
        if (unit.isRoot === 1) {
            showOwners = true;
            showAdmins = true;
        }
        if (unit.isOwner === 1) showAdmins = true;
        if (showOwners === true) {
            let header = <LMR left="高管" right={<a className="small" href='#' onClick={(e)=>{e.preventDefault();this.onNewAdmin(true, false)}}>新增</a>} />;
            ownersView = <List 
                className="my-4"
                header={header} items={owners}
                none="[ 无高管 ]"
                item={{onClick: this.onItemClick, render: this.row}}
            />;
        }
        if (showAdmins === true) {
            let header = <LMR left="管理员" right={<a className="small" href='#' onClick={(e)=>{e.preventDefault();this.onNewAdmin(false, true)}}>新增</a>} />;
            adminsView = <List 
                className='my-4' 
                header={header} items={admins} 
                none='[ 无管理员 ]'
                item={{onClick: this.onItemClick, render: this.row}}
            />;
        }
        /*
        fellowsView = <List
            className='my-4' 
            header='成员' items={fellows} 
            none='[ 无普通成员 ]'
            item={{onClick: this.onItemClick, render: this.row}}
        />*/
        return <Page header={"管理员"} right={right}>
            {ownersView}
            {adminsView}
            {/*fellowsView*/}
            <Card className='mx-1 my-4'>
                <CardHeader>说明</CardHeader>
                <CardBody>
                    <ul>
                        <li><CardText>管理组包括主人、高管、管理员</CardText></li>
                        <li><CardText>小号主人可以增减高管</CardText></li>
                        <li><CardText>高管可以增减管理员</CardText></li>
                        <li><CardText>管理员可以管理小号，程序的开发，以及用户</CardText></li>
                    </ul>
                </CardBody>
            </Card>
        </Page>;
    }
}
