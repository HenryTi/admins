import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, LMR, Badge, FA, TonvaForm, SubmitResult, FormRow, Muted, SearchBox} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role, RoleMember} from '../model';
import {store} from '../store';
import consts from '../consts';
import {mainApi} from '../api';
import {MemberPage} from './memberPage';

@observer
export class MembersPage extends React.Component {
    async componentDidMount() {
        await store.loadMembers();
    }
    private renderMember(member:RoleMember, index:number):JSX.Element {
        return <MemberRow {...member} />;
    }
    private userClick(user:RoleMember) {
        store.setRoleUser(user);
        nav.push(<MemberPage />);
    }
    private onSearch() {
        let role = store.role;
        let roleId = role === undefined? 0:role.id;
        nav.push(<MemberSearch roleId={roleId} />);
    }
    render() {
        let right = <Button onClick={this.onSearch} size="sm"><FA name="search" /></Button>;
        return <Page header="用户" right={right}>
            <List items={store.roleMembers} item={{render: this.renderMember, onClick: this.userClick}} />
        </Page>
    }
}

const MemberRow = (member:RoleMember) => {
    let {nick, name, assigned, icon} = member;
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
    </LMR>;
};

interface SearchProps {
    roleId: number;
}
interface SearchState {
    members: RoleMember[];
}
export class MemberSearch extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            members: null,
        }
    }
    private async onSearch(key:string) {
        let ret = await mainApi.unitMembers(store.unit.id, this.props.roleId, key, 0, 100);
        this.setState({members: ret});
    }
    private renderMember(member:RoleMember, index:number):JSX.Element {
        return <MemberRow {...member} />;
    }
    private userClick(user:RoleMember) {
        store.setRoleUser(user);
        nav.push(<MemberPage />);
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            maxLength={100}
            placeholder="搜索用户" />;
        return <Page header={header}>
            <List
                items={this.state.members}
                item={{render: this.renderMember, onClick: this.userClick}} />
        </Page>
    }
}