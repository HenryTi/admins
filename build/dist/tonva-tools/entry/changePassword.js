var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Page, Form, nav } from '../ui';
import { CenterAppApi } from '../net';
export class ChangePasswordPage extends React.Component {
    constructor() {
        super(...arguments);
        this.schema = [
            { name: 'orgPassword', type: 'string', maxLength: 60, required: true },
            { name: 'newPassword', type: 'string', maxLength: 60, required: true },
            { name: 'newPassword1', type: 'string', maxLength: 60, required: true },
            { name: 'submit', type: 'button' }
        ];
        this.uiSchema = {
            items: {
                orgPassword: {
                    label: '原密码',
                    placeholder: '输入原来的密码'
                },
                newPassword: {
                    label: '新密码',
                    placeholder: '输入新设的密码'
                },
                newPassword1: {
                    label: '确认密码',
                    placeholder: '再次输入新设密码'
                },
                submit: {
                    widget: 'button',
                    label: '提交',
                    className: 'btn btn-primary'
                },
            }
        };
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let { orgPassword, newPassword, newPassword1 } = context.data;
            if (newPassword !== newPassword1) {
                context.setError('newPassword1', '新密码错误，请重新输入');
                return;
            }
            let centerAppApi = new CenterAppApi('tv/', undefined);
            let ret = yield centerAppApi.changePassword({ orgPassword: orgPassword, newPassword: newPassword });
            if (ret === false) {
                context.setError('orgPassword', '原密码错误');
                return;
            }
            nav.replace(React.createElement(Page, { header: "\u4FEE\u6539\u5BC6\u7801", back: "close" },
                React.createElement("div", { className: "m-3  text-success" }, "\u5BC6\u7801\u4FEE\u6539\u6210\u529F\uFF01")));
            return;
        });
    }
    render() {
        return React.createElement(Page, { header: "\u4FEE\u6539\u5BC6\u7801" },
            React.createElement(Form, { className: "m-3", schema: this.schema, uiSchema: this.uiSchema, onButtonClick: this.onSubmit, fieldLabelSize: 2 }));
    }
}
//# sourceMappingURL=changePassword.js.map