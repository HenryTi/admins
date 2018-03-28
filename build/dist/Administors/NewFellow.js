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
import { Card, CardBody, CardText, CardTitle, Button, Container, Row, Col } from 'reactstrap';
import { nav, Page, FormSchema, ValidForm } from 'tonva-tools';
import { mainApi } from '../api';
let NewFellowPage = class NewFellowPage extends React.Component {
    constructor() {
        super(...arguments);
        this.schema = new FormSchema({
            fields: [
                {
                    type: 'string',
                    name: 'user',
                    placeholder: '用户名',
                    label: '邀请成员',
                    rules: ['required', 'maxlength:100']
                },
            ],
            onSumit: this.onSendInvitation.bind(this),
            submitText: '邀请'
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onSendInvitation(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = { a: 1, b: 'ddd' };
            let toName = values['user'];
            let ret = yield mainApi.sendMessage(toName, 'unit-fellow-invite', msg, true);
            if (ret === undefined) {
                this.schema.setInputError('user', toName + ' not exists');
            }
            else {
                nav.replace(React.createElement(Page, { header: '完成', back: "close" },
                    React.createElement(Card, null,
                        React.createElement(CardBody, null,
                            React.createElement(CardTitle, null, "\u9080\u8BF7\u6210\u5458"),
                            React.createElement(CardText, null,
                                "\u5DF2\u53D1\u9001\u7ED9",
                                toName,
                                "\uFF0C\u8BF7\u7B49\u5F85\u786E\u8BA4\u3002"),
                            React.createElement(Button, { color: 'primary', onClick: () => nav.back() }, "\u5B8C\u6210")))));
            }
        });
    }
    render() {
        return React.createElement(Page, { header: "新增管理成员" },
            React.createElement(Container, null,
                React.createElement(Row, null,
                    React.createElement(Col, { className: 'my-4 text-info' }, "\u8BF7\u8F93\u5165\u7528\u6237\u540D\uFF0C\u53D1\u9001\u9080\u8BF7\u3002"))),
            React.createElement(ValidForm, { formSchema: this.schema }));
    }
};
NewFellowPage = __decorate([
    observer
], NewFellowPage);
export default NewFellowPage;
//# sourceMappingURL=NewFellow.js.map