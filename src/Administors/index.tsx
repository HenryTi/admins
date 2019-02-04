import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page} from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {store} from '../store';
import NewFellow from './NewFellow';
import EditAdmin from './EditAdmin';
import {LMR, Badge, List} from 'tonva-react-form';

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
    private row = ({icon, name, nick}:UnitAdmin) => {
        let content;
        if (nick === undefined) {
            content = <b>{name}</b>;
        }
        else {
            content = <><b>{nick}</b> &nbsp; <small className="text-muted">{name}</small></>;
        }
        return <LMR className="py-2 px-3 align-items-stretch"
            left={<Badge size="sm"><img src={icon|| appItemIcon} /></Badge>}>
            <div className="px-3">{content}</div>
        </LMR>;
    }

    private onNewOwner = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        this.newAdmin(evt, true, false);
    }

    private onNewAdmin = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        this.newAdmin(evt, false, true);
    }

    private newAdmin(evt: React.MouseEvent<HTMLAnchorElement>, isOwner:boolean, isAdmin:boolean) {
        evt.preventDefault();
        nav.push(<NewFellow isOwner={isOwner} isAdmin={isAdmin} />);
    } 
    render() {
        //let n = nav;
        //let me = n.local.user.get().id;
        let {unit} = store;
        if (unit === undefined) return;
        let {owners, admins, fellows} = store.admins;
        let right = <button className="btn btn-success btn-sm" onClick={this.onNewFellow}>新增成员</button>;

        let showOwners = false, showAdmins = false;
        let ownersView, adminsView, fellowsView;
        if (unit.isRoot === 1) {
            showOwners = true;
            showAdmins = true;
        }
        if (unit.isOwner === 1) showAdmins = true;
        if (showOwners === true) {
            let header = <LMR 
                className="px-3 small"
                left="高管" 
                right={<a className="small" href='#' onClick={this.onNewOwner}>新增</a>} />;
            ownersView = <List 
                className="my-4"
                header={header} items={owners}
                none="[无]"
                item={{onClick: this.onItemClick, render: this.row}}
            />;
        }
        if (showAdmins === true) {
            let header = <LMR 
                className="px-3 small"
                left="管理员" 
                right={<a className="small" href='#' onClick={this.onNewAdmin}>新增</a>} />;
            adminsView = <List 
                className='my-4' 
                header={header} items={admins} 
                none='[无]'
                item={{onClick: this.onItemClick, render: this.row}}
            />;
        }
        return <Page header="管理员" right={right}>
            {ownersView}
            {adminsView}
            <div className="card mx-1 my-4">
                <div className="card-title">说明</div>
                <div className="card-body">
                    <ul style={{paddingLeft:'1em'}}>
                        <li><div className="card-text">管理组包括主人、高管、管理员</div></li>
                        <li><div className="card-text">小号主人可以增减高管</div></li>
                        <li><div className="card-text">高管可以增减管理员</div></li>
                        <li><div className="card-text">管理员可以管理小号，程序的开发，以及用户</div></li>
                    </ul>
                </div>
            </div>
        </Page>;
    }
}
