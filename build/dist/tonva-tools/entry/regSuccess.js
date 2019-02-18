var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page } from '../ui';
import userApi from './userApi';
import '../css/va-form.css';
export default class RegSuccess extends React.Component {
    failed() {
        return;
    }
    login() {
        const { user, pwd } = this.props;
        userApi
            .login({ user: user, pwd: pwd, guest: nav.guest })
            .then((retUser) => __awaiter(this, void 0, void 0, function* () {
            if (retUser === undefined) {
                this.failed();
                return;
            }
            yield nav.logined(retUser);
        }));
    }
    render() {
        const { user, pwd } = this.props;
        return (React.createElement(Page, { header: false },
            React.createElement("div", { className: "container w-max-30c" },
                React.createElement("form", { className: "my-5" },
                    React.createElement("div", { className: "py-5" },
                        "\u7528\u6237 ",
                        React.createElement("strong", { className: "text-primary" },
                            user,
                            " "),
                        " \u6CE8\u518C\u6210\u529F\uFF01"),
                    React.createElement("button", { className: "btn btn-success btn-block", onClick: () => this.login() }, "\u76F4\u63A5\u767B\u5F55")))));
    }
}
//# sourceMappingURL=regSuccess.js.map