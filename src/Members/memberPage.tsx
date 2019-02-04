import * as React from 'react';
import {observer} from 'mobx-react';
import {List, LMR, FA, TonvaForm, SubmitResult, FormRow, Media, Muted, PropGrid, Prop} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role} from '../model';
import {store} from '../store';
import {appIcon, appItemIcon} from '../consts';
import {StringValueEdit} from '../tools';
import {RoleApps} from './roleApps';

@observer
export class MemberPage extends React.Component {
    async componentDidMount() {
        await store.loadRoles();
        await store.loadMemberRoles();
    }
    async onAssigned(value:any, orgValue:any):Promise<void> {
        await store.unitAssignMember(value);
    }
    private renderMemberRole = (role:Role) => {
        let {name, discription} = role;
        return <LMR className="py-2 px-3 align-items-center"
                left={name}
                right={<Muted>{discription}</Muted>} />
    }
    private roleClick(role:Role) {
        nav.push(<RoleApps role={role} />);
    }
    private setRole = () => {
        nav.push(<SetRole />);
    }
    render() {
        let roleUser = store.roleMember;
        let {nick, name, assigned, icon} = roleUser;
        let disp = <div>
            <div><Muted>唯一名: </Muted> &nbsp; {name}</div>
            <div><Muted>昵称: </Muted> &nbsp; {nick||<Muted>[无]</Muted>}</div>
        </div>;
        let rows:Prop[] = [
            '',
            {
                type: 'component',
                component: <Media icon={icon||appIcon} main={roleUser.assigned||nick||name} discription={disp} />
            },
            '',
            {
                label: '备注名',
                type: 'string',
                name: 'assigned',
                onClick: ()=>nav.push(<StringValueEdit 
                    title="修改备注名"
                    value={roleUser.assigned}
                    onChanged={this.onAssigned} 
                    info="加一个备注，便于甄别用户" />),
            },
            '',
        ];
        let right = <button className="btn btn-success btn-sm" onClick={this.setRole}>修改角色</button>;
        return <Page header="用户详情" right={right}>
            <PropGrid rows={rows} values={roleUser} />
            <div className="px-3 py-1"><small><FA name="angle-double-right" /> 所属角色</small></div>
            <List
                items={store.memberRoles} 
                item={{render: this.renderMemberRole, onClick: this.roleClick}} />
        </Page>
    }
}

@observer
class SetRole extends React.Component {
    private list:List;
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    async componentDidMount() {
        await store.loadRoles();
        await store.loadMemberRoles();
    }
    private renderRole(role:Role, index:number) {
        return <LMR className="py-2 px-3 align-items-center"
                left={role.name}
                right={<small className="text-muted">{role.discription}</small>} />
    }
    private roleSelect(role:Role, isSelected: boolean, anySelected: boolean) {
    }
    private async submit() {
        await store.setMemberRoles(this.list.selectedItems);
        nav.pop();
    }
    render() {
        let right = <button className="btn btn-success btn-sm" onClick={this.submit}>保存</button>;
        let roles = store.roles;
        let memberRoles = store.memberRoles;
        return <Page header="修改角色" right={right}>
            <List 
                ref={list=>this.list=list}
                items={roles}
                selectedItems={memberRoles}
                compare={(role:Role, selectRole:Role)=>role.id === selectRole.id}
                item={{render: this.renderRole, onSelect: this.roleSelect}} />
        </Page>;
    }
}
