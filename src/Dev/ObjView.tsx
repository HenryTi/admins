import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page, ValidForm, Field, FormFields, FormSchema, ListView, ListItem, rowIcon} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {List} from '../store/dev';

export interface ObjViewProps<T extends DevModel.ObjBase> {
    title: string;
    fields: Field[];
    converter: (item:T)=>ListItem;
    items: List<T>;
    repeated: {name:string; err:string};
}
/*
interface NewProps<T extends DevModel.DevBase> {
    title: string;
    fields: Field[];
    repeated: {name:string; err:string};
    items: List<T>;
}

interface EditProps<T extends DevModel.DevBase> {
    title: string;
    fields: Field[];
    repeated: {name:string; err:string};
    items: List<T>;
}
*/

@observer
export default class DevObjs<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    constructor(props) {
        super(props);
        this.itemClick = this.itemClick.bind(this);
    }
    async componentWillMount() {
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
        nav.push(<Edit {...this.props} />);
    }
    render() {
        let {title, items} = this.props;
        let right = <Button color='success' size='sm' onClick={()=>this.newItem()}>新增{title}</Button>;
        return <Page header={title} right={right}>
            <ListView items={items.items} 
                converter={this.props.converter} 
                itemClick={this.itemClick} />
        </Page>;
    }
}
/*
const appFields: Field[] = [
    {
        type: 'string',
        name: 'name',
        label: '名称',
        rules: ['required','maxlength:100'],
    },
    {
        type: 'text',
        name: 'discription',
        label: '描述',
        rules: ['maxlength:250'],
    },
    {
        type: 'string',
        name: 'icon',
        label: '图标',
        rules: ['maxlength:250'],
    },
    {
        type: 'checkbox',
        name: 'public',
        label: '公开',
        defaultValue: 0,
    },
];
*/
class New<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    private schema:FormSchema;
    componentWillMount() {
        this.schema = new FormSchema({
            fields: this.props.fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        })
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
            <ValidForm className='mt-4' formSchema={this.schema} />
        </Page>
    }
}

class Edit<T extends DevModel.ObjBase> extends React.Component<ObjViewProps<T>> {
    private schema:FormSchema;
    componentWillMount() {
        this.schema = new FormSchema({
            fields: this.props.fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        }, this.props.items.cur);
    }
    async onSubmit(values:any) {
        await this.props.items.save(values);
        nav.pop();
    }
    async deleteItem() {
        if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
            await this.props.items.del();
            nav.pop();
        }
    }
    render() {
        let right = <Button color='danger' size='sm' onClick={()=>this.deleteItem()}>删除</Button>;
        return <Page header={'编辑'+this.props.title} right={right}>
            <ValidForm className='mt-4' formSchema={this.schema} />
        </Page>
    }
}
