import * as React from 'react';
import {TonvaForm, SubmitResult, FormRow} from 'tonva-react-form';
import {nav, Page, ItemSchema, StringSchema, UiSchema, Form, Context} from 'tonva-tools';
import {store} from '../store';

export class NewRole extends React.Component {
    /*
    private form:TonvaForm;
    private formRows:FormRow[] = [
        {
            label: '名称', 
            field: {name: 'name', type: 'string', maxLength: 50, required: true},
        },
        {
            label: '描述',
            field: {name: 'discription', type: 'string', maxLength: 250},
            face: {type: 'textarea'}
        },
    ];*/
    private schema: ItemSchema[] = [
        {name: 'name', type: 'string', maxLength: 5, required: true} as StringSchema,
        {name: 'discription', type: 'string', maxLength: 250},
        {name: 'submit', type: 'button'},
    ];
    private uiSchema: UiSchema = {
        items: {
            name: {widget: 'text', label: '名称'},
            discription: {widget: 'textarea', label: '描述'},
            submit: {widget:'button', label: '提交'}
        }
    }
    private onSubmit = async (buttonName:string, context: Context):Promise<SubmitResult> => {
        //let {name, discription} = values;
        let {name, discription} = this.context.formData;
        let id = await store.unitAddRole(name, discription);
        if (id <= 0) {
            this.context.setError('name', '角色名 ' + name + ' 已经存在');
            return;
        }
        nav.pop();
        return;
    }
    render() {
        return <Page header="新建角色">
            <Form className="m-3" 
                schema={this.schema} uiSchema={this.uiSchema} 
                formData={{}}
                onButtonClick={this.onSubmit} />
        </Page>;
    }
    /*
    <TonvaForm className="m-3" ref={tf => this.form = tf} 
    formRows={this.formRows} 
    onSubmit={this.onSubmit} />
    */
}
