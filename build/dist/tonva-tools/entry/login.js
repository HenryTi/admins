var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page, Form, resLang } from '../ui';
import RegisterView from './register';
import Forget from './forget';
import userApi from './userApi';
import { loginRes } from './res';
const logo = require('../img/logo.svg');
const schema = [
    { name: 'username', type: 'string', required: true, maxLength: 100 },
    { name: 'password', type: 'string', required: true, maxLength: 100 },
    { name: 'login', type: 'submit' },
];
export default class Login extends React.Component {
    constructor() {
        super(...arguments);
        this.res = resLang(loginRes);
        this.uiSchema = {
            items: {
                username: { placeholder: '用户名', label: '用户' },
                password: { widget: 'password', placeholder: '密码', label: '密码' },
                login: { widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '登录' },
            }
        };
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
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let values = context.form.data;
            let un = values['username'];
            let pwd = values['password'];
            if (pwd === undefined) {
                return 'something wrong, pwd is undefined';
            }
            let user = yield userApi.login({
                user: un,
                pwd: pwd,
                guest: nav.guest,
            });
            if (user === undefined)
                return '用户名或密码错！';
            console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
            yield nav.logined(user);
        });
    }
    click() {
        nav.replace(React.createElement(RegisterView, null));
    }
    render() {
        let footer = React.createElement("div", { className: 'text-center' },
            React.createElement("button", { className: "btn btn-link", color: "link", style: { margin: '0px auto' }, onClick: () => nav.push(React.createElement(RegisterView, null)) }, "\u5982\u679C\u6CA1\u6709\u8D26\u53F7\uFF0C\u8BF7\u6CE8\u518C"));
        let header = false;
        let top = React.createElement(React.Fragment, null,
            React.createElement("span", { className: "text-primary" }, "\u540C"),
            "\u00A0",
            React.createElement("span", { className: "text-danger" }, "\u82B1"));
        if (this.props.withBack === true) {
            header = '登录';
            top = React.createElement(React.Fragment, null, "\u767B\u5F55\u7528\u6237");
        }
        return React.createElement(Page, { header: header, footer: footer },
            React.createElement("div", { style: {
                    maxWidth: '25em',
                    margin: '3em auto',
                    padding: '0 3em',
                } },
                React.createElement("div", { className: 'container', style: { display: 'flex', position: 'relative' } },
                    React.createElement("img", { className: 'App-logo', src: logo, style: { height: '60px', position: 'absolute' } }),
                    React.createElement("span", { style: { flex: 1,
                            fontSize: 'x-large',
                            alignSelf: 'center',
                            textAlign: 'center',
                            margin: '10px',
                        } }, top)),
                React.createElement("div", { style: { height: '20px' } }),
                React.createElement(Form, { schema: schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, requiredFlag: false }),
                React.createElement("button", { className: "btn btn-link btn-block", onClick: () => nav.push(React.createElement(Forget, null)) }, "\u5FD8\u8BB0\u5BC6\u7801")));
    }
}
//# sourceMappingURL=login.js.map