var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, mobileHeaderStyle } from './nav';
import { Page } from './page';
export class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutClick = () => {
            nav.push(React.createElement(Page, { header: "\u5B89\u5168\u9000\u51FA", back: "close" },
                React.createElement("div", { className: "m-5 border border-info bg-white rounded p-3 text-center" },
                    React.createElement("div", null, "\u9000\u51FA\u5F53\u524D\u8D26\u53F7\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u5386\u53F2\u6570\u636E\uFF0C\u4E0B\u6B21\u767B\u5F55\u4F9D\u7136\u53EF\u4EE5\u4F7F\u7528\u672C\u8D26\u53F7"),
                    React.createElement("div", { className: "mt-3" },
                        React.createElement("button", { className: "btn btn-danger", onClick: () => this.logout() }, "\u9000\u51FA")))));
        };
        this.navChange = this.navChange.bind(this);
        this.state = {
            hasBack: false,
        };
    }
    navChange() {
        this.setState({
            hasBack: nav.level > 1
        });
    }
    componentWillMount() {
        this.navChange();
        //this.navChangeHandler = nav.events.add('change', this.navChange);
    }
    componentWillUnmount() {
        //nav.events.remove('change', this.navChangeHandler);
    }
    back() {
        return __awaiter(this, void 0, void 0, function* () {
            yield nav.back(); // 这个才会显示confirm box，在dataForm里面，如果输入了数据的话
        });
    }
    openWindow() {
        window.open(document.location.href);
    }
    logout() {
        let { logout } = this.props;
        if (typeof logout === 'function') {
            logout();
        }
        nav.logout();
    }
    render() {
        let b = this.state.hasBack || self != top;
        let { right, center, logout } = this.props;
        let back, pop, debugLogout;
        if (logout !== undefined && self === top) {
            if (typeof logout === 'boolean' && logout === true
                || typeof logout === 'function') {
                let { nick, name } = nav.user;
                debugLogout = React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement("small", { className: "text-light" }, nick || name),
                    React.createElement("a", { className: "dropdown-toggle btn btn-secondary btn-sm ml-2", role: "button", onClick: this.logoutClick },
                        React.createElement("i", { className: "fa fa-sign-out" })));
            }
        }
        if (b) {
            switch (this.props.back) {
                case 'none':
                    back = undefined;
                    break;
                default:
                case 'back':
                    back = React.createElement("nav", { onClick: this.back },
                        React.createElement("i", { className: "fa fa-arrow-left" }));
                    break;
                case 'close':
                    back = React.createElement("nav", { onClick: this.back },
                        React.createElement("i", { className: "fa fa-close" }));
                    break;
            }
        }
        if (self != top) {
            console.log(document.location.href);
            pop = React.createElement("header", { onClick: this.openWindow });
        }
        let rightView;
        if (right || debugLogout)
            rightView = React.createElement("aside", null,
                right,
                " ",
                debugLogout);
        return (React.createElement("header", { style: mobileHeaderStyle },
            pop,
            back,
            React.createElement("div", null, center),
            rightView));
    }
}
//# sourceMappingURL=titleBar.js.map