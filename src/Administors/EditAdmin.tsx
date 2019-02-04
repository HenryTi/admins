import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page, Schema, UiSchema, ItemSchema, UiCheckItem, UiButton, ButtonSchema, Form, Context} from 'tonva-tools';
import {store} from '../store';
import { UnitAdmin } from '../model/index';
//import {mainApi} from '../api';
//, ValidForm, FormSchema, FormFields, Field

@observer
export default class EditAdmin extends React.Component {
    private schema:Schema;
    private uiSchema: UiSchema;

    private async onSubmit(name:string, context:Context) {
        let {isOwner, isAdmin} = context.form.data;
        await store.admins.unitSetAdmin(isOwner, isAdmin);
        nav.pop();
    }
    componentWillMount() {
        let {unit} = store;
        let {isRoot, isOwner, isAdmin} = unit;
        let unitAdmin = store.admins.cur;
        let owner:ItemSchema = {name: 'isOwner', type: 'boolean'};
        let admin:ItemSchema = {name: 'isAdmin', type: 'boolean'};
        let submit:ButtonSchema = {name: 'submit', type: 'submit'};
        if (isRoot === 1) this.schema = [owner, admin, submit];
        else if (isOwner === 1) this.schema = [admin, submit];

        this.uiSchema = {
            items: {
                'isOwner': {widget: 'checkbox', label: '高管', trueValue:1, falseValue:0} as UiCheckItem,
                'isAdmin': {widget: 'checkbox', label: '管理员', trueValue:1, falseValue:0} as UiCheckItem,
                'submit': {widget: 'button', label: '提交'} as UiButton,
            }
        };
        /*
        let fields: Field[] = [];
        let ownerField: Field = {
            type: 'checkbox',
            name: 'isOwner',
            label: '高管',
            defaultValue: unitAdmin.isOwner,
        };
        let adminField: Field = {
            type: 'checkbox',
            name: 'isAdmin',
            label: '管理员',
            defaultValue: unitAdmin.isAdmin,
        };
        if (isRoot === 1) {
            fields.push(ownerField);
            fields.push(adminField);
        }
        else if (isOwner === 1) {
            fields.push(adminField);
        }        
        this.schema = new FormSchema({
            fields: fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        });
        */
    }
    render() {
        return <Page header='权限'>
            <Fellow {...store.admins.cur} />
            <Form schema={this.schema} uiSchema={this.uiSchema} onButtonClick={this.onSubmit} />
        </Page>;
    }
}

const Fellow = (props:UnitAdmin) => {
    let {name, nick, icon} = props;
    return <div className="container">
        <div className='row my-4'>
            <div className="col-xs-2 d-flex justify-content-end align-items-start">
                <img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
            </div>
            <div className="col-xs-auto">
                <h4 className='text-dark'>{name}</h4>
                <h6><small className='text-secondary'>{nick}</small></h6>
                <div className='text-info'>设置成员权限</div>
            </div>
        </div>
        <hr className='mb-4' />
    </div>;
}
