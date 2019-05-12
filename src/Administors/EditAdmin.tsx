import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page, Schema, UiSchema, ItemSchema, UiCheckItem, UiButton, ButtonSchema, Form, Context, Image} from 'tonva-tools';
import {store} from '../store';
import { UnitAdmin } from '../model/index';
//import {mainApi} from '../api';
//, ValidForm, FormSchema, FormFields, Field

@observer
export default class EditAdmin extends React.Component {
    private onSubmit = async (name:string, context:Context) => {
        let {isOwner, isAdmin} = context.form.data;
        await store.admins.unitSetAdmin(isOwner, isAdmin);
        nav.pop();
    }
    render() {
        let {unit} = store;
        let {isRoot, isOwner, isAdmin} = unit;
        let unitAdmin = store.admins.cur;
        let owner:ItemSchema = {name: 'isOwner', type: 'boolean'};
        let admin:ItemSchema = {name: 'isAdmin', type: 'boolean'};
        let submit:ButtonSchema = {name: 'submit', type: 'submit'};
        let schema:ItemSchema[];
        if (isRoot === 1) schema = [owner, admin, submit];
        else if (isOwner === 1) schema = [admin, submit];
        let data = {
            isOwner: unitAdmin.isOwner,
            isAdmin: unitAdmin.isAdmin,
        };

        let uiSchema = {
            items: {
                'isOwner': {widget: 'checkbox', label: '高管', trueValue:1, falseValue:0} as UiCheckItem,
                'isAdmin': {widget: 'checkbox', label: '管理员', trueValue:1, falseValue:0} as UiCheckItem,
                'submit': {widget: 'button', label: '提交', className: 'btn btn-primary'} as UiButton,
            }
        };

        return <Page header='权限'>
            <div className="px-3">
                <Fellow {...store.admins.cur} />
                <Form schema={schema} uiSchema={uiSchema} formData={data} onButtonClick={this.onSubmit} />
            </div>
        </Page>;
    }
}

const Fellow = (props:UnitAdmin) => {
    let {name, nick, icon} = props;
    //<img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
    return <div>
        <div className='d-flex my-4'>
            <Image className="w-3c h-3c mr-3" src={icon} />
            <div className="">
                <h4 className='text-dark'>{name}</h4>
                {nick && <h6><small className='text-secondary'>{nick}</small></h6>}
            </div>
        </div>
        <hr className='mb-4' />
    </div>;
}
