import * as React from 'react';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, LMR, FA, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role} from '../model';
import {store} from '../store';
import {NewRole} from './newRole';
import {RolePage} from './rolePage';
import {MembersPage} from './membersPage';

const midClassName = classNames('d-flex', 'h-100', 'align-items-center', 'px-3', 'small', 'text-muted');

@observer
export class Members extends React.Component {
    async componentDidMount() {
        await store.loadRoles();
    }
    private renderRole = (role:Role, index:number) => {
        let {name, discription, count} = role;
        return <LMR
            className="px-3 py-2" 
            left={name}
            right={String(count || '')}>
            <div className={midClassName}>
                {discription}
            </div>
        </LMR>;
    }
    private roleClick = (role:Role) => {
        store.setRole(role);
        nav.push(<RolePage />)
    }
    private newRole = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        nav.push(<NewRole />);
    }
    private allUsersClick = () => {
        store.setRole(undefined);
        nav.push(<MembersPage />);
    }
    render() {
        let right = <a className="small" href='#' onClick={this.newRole}>新增</a>;
        let header = <LMR className="px-3 small bg-light" left="角色" right={right} />;
        return <Page header="用户角色">
            <LMR
                className="my-3 px-3 py-2 bg-white" 
                left={'用户'}
                right={String(store.memberCount)}
                onClick={this.allUsersClick}>
                <div className={midClassName}>
                    设置用户角色
                </div>
            </LMR>
            <List
                header={header}
                items={store.roles}
                none="[无]"
                item={{render:this.renderRole, onClick:this.roleClick}} />
        </Page>
    }
}
