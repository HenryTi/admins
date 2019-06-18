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
import { nav, Page, Form, Image } from 'tonva-tools';
import { store } from '../store';
//import {mainApi} from '../api';
//, ValidForm, FormSchema, FormFields, Field
let EditAdmin = class EditAdmin extends React.Component {
    //import {mainApi} from '../api';
    //, ValidForm, FormSchema, FormFields, Field
    constructor() {
        super(...arguments);
        this.onSubmit = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let { isOwner, isAdmin } = context.form.data;
            yield store.admins.unitSetAdmin(isOwner, isAdmin);
            nav.pop();
        });
    }
    render() {
        let { unit } = store;
        let { isRoot, isOwner, isAdmin } = unit;
        let unitAdmin = store.admins.cur;
        let owner = { name: 'isOwner', type: 'boolean' };
        let admin = { name: 'isAdmin', type: 'boolean' };
        let submit = { name: 'submit', type: 'submit' };
        let schema;
        if (isRoot === 1)
            schema = [owner, admin, submit];
        else if (isOwner === 1)
            schema = [admin, submit];
        let data = {
            isOwner: unitAdmin.isOwner,
            isAdmin: unitAdmin.isAdmin,
        };
        let uiSchema = {
            items: {
                'isOwner': { widget: 'checkbox', label: '高管', trueValue: 1, falseValue: 0 },
                'isAdmin': { widget: 'checkbox', label: '管理员', trueValue: 1, falseValue: 0 },
                'submit': { widget: 'button', label: '提交', className: 'btn btn-primary' },
            }
        };
        return React.createElement(Page, { header: '\u6743\u9650' },
            React.createElement("div", { className: "px-3" },
                React.createElement(Fellow, Object.assign({}, store.admins.cur)),
                React.createElement(Form, { schema: schema, uiSchema: uiSchema, formData: data, onButtonClick: this.onSubmit })));
    }
};
EditAdmin = __decorate([
    observer
], EditAdmin);
export default EditAdmin;
const Fellow = (props) => {
    let { name, nick, icon } = props;
    //<img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
    return React.createElement("div", null,
        React.createElement("div", { className: 'd-flex my-4' },
            React.createElement(Image, { className: "w-3c h-3c mr-3", src: icon }),
            React.createElement("div", { className: "" },
                React.createElement("h4", { className: 'text-dark' }, name),
                nick && React.createElement("h6", null,
                    React.createElement("small", { className: 'text-secondary' }, nick)))),
        React.createElement("hr", { className: 'mb-4' }));
};
//# sourceMappingURL=EditAdmin.js.map