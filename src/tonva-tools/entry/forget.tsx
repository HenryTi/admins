import * as React from 'react';
import {Page} from '../ui';

export default class Forget extends React.Component<{}, null> {
    render() {
        return <Page header='找回密码'>
            正在设计中...
        </Page>;
    }
}
/*
export class ForgetController extends Controller {
    account:string;
    type:'mobile'|'email';
    protected async internalStart() {
        this.openVPage(FirstPage);
    }

    toVerify(account:string) {
        this.account = account;
        this.openVPage(VerifyPage);
    }
}

class FirstPage extends VPage<ForgetController> {
    private schema: Schema = [
        {name: 'user', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'verify', type: 'submit'},
    ]

    private uiSchema: UiSchema = {
        items: {
            user: {
                widget: 'text',
                label: '账号',
                placeholder: '手机号或邮箱',
            } as UiTextItem, 
            verify: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '发送验证码'} as UiButton,
        }
    }
            
    //protected res: RegisterRes = resLang(registerRes);
    async open() {
        this.openPage(this.page);
    }

    private page = ():JSX.Element => {
        return <Page header="账号注册">
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                {tonvaTop}
                <div className="h-3c" />
                <Form schema={this.schema} uiSchema={this.uiSchema} onButtonClick={this.onSubmit} requiredFlag={false} />
            </div>
        </Page>;
    }

    private onSubmit = async (name:string, context:Context):Promise<string> => {
        context.clearContextErrors();
        let user = 'user';
        let value = context.getValue(user);
        let sender = getSender(value);
        if (sender === undefined) {
            context.setError(user, '必须是手机号或邮箱');
            return;
        }
        let type:'mobile'|'email' = sender.type as 'mobile'|'email';
        if (type === 'mobile') {
            if (value.length !== 11 || value[0] !== '1') {
                context.setError(user, '请输入正确的手机号');
                return;
            }
        }
        this.controller.type = type;
        let ret = await userApi.isExists(value);
        if (ret===0) {
            context.setError(user, '请输入正确的账号');
            return;
        }
        await userApi.setVerify(value, type);
        this.controller.toVerify(value);
    }
}

class VerifyPage extends VPage<ForgetController> {
    private schema: Schema = [
        {name: 'verify', type: 'number', required: true, maxLength: 6} as NumSchema,
        {name: 'submit', type: 'submit'},
    ]

    private onVerifyChanged = (context:Context, value:any, prev:any) => {
        context.setDisabled('submit', !value || (value.length != 6));
    }
    private uiSchema: UiSchema = {
        items: {
            verify: {
                widget: 'text',
                label: '验证码',
                placeholder: '请输入验证码',
                onChanged: this.onVerifyChanged,
            } as UiTextItem, 
            submit: {
                widget: 'button', 
                className: 'btn btn-primary btn-block mt-3', 
                label: '下一步 >',
                disabled: true
            } as UiButton,
        }
    }
    async open() {
        this.openPage(this.page);
    }
    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let ret = await userApi.checkVerify(this.controller.account, context.getValue('verify'));
        if (ret === 0) {
            context.setError('verify', '验证码错误');
            return;
        }
        this.controller.toPassword();
    }
    private page = ():JSX.Element => {
        let typeText:string, extra:any;
        switch (this.controller.type) {
            case 'mobile': typeText = '手机号'; break;
            case 'email': 
                typeText = '邮箱'; 
                extra = <><span className="text-danger">注意</span>: 有可能误为垃圾邮件，请检查<br/></>;
                break;
        }
        return <Page header="验证码">
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                验证码已经发送到{typeText}<br/>
                <div className="py-2 px-3 my-2 text-primary bg-light"><b>{this.controller.account}</b></div>
                {extra}
                <div className="h-1c" />
                <Form schema={this.schema} uiSchema={this.uiSchema} 
                    onButtonClick={this.onSubmit} requiredFlag={false} />
            </div>
        </Page>
    }
}

class PasswordPage extends VPage<ForgetController> {
    private schema: Schema = [
        {name: 'pwd', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'rePwd', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'submit', type: 'submit'},
    ]

    private uiSchema: UiSchema = {
        items: {
            pwd: {widget: 'password', placeholder: '密码', label: '密码'} as UiPasswordItem,
            rePwd: {widget: 'password', placeholder: '重复密码', label: '重复密码'} as UiPasswordItem,
            submit: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '注册新账号'} as UiButton,
        }
    }
    async open() {
        this.openPage(this.page);
    }
    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let values = context.form.data;
        let {pwd, rePwd} = values;
        if (pwd !== rePwd) {
            context.setValue('pwd', '');
            context.setValue('rePwd', '');
            return '密码错误，请重新输入密码！';
        }
        let {account, type} = this.controller;
        let params = {
            nick: undefined,
            user: account, 
            pwd: pwd,
            country: undefined,
            mobile: undefined,
            email: undefined,
        }
        switch (type) {
            case 'mobile': params.mobile = account; break;
            case 'email': params.email = account; break;
        }
        let ret = await userApi.register(params);
        if (ret === 0) {
            nav.clear();
            this.controller.toSuccess();
            return;
        }
        return this.controller.regReturn(ret);
    }
    private page = ():JSX.Element => {
        return <Page header="账号密码">
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                注册账号<br/>
                <div className="py-2 px-3 my-2 text-primary bg-light"><b>{this.controller.account}</b></div>
                <div className="h-1c" />
                <Form schema={this.schema} uiSchema={this.uiSchema}                    
                    onButtonClick={this.onSubmit} requiredFlag={false} />
            </div>
        </Page>
    }
}
*/