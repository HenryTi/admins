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
import { RegisterController, ForgetController } from './register';
import { userApi } from './userApi';
import { loginRes } from './res';
import { tonvaTop, getSender } from './tools';
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
                username: { placeholder: '手机/邮箱/用户名', label: '登录账号' },
                password: { widget: 'password', placeholder: '密码', label: '密码' },
                login: { widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '登录' },
            }
        };
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
            if (user === undefined) {
                let sender = getSender(un);
                let type = sender !== undefined ? sender.caption : '用户名';
                return type + '或密码错！';
            }
            console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
            yield nav.logined(user, this.props.callback);
        });
        this.onEnter = (name, context) => __awaiter(this, void 0, void 0, function* () {
            if (name === 'password') {
                return yield this.onSubmit('login', context);
            }
        });
        this.clickReg = () => {
            //nav.replace(<RegisterView />);
            let register = new RegisterController(undefined);
            register.start();
        };
        this.clickForget = () => {
            let forget = new ForgetController(undefined);
            forget.start();
        };
    }
    render() {
        let footer = React.createElement("div", { className: 'text-center' },
            React.createElement("button", { className: "btn btn-link", color: "link", style: { margin: '0px auto' }, onClick: this.clickReg }, "\u6CE8\u518C\u8D26\u53F7"));
        let header = false;
        if (this.props.withBack === true) {
            header = '登录';
        }
        return React.createElement(Page, { header: header, footer: footer },
            React.createElement("div", { className: "d-flex h-100 flex-column justify-content-center align-items-center" },
                React.createElement("div", { className: "flex-fill" }),
                React.createElement("div", { className: "w-20c" },
                    tonvaTop(),
                    React.createElement("div", { className: "h-2c" }),
                    React.createElement(Form, { schema: schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, onEnter: this.onEnter, requiredFlag: false }),
                    React.createElement("button", { className: "btn btn-link btn-block", onClick: () => this.clickForget() }, "\u5FD8\u8BB0\u5BC6\u7801")),
                React.createElement("div", { className: "flex-fill" }),
                React.createElement("div", { className: "flex-fill" })));
    }
}
//# sourceMappingURL=login.js.map