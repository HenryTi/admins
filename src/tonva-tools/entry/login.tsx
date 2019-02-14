import * as React from 'react';
import {nav, Page, Form, Schema, UiSchema, UiTextItem, UiPasswordItem, Context, UiButton, resLang, StringSchema} from '../ui';
import RegisterView from './register';
import Forget from './forget';
import userApi from './userApi';
import { LoginRes, loginRes } from './res';

const logo = require('../img/logo.svg');

const schema: Schema = [
    {name: 'username', type: 'string', required: true, maxLength: 100} as StringSchema,
    {name: 'password', type: 'string', required: true, maxLength: 100} as StringSchema,
    {name: 'login', type: 'submit'},
];

export default class Login extends React.Component<{withBack?:boolean}> {
    private res: LoginRes = resLang(loginRes);
    private uiSchema: UiSchema = {
        items: {
            username: {placeholder: '用户名', label: '用户'} as UiTextItem, 
            password: {widget: 'password', placeholder: '密码', label: '密码'} as UiPasswordItem,
            login: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '登录'} as UiButton,
        }
    }
    
    /*
    private schema:FormSchema = new FormSchema({
        fields: [
            {
                type: 'string',
                name: 'username',
                placeholder: '用户名',
                rules: ['required', 'maxlength:100']
            },
            {
                type: 'password',
                name: 'password',
                placeholder: '密码',
                rules: ['required', 'maxlength:100']
            },
        ],
        onSumit: this.onLoginSubmit.bind(this),
    });
    */

    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let values = context.form.data;
        let un = values['username'];
        let pwd = values['password'];
        if (pwd === undefined) {
            return 'something wrong, pwd is undefined';
        }
        let user = await userApi.login({
            user: un, 
            pwd: pwd,
            guest: nav.guest,
        });
        if (user === undefined) return '用户名或密码错！';
        console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
        await nav.logined(user);
    }
    click() {
        nav.replace(<RegisterView />);
    }
    render() {
        let footer = <div className='text-center'>
            <button className="btn btn-link" color="link" style={{margin:'0px auto'}}
                onClick={() => nav.push(<RegisterView />)}>
                如果没有账号，请注册
            </button>
        </div>;
        let header:string|boolean|JSX.Element = false;
        let top = '同花';
        if (this.props.withBack === true) {
            header = '登录';
            top = '登录用户';
        }
        return <Page header={header} footer={footer}>
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
                    }}>{top}</span>
                </div>
                <div style={{height:'20px'}} />
                <Form schema={schema} uiSchema={this.uiSchema} onButtonClick={this.onSubmit} requiredFlag={false} />
                <button className="btn btn-link btn-block"
                    onClick={() => nav.push(<Forget />)}>
                    忘记密码
                </button>
            </div>
        </Page>;
    }
}
