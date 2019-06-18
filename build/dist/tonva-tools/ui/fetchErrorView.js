var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { refetchApi } from '../net';
export default class FetchErrorView extends React.Component {
    constructor() {
        super(...arguments);
        this.reApi = () => __awaiter(this, void 0, void 0, function* () {
            this.props.clearError();
            const { channel, url, options, resolve, reject } = this.props;
            yield refetchApi(channel, url, options, resolve, reject);
        });
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            this.props.clearError();
        });
    }
    render() {
        let { error, url } = this.props;
        //let errMsg = fetchError.errorMsg;
        let errContent;
        if (typeof error === 'object') {
            let err = [];
            for (let i in error) {
                err.push(React.createElement("li", { key: i },
                    React.createElement("label", null, i),
                    React.createElement("div", null, error[i])));
            }
            errContent = React.createElement("ul", null, err);
        }
        else {
            errContent = React.createElement("div", null, error);
        }
        return React.createElement("li", null,
            React.createElement("article", { className: "page-container" },
                React.createElement("section", null,
                    React.createElement("div", { className: "va-error" },
                        React.createElement("div", null, "\u7F51\u7EDC\u51FA\u73B0\u95EE\u9898"),
                        React.createElement("div", null, "\u70B9\u51FB\u91CD\u65B0\u8BBF\u95EE"),
                        React.createElement("div", null,
                            "url: ",
                            url),
                        errContent,
                        React.createElement("div", { className: "p-3" },
                            React.createElement("button", { type: 'button', onClick: this.reApi }, "\u91CD\u65B0API"),
                            React.createElement("button", { type: 'button', onClick: this.close }, "\u5173\u95ED"))))));
    }
}
//# sourceMappingURL=fetchErrorView.js.map