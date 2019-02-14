import * as React from 'react';
import {nav, Page, Schema, UiSchema, UiTextItem, UiPasswordItem, UiButton, Form, Context, resLang, StringSchema} from '../ui';
import LoginView from './login';
import userApi from './userApi';
import RegSuccess from './regSuccess';
import '../css/va-form.css';
import { RegisterRes, registerRes } from './res';
const logo = require('../img/logo.svg');

export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}

const schema: Schema = [
    {name: 'user', type: 'string', required: true, maxLength: 100} as StringSchema,
    {name: 'pwd', type: 'string', required: true, maxLength: 100} as StringSchema,
    {name: 'rePwd', type: 'string', required: true, maxLength: 100} as StringSchema,
    {name: 'register', type: 'submit'},
]

export default class Register extends React.Component {
    private res: RegisterRes = resLang(registerRes);
    private uiSchema: UiSchema = {
        items: {
            user: {placeholder: '用户名', label: '用户名'} as UiTextItem, 
            pwd: {widget: 'password', placeholder: '密码', label: '密码'} as UiPasswordItem,
            rePwd: {widget: 'password', placeholder: '重复密码', label: '重复密码'} as UiPasswordItem,
            register: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '注册新用户'} as UiButton,
        }
    }
        
    /*
    private schema:FormSchema = new FormSchema({
        fields: [
            {
                type: 'string',
                name: 'user',
                placeholder: '用户名',
                rules: ['required', 'maxlength:100']
            },
            {
                type: 'password',
                name: 'pwd',
                placeholder: '密码',
                rules: ['required', 'maxlength:100']
            },
            {
                type: 'password',
                name: 'rePwd',
                placeholder: '重复密码',
                rules: ['required', 'maxlength:100']
            },
        ],
        submitText: '注册新用户',
        onSumit: this.onSubmit.bind(this),
    });
    */
    async onSubmit(name:string, context:Context):Promise<string> {
        /*
        let user = await userApi.login({
            user: values['username'], 
            pwd: values['password']
        });
        if (user === undefined) {
            //this.failed();
            this.schema.clear();
            this.schema.errors.push('用户名或密码错！');
        } else {
            nav.logined(user);
        }
        return undefined;*/
        //const {user, pwd, rePwd, country, mobile, email} = this.state.values;
        let values = context.form.data;
        let {user, pwd, rePwd, country, mobile, email} = values;
        if (pwd !== rePwd) {
            context.setValue('pwd', '');
            context.setValue('rePwd', '');
            return '密码不对，请重新输入密码！';
            //this.schema.errors.push('密码不对，请重新输入密码！');
            //this.schema.inputs['pwd'].clear();
            //this.schema.inputs['rePwd'].clear();
            //return undefined;
        }
        let ret = await userApi.register({
            nick: undefined,
            user: user, 
            pwd: pwd,
            country: undefined,
            mobile: undefined,
            email: undefined,
        });
        let msg:any;
        switch (ret) {
            default: throw 'unknown return';
            case 0:
                nav.clear();
                nav.show(<RegSuccess user={user} pwd={pwd} />);
                return;
            case 1:
                msg = '用户名 ' + user;
                break;
            case 2:
                msg = '手机号 +' + country + ' ' + mobile;
                break;
            case 3:
                msg = '电子邮件 ' + email;
                break;
        }
        return msg + ' 已经被注册过了';
        //return undefined;
    }
    click() {
        nav.replace(<LoginView />);
        //nav.replace(<RegisterView />);
    }

    render() {
        return <Page header='注册'>
            <div style={{
                maxWidth:'25em',
                margin: '3em auto',
                padding: '0 3em',
            }}>
                <div className='container' style={{display:'flex', position:'relative'}}>
                    <img className='App-logo' src={logo} style={{height:'60px', position:'absolute'}}/>
                    <span style={{flex:1,
                        fontSize: 'x-large',
                        alignSelf: 'center',
                        textAlign: 'center',
                        margin: '10px',
                    }}>同花</span>
                </div>
                <div style={{height:'20px'}} />
                <Form schema={schema} uiSchema={this.uiSchema} onButtonClick={this.onSubmit} requiredFlag={false} />
            </div>
        </Page>;
    }
}
// <ValidForm formSchema={this.schema}  />
