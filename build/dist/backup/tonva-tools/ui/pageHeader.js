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
export class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.logoutClick = () => {
            nav.showLogout(this.logout);
            /*
            nav.push(<Page header="安全退出" back="close">
                <div className="m-5 border border-info bg-white rounded p-3 text-center">
                    <div>退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号</div>
                    <div className="mt-3">
                        <button className="btn btn-danger" onClick={()=>this.logout()}>退出</button>
                    </div>
                </div>
            </Page>);
            */
        };
        this.logout = () => __awaiter(this, void 0, void 0, function* () {
            let { logout } = this.props;
            if (typeof logout === 'function') {
                yield logout();
            }
            yield nav.logout(undefined);
        });
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
    render() {
        let b = this.state.hasBack || self != top;
        let { right, center, logout, className } = this.props;
        let back, pop, debugLogout;
        if (logout !== undefined && self === top) {
            if (typeof logout === 'boolean' && logout === true
                || typeof logout === 'function') {
                let { user } = nav;
                if (user !== undefined) {
                    let { nick, name } = user;
                    debugLogout = React.createElement("div", { className: "d-flex align-items-center" },
                        React.createElement("small", { className: "text-light" }, nick || name),
                        React.createElement("a", { className: "dropdown-toggle btn btn-secondary btn-sm ml-2", role: "button", onClick: this.logoutClick },
                            React.createElement("i", { className: "fa fa-sign-out" })));
                }
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
        return React.createElement("header", { className: className, style: mobileHeaderStyle },
            pop,
            back,
            React.createElement("div", null, center),
            rightView);
    }
}
//# sourceMappingURL=pageHeader.js.map