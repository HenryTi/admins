var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { List, LMR, Badge, FA, Muted, SearchBox } from 'tonva-react-form';
import { nav, Page, Image } from 'tonva-tools';
import { store } from '../store';
import { mainApi } from '../api';
import { MemberPage } from './memberPage';
let MembersPage = class MembersPage extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadMembers();
        });
    }
    renderMember(member, index) {
        return React.createElement(MemberRow, Object.assign({}, member));
    }
    userClick(user) {
        store.setRoleUser(user);
        nav.push(React.createElement(MemberPage, null));
    }
    onSearch() {
        let role = store.role;
        let roleId = role === undefined ? 0 : role.id;
        nav.push(React.createElement(MemberSearch, { roleId: roleId }));
    }
    render() {
        let right = React.createElement("button", { className: "btn btn-sm", onClick: this.onSearch },
            React.createElement(FA, { name: "search" }));
        return React.createElement(Page, { header: "\u7528\u6237", right: right },
            React.createElement(List, { items: store.roleMembers, item: { render: this.renderMember, onClick: this.userClick } }));
    }
};
MembersPage = __decorate([
    observer
], MembersPage);
export { MembersPage };
const MemberRow = (member) => {
    let { nick, name, assigned, icon } = member;
    let content;
    if (assigned)
        content = React.createElement(React.Fragment, null,
            React.createElement("div", null,
                React.createElement("b", null, assigned),
                " ",
                React.createElement(Muted, null, nick)),
            React.createElement(Muted, null, name));
    else if (nick)
        content = React.createElement(React.Fragment, null,
            React.createElement("div", null,
                React.createElement("b", null, nick)),
            React.createElement(Muted, null, name));
    else
        content = React.createElement("div", null,
            React.createElement("b", null, name));
    return React.createElement(LMR, { className: "py-2 px-3 align-items-stretch", left: React.createElement(Badge, { size: "sm" },
            React.createElement(Image, { src: icon })) },
        React.createElement("div", { className: "px-3" }, content));
};
export class MemberSearch extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            members: null,
        };
    }
    onSearch(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitMembers(store.unit.id, this.props.roleId, key, 0, 100);
            this.setState({ members: ret });
        });
    }
    renderMember(member, index) {
        return React.createElement(MemberRow, Object.assign({}, member));
    }
    userClick(user) {
        store.setRoleUser(user);
        nav.push(React.createElement(MemberPage, null));
    }
    render() {
        let header = React.createElement(SearchBox, { className: "w-100 mx-1", onSearch: this.onSearch, maxLength: 100, placeholder: "\u641C\u7D22\u7528\u6237" });
        return React.createElement(Page, { header: header },
            React.createElement(List, { items: this.state.members, item: { render: this.renderMember, onClick: this.userClick } }));
    }
}
//# sourceMappingURL=membersPage.js.map