import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, ValidForm, Field, FormFields, FormSchema} from 'tonva-tools';
import {FormRow, FormView, TonvaForm, DropdownActions, Action, List} from 'tonva-react-form';
import consts from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {ObjItems} from '../store/dev';

export interface ObjViewProps<T extends DevModel.ObjBase> {
    title: string;
    fields: Field[];
    //converter: (item:T)=>ListItem;
    row: (item:T)=>JSX.Element;
    items: ObjItems<T>;
    repeated: {name:string; err:string};
    info: new (props:any) => React.Component;
    extraMenuActions?: Action[];
    formRows?: FormRow[];
}

@observer
export default class DevObjs<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    constructor(props) {
        super(props);
        this.itemClick = this.itemClick.bind(this);
    }
    async componentDidMount() {
        await this.props.items.load();
    }
    //converter(item:T):ListItem {
    //    return this.props.converter(item);
    //}
    newItem() {
        this.props.items.cur = undefined;
        nav.push(<New {...this.props} />);
    }
    itemClick(item:T) {
        this.props.items.cur = item;
        nav.push(<Info {...this.props} />);
    }
    render() {
        let {title, items} = this.props;
        let right = <Button color='success' size='sm' onClick={()=>this.newItem()}>新增{title}</Button>;
        return <Page header={title} right={right}>
            <List items={items.items}
                item={{render: this.props.row, onClick: this.itemClick}}
                // converter={this.props.converter} 
                //itemClick={this.itemClick} 
                />
        </Page>;
    }
}

class New<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    private schema:FormSchema;
    private formView: FormView;
    componentWillMount() {
        this.schema = new FormSchema({
            fields: this.props.fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        });
        this.formView = new FormView({
            formRows: this.props.formRows,
            onSubmit: this.onSubmit.bind(this),
        }, this.props.items.cur);
    }
    async onSubmit(values:any) {
        let ret = await this.props.items.save(values);
        if (ret === true) {
            nav.pop();
        }
        else {
            let repeated = this.props.repeated;
            this.schema.setInputError(repeated.name, repeated.err);
        }
    }
    render() {
        return <Page header={'新增'+this.props.title}>
            <TonvaForm formView={this.formView} />
        </Page>
    }
}

class Info<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    private menuItems = [
        {caption:'修改' + this.props.title, action:this.editItem.bind(this), icon:'edit' },
        {caption:'删除', action:this.deleteItem.bind(this), icon:'trash-o' }
    ];
    async deleteItem() {
        if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
            await this.props.items.del();
            nav.pop();
        }
    }
    editItem() {
        nav.push(<Edit {...this.props} />);
    }
    render() {
        let actions = [];
        let ex = this.props.extraMenuActions;
        if (ex !== undefined) actions.push(...ex);
        actions.push(...this.menuItems);
        let right = <DropdownActions actions={actions} />
        return <Page header={'详细资料'} right={right}>
            <this.props.info {...this.props.items.cur} />
        </Page>;
    }
}

class Edit<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    private actions = [
        {caption:'删除', action:this.deleteItem.bind(this), icon:'trash-o' }
    ];
    //private schema:FormSchema;
    private formView: FormView;
    componentWillMount() {
        /*
        this.schema = new FormSchema({
            fields: this.props.fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        }, this.props.items.cur);
        */
        this.formView = new FormView({
            formRows: this.props.formRows,
            onSubmit: this.onSubmit.bind(this),
        }, this.props.items.cur);
    }
    async onSubmit(values:any) {
        await this.props.items.save(values);
        //alert(JSON.stringify(values));
        nav.pop();
    }
    async deleteItem() {
        if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
            await this.props.items.del();
            nav.pop();
        }
    }
    render() {
        let right = <DropdownActions actions={this.actions} />
        //<Button color='warning' size='sm' onClick={()=>this.deleteItem()}>删除</Button>;
        return <Page header={'编辑'+this.props.title} right={right} close={true}>
            <TonvaForm formView={this.formView} />
        </Page>;
        // <ValidForm className='mt-4' formSchema={this.schema} />
    }
}
