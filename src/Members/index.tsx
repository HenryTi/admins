import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, LMR, FA, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role} from '../model';
import {store} from '../store';
import {NewRole} from './newRole';
import {RolePage} from './rolePage';

@observer
export class Members extends React.Component {
    async componentDidMount() {
        await store.loadRoles();
    }
    private renderRole(role:Role, index:number) {
        let {name, discription, count} = role;
        return <LMR
            className="px-3 py-2" 
            left={name}
            right={String(count || '')}>
            <div>
            <Muted>{discription}</Muted>
            </div>
        </LMR>;
    }
    private roleClick(role:Role) {
        store.setRole(role);
        nav.push(<RolePage />)
    }
    private newRole() {
        nav.push(<NewRole />);
    }
    private allUsersClick() {
        
    }
    render() {
        let right = <Button color='secondary' size='sm' onClick={()=>this.newRole()}><FA name="plus" /></Button>;
        return <Page header="用户角色" right={right}>
            <LMR
                className="my-3 px-3 py-2 bg-white" 
                left={'用户'}
                right={String(store.memberCount)}
                onClick={this.allUsersClick}>
                <div>
                    <Muted>{'为用户设置角色'}</Muted>
                </div>
            </LMR>
            <div className="px-3 py-1"><small><FA name="angle-double-right" /> 角色列表</small></div>
            <List 
                items={store.roles} 
                item={{render:this.renderRole, onClick:this.roleClick}} />
        </Page>
    }
}
