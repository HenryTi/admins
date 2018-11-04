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
import { Container, Row, Col } from 'reactstrap';
import { nav, Page, ValidForm, FormSchema } from 'tonva-tools';
import { store } from '../store';
let EditAdmin = class EditAdmin extends React.Component {
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let { isOwner, isAdmin } = values;
            yield store.admins.unitSetAdmin(isOwner, isAdmin);
            nav.pop();
        });
    }
    componentWillMount() {
        let { unit } = store;
        let { isRoot, isOwner, isAdmin } = unit;
        let unitAdmin = store.admins.cur;
        let fields = [];
        let ownerField = {
            type: 'checkbox',
            name: 'isOwner',
            label: '高管',
            defaultValue: unitAdmin.isOwner,
        };
        let adminField = {
            type: 'checkbox',
            name: 'isAdmin',
            label: '管理员',
            defaultValue: unitAdmin.isAdmin,
        };
        if (isRoot === 1) {
            fields.push(ownerField);
            fields.push(adminField);
        }
        else if (isOwner === 1) {
            fields.push(adminField);
        }
        this.schema = new FormSchema({
            fields: fields,
            onSumit: this.onSubmit.bind(this),
            submitText: '提交'
        });
    }
    render() {
        return React.createElement(Page, { header: '\u6743\u9650' },
            React.createElement(Fellow, Object.assign({}, store.admins.cur)),
            React.createElement(ValidForm, { formSchema: this.schema }));
    }
};
EditAdmin = __decorate([
    observer
], EditAdmin);
export default EditAdmin;
const Fellow = (props) => {
    let { name, nick, icon } = props;
    return React.createElement(Container, null,
        React.createElement(Row, { className: 'my-4' },
            React.createElement(Col, { xs: 2, className: 'd-flex justify-content-end align-items-start' },
                React.createElement("img", { className: 'w-75', src: icon || process.env.REACT_APP_DEFAULT_ICON })),
            React.createElement(Col, { xs: "auto" },
                React.createElement("h4", { className: 'text-dark' }, name),
                React.createElement("h6", null,
                    React.createElement("small", { className: 'text-secondary' }, nick)),
                React.createElement("div", { className: 'text-info' }, "\u8BBE\u7F6E\u6210\u5458\u6743\u9650"))),
        React.createElement("hr", { className: 'mb-4' }));
};
//# sourceMappingURL=EditAdmin.js.map