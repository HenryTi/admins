var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page, Form, resLang, Controller, VPage } from '../ui';
import userApi from './userApi';
import '../css/va-form.css';
import { registerRes } from './res';
import { tonvaTop, getSender } from './tools';
/*
class AccountInput extends TextWidget {
    @observable private buttonDisabled: boolean = true;
    private onClick = () => {
        let {onButtonClick} = this.context.form.props;
        if (onButtonClick === undefined) return;
        onButtonClick(this.name, this.context);
    }
    protected onChange(evt: React.ChangeEvent<any>) {
        this.buttonDisabled = (evt.target.value.trim().length === 0);
    }
    render() {
        return <>
            <div className="input-group">
                <input ref={input=>this.input = input}
                            className="form-control"
                            type={this.inputType}
                            defaultValue={this.value}
                            onChange={(evt: React.ChangeEvent<any>) => this.onChange(evt)}
                            placeholder='手机号/邮箱'
                            readOnly={this.readOnly}
                            disabled={this.disabled}
                            onKeyDown = {this.onKeyDown}
                            onFocus = {(evt: React.FocusEvent<any>) => this.onFocus(evt)}
                            onBlur={(evt: React.FocusEvent<any>) => this.onBlur(evt)}
                            maxLength={(this.itemSchema as StringSchema).maxLength} />
                <div className="input-group-append">
                    <button className="btn btn-sm btn-outline-primary"
                        type="button" disabled={this.buttonDisabled}
                        onClick={this.onClick}>
                        <small>发送验证码</small>
                    </button>
                </div>
            </div>
            {this.renderErrors()}
        </>;
    }
}
*/
export class RegisterController extends Controller {
    constructor() {
        super(...arguments);
        this.accountPageCaption = '账号密码';
        this.accountLabel = '注册账号';
        this.accountSubmitCaption = '注册新账号';
        this.passwordPageCaption = '账号密码';
        this.passwordSubmitCaption = '注册新账号';
        this.successText = '注册成功';
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openVPage(AccountPage);
        });
    }
    toVerify(account) {
        this.account = account;
        this.openVPage(VerifyPage);
    }
    toPassword() {
        this.openVPage(PasswordPage);
    }
    toSuccess() {
        this.openVPage(RegSuccess);
    }
    login() {
        userApi
            .login({ user: this.account, pwd: this.password, guest: nav.guest })
            .then((retUser) => __awaiter(this, void 0, void 0, function* () {
            if (retUser === undefined) {
                alert('something wrong!');
                return;
            }
            yield nav.logined(retUser);
        }));
    }
    regReturn(registerReturn) {
        let msg;
        switch (registerReturn) {
            default: throw 'unknown return';
            case 0:
                return;
            case 1:
                msg = '用户名 ' + this.account;
                break;
            case 2:
                msg = '手机号 +' + this.account;
                break;
            case 3:
                msg = '邮箱 ' + this.account;
                break;
        }
        return msg + ' 已经被注册过了';
    }
    checkAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield userApi.isExists(this.account);
            let error = this.accountError(ret);
            if (error !== undefined)
                return error;
            ret = yield userApi.setVerify(this.account, this.type);
            this.toVerify(this.account);
            return;
        });
    }
    accountError(isExists) {
        if (isExists > 0)
            return '已经被注册使用了';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                nick: undefined,
                user: this.account,
                pwd: this.password,
                country: undefined,
                mobile: undefined,
                email: undefined,
                verify: this.verify
            };
            switch (this.type) {
                case 'mobile':
                    params.mobile = this.account;
                    break;
                case 'email':
                    params.email = this.account;
                    break;
            }
            let ret = yield userApi.register(params);
            if (ret === 0) {
                nav.clear();
                this.toSuccess();
                return;
            }
            return this.regReturn(ret);
        });
    }
}
export class ForgetController extends RegisterController {
    constructor() {
        super(...arguments);
        this.accountPageCaption = '密码找回';
        this.accountLabel = '账号';
        this.accountSubmitCaption = '注册新账号';
        this.passwordPageCaption = '重置密码';
        this.passwordSubmitCaption = '提交';
        this.successText = '成功修改密码';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield userApi.resetPassword(this.account, this.password, this.verify, this.type);
            nav.clear();
            this.toSuccess();
            return undefined;
            //return this.regReturn(ret);
        });
    }
    accountError(isExists) {
        if (isExists === 0)
            return '请输入正确的账号';
    }
}
class AccountPage extends VPage {
    constructor() {
        super(...arguments);
        this.schema = [
            { name: 'user', type: 'string', required: true, maxLength: 100 },
            { name: 'verify', type: 'submit' },
        ];
        this.res = resLang(registerRes);
        this.page = () => {
            return React.createElement(Page, { header: this.controller.accountPageCaption },
                React.createElement("div", { className: "w-max-20c my-5 py-5", style: { marginLeft: 'auto', marginRight: 'auto' } },
                    tonvaTop(),
                    React.createElement("div", { className: "h-3c" }),
                    React.createElement(Form, { schema: this.schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, onEnter: this.onEnter, requiredFlag: false })));
        };
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            context.clearContextErrors();
            let user = 'user';
            let value = context.getValue(user);
            let sender = getSender(value);
            if (sender === undefined) {
                context.setError(user, '必须是手机号或邮箱');
                return;
            }
            let type = sender.type;
            if (type === 'mobile') {
                if (value.length !== 11 || value[0] !== '1') {
                    context.setError(user, '请输入正确的手机号');
                    return;
                }
            }
            this.controller.account = value;
            this.controller.type = type;
            let ret = yield this.controller.checkAccount();
            if (ret !== undefined)
                context.setError(user, ret);
        });
        this.onEnter = (name, context) => __awaiter(this, void 0, void 0, function* () {
            if (name === 'user') {
                return yield this.onSubmit('verify', context);
            }
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uiSchema = {
                items: {
                    user: {
                        widget: 'text',
                        label: this.controller.accountLabel,
                        placeholder: '手机号或邮箱',
                    },
                    verify: { widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '发送验证码' },
                }
            };
            this.openPage(this.page);
        });
    }
}
class VerifyPage extends VPage {
    constructor() {
        super(...arguments);
        this.schema = [
            { name: 'verify', type: 'number', required: true, maxLength: 6 },
            { name: 'submit', type: 'submit' },
        ];
        this.onVerifyChanged = (context, value, prev) => {
            context.setDisabled('submit', !value || (value.length != 6));
        };
        this.uiSchema = {
            items: {
                verify: {
                    widget: 'text',
                    label: '验证码',
                    placeholder: '请输入验证码',
                    onChanged: this.onVerifyChanged,
                },
                submit: {
                    widget: 'button',
                    className: 'btn btn-primary btn-block mt-3',
                    label: '下一步 >',
                    disabled: true
                },
            }
        };
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let verify = this.controller.verify = context.getValue('verify');
            let ret = yield userApi.checkVerify(this.controller.account, verify);
            if (ret === 0) {
                context.setError('verify', '验证码错误');
                return;
            }
            this.controller.toPassword();
        });
        this.onEnter = (name, context) => __awaiter(this, void 0, void 0, function* () {
            if (name === 'verify') {
                return yield this.onSubmit('submit', context);
            }
        });
        this.page = () => {
            let typeText, extra;
            switch (this.controller.type) {
                case 'mobile':
                    typeText = '手机号';
                    break;
                case 'email':
                    typeText = '邮箱';
                    extra = React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "text-danger" }, "\u6CE8\u610F"),
                        ": \u6709\u53EF\u80FD\u8BEF\u4E3A\u5783\u573E\u90AE\u4EF6\uFF0C\u8BF7\u68C0\u67E5",
                        React.createElement("br", null));
                    break;
            }
            return React.createElement(Page, { header: "\u9A8C\u8BC1\u7801" },
                React.createElement("div", { className: "w-max-20c my-5 py-5", style: { marginLeft: 'auto', marginRight: 'auto' } },
                    "\u9A8C\u8BC1\u7801\u5DF2\u7ECF\u53D1\u9001\u5230",
                    typeText,
                    React.createElement("br", null),
                    React.createElement("div", { className: "py-2 px-3 my-2 text-primary bg-light" },
                        React.createElement("b", null, this.controller.account)),
                    extra,
                    React.createElement("div", { className: "h-1c" }),
                    React.createElement(Form, { schema: this.schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, onEnter: this.onEnter, requiredFlag: false })));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
class PasswordPage extends VPage {
    constructor() {
        super(...arguments);
        this.schema = [
            { name: 'pwd', type: 'string', required: true, maxLength: 100 },
            { name: 'rePwd', type: 'string', required: true, maxLength: 100 },
            { name: 'submit', type: 'submit' },
        ];
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let values = context.form.data;
            let { pwd, rePwd } = values;
            if (!pwd || pwd !== rePwd) {
                context.setValue('pwd', '');
                context.setValue('rePwd', '');
                return '密码错误，请重新输入密码！';
            }
            this.controller.password = pwd;
            return yield this.controller.execute();
        });
        this.onEnter = (name, context) => __awaiter(this, void 0, void 0, function* () {
            if (name === 'rePwd') {
                return yield this.onSubmit('submit', context);
            }
        });
        this.page = () => {
            return React.createElement(Page, { header: this.controller.passwordPageCaption },
                React.createElement("div", { className: "w-max-20c my-5 py-5", style: { marginLeft: 'auto', marginRight: 'auto' } },
                    "\u6CE8\u518C\u8D26\u53F7",
                    React.createElement("br", null),
                    React.createElement("div", { className: "py-2 px-3 my-2 text-primary bg-light" },
                        React.createElement("b", null, this.controller.account)),
                    React.createElement("div", { className: "h-1c" }),
                    React.createElement(Form, { schema: this.schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, onEnter: this.onEnter, requiredFlag: false })));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uiSchema = {
                items: {
                    pwd: { widget: 'password', placeholder: '密码', label: '密码' },
                    rePwd: { widget: 'password', placeholder: '重复密码', label: '重复密码' },
                    submit: { widget: 'button', className: 'btn btn-primary btn-block mt-3', label: this.controller.passwordSubmitCaption },
                }
            };
            this.openPage(this.page);
        });
    }
}
class RegSuccess extends VPage {
    constructor() {
        super(...arguments);
        this.page = () => {
            const { account, successText } = this.controller;
            return (React.createElement(Page, { header: false },
                React.createElement("div", { className: "container w-max-30c" },
                    React.createElement("form", { className: "my-5" },
                        React.createElement("div", { className: "py-5" },
                            "\u8D26\u53F7 ",
                            React.createElement("strong", { className: "text-primary" },
                                account,
                                " "),
                            " ",
                            successText,
                            "\uFF01"),
                        React.createElement("button", { className: "btn btn-success btn-block", onClick: () => this.controller.login() }, "\u76F4\u63A5\u767B\u5F55")))));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=register.js.map