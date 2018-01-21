import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, LMR, Badge, FA, TonvaForm, SubmitResult, FormRow, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role, RoleMember} from '../model';
import {store} from '../store';
import consts from '../consts';
import {MemberPage} from './memberPage';

@observer
export class MembersPage extends React.Component {
    async componentDidMount() {
        await store.loadRoleUsers();
    }
    private renderUser(user:RoleMember, index:number):JSX.Element {
        let {nick, name, assigned, icon} = user;
        let content;
        if (assigned !== undefined)
            content = <><div><b>{assigned}</b> <Muted>{nick}</Muted></div><Muted>{name}</Muted></>;
        else if (nick !== undefined)
            content = <><div><b>{nick}</b></div><Muted>{name}</Muted></>;
        else
            content = <div><b>{name}</b></div>;
        return <LMR className="py-1 px-2 align-items-stretch"
            left={<Badge size="sm"><img src={icon||consts.appIcon} /></Badge>}>
            {content}
            <small className="text-muted">{name}</small>
        </LMR>;
    }
    private userClick(user:RoleMember) {
        store.setRoleUser(user);
        nav.push(<MemberPage />);
    }
    render() {
        return <Page header="用户">
            <List items={store.roleMembers} item={{render: this.renderUser, onClick: this.userClick}} />
        </Page>
    }
}
