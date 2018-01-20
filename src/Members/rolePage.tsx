import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, Media, LMR, FA, TonvaForm, SubmitResult, FormRow, 
    PropGrid, Prop, Badge, StackedFA} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {StringValueEdit} from '../tools';
import {Role, UnitApp} from '../model';
import {store} from '../store';

@observer
export class RolePage extends React.Component {
    async componentDidMount() {
        await store.loadApps();
        await store.loadRoleApps();
    }
    private editRole() {
        nav.push(<EditRole />);
    }
    private renderRoleApp(app:UnitApp, index:number) {
        return <LMR className="py-2 px-3 align-items-center"
                left={app.name}
                right={<small className="text-muted">{app.discription}</small>} />
    }
    private roleAppClick(app:UnitApp) {

    }
    private addRoleApp() {
        nav.push(<RoleApps />);        
    }
    render() {
        let {name, discription, count} = store.role;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={undefined} main={name} discription={discription} />,
                onClick: this.editRole,
            },
            '',
            {
                type: 'component', 
                component: <LMR className="py-2"
                    left={
                        count===undefined || count === 0 ?
                            <small className="text-muted">无用户</small>:
                            '共有 ' + count + ' 用户'
                    }
                    right={<div><FA name="chevron-right" /></div>} />,
                onClick: this.editRole,
            },
            '=',
        ];
        let right = <Button color='success' size='sm' onClick={()=>this.addRoleApp()}><FA name="plus" /> APP</Button>;
        return <Page header="角色" right={right}>
            <PropGrid rows={rows} values={{}} />
            <div className="px-3 py-1"><small><FA name="angle-double-right" /> 可用APP列表</small></div>
            <List
                items={store.roleApps} 
                item={{render: this.renderRoleApp, onClick:this.roleAppClick}}
                none={<small className="text-muted">没有APP, 点击右上角按钮选择APP</small>} />
        </Page>
    }
}

@observer
class EditRole extends React.Component {
    async onNameChanged(value:any, orgValue:any):Promise<void> {
        await store.roleChangeProp('name', value);
    }
    async onDiscriptionChanged(value:any, orgValue:any):Promise<void> {
        await store.roleChangeProp('discription', value);
    }
    render() {
        let role = store.role;
        let {id} = role;
        let isSysRole = id === 1 || id === 2;
        let rows:Prop[] = [
            '',
            {
                label: '名称', 
                type: 'string',
                name: 'name', 
                onClick: isSysRole? undefined : ()=>nav.push(<StringValueEdit 
                    title="修改名称"
                    value={role.name}
                    onChanged={this.onNameChanged} 
                    info="好的名字便于理解" />)
            },
            {
                label: '描述',
                type: 'string',
                name: 'discription',
                onClick: isSysRole? undefined : ()=>nav.push(<StringValueEdit 
                    title="修改描述"
                    value={role.discription}
                    onChanged={this.onDiscriptionChanged} 
                    info="对角色做一个说明" />)
            },
        ];
        return <Page header="修改角色信息">
            <PropGrid rows={rows} values={role} alignValue="right" />
        </Page>;
    }
}

@observer
class RoleApps extends React.Component {
    private list:List;
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    async componentDidMount() {
        await store.loadApps();
        await store.loadRoleApps();
    }
    private renderApp(app:UnitApp, index:number) {
        return <LMR className="py-1 px-2 align-items-center"
                left={app.name}
                right={<small className="text-muted">{app.discription}</small>} />
    }
    private appSelect(app:UnitApp, isSelected: boolean, anySelected: boolean) {

    }
    private async submit() {
        await store.setRoleApps(this.list.selectedItems);
        nav.pop();
    }
    render() {
        let right = <Button color="success" size="sm" onClick={this.submit}>保存</Button>;
        let apps = store.apps;
        let roleApps = store.roleApps;
        return <Page header="选择APP" right={right}>
            <List 
                ref={list=>this.list=list}
                items={apps}
                selectedItems={roleApps}
                item={{render: this.renderApp, onSelect: this.appSelect}} />
        </Page>;
    }
}