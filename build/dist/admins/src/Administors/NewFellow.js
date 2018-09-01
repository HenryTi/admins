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
import { nav, Page, FormSchema } from 'tonva-tools';
import { TonvaForm } from 'tonva-react-form';
import { store } from '../store';
let NewFellowPage = class NewFellowPage extends React.Component {
    constructor(props) {
        super(props);
        this.formRows = [
            {
                label: '用户名',
                field: {
                    type: 'string',
                    name: 'user',
                    required: true,
                    maxLength: 100,
                },
                face: {
                    type: 'string',
                    placeholder: '用户名',
                }
            },
        ];
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
            onSumit: this.onSendInvitation,
            submitText: '邀请'
        });
        this.onSendInvitation = this.onSendInvitation.bind(this);
    }
    onSendInvitation(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let { isOwner, isAdmin } = this.props;
            let user = values['user'];
            let ret = yield store.admins.addNew(user, isOwner ? 1 : 0, isAdmin ? 1 : 0);
            if (ret !== undefined) {
                nav.pop();
            }
            else {
                this.form.formView.setError('user', user + '没有关注小号');
            }
            return;
            /*
            let msg = {a: 1, b: 'ddd'};
            let toName = values['user'];
            let userId = await mainApi.userId(toName);
            if (userId === 0) {
                this.form.formView.setError('user', '\'' + toName +  '\' 不存在');
                return;
            }
            await mainApi.sendMessage(userId, 'unit-follow-invite', msg);
            nav.replace(<Page header='完成' back="close">
                <Card>
                    <CardBody>
                        <CardTitle>邀请成员</CardTitle>
                        <CardText>已发送给{toName}，请等待确认。</CardText>
                        <Button color='primary' onClick={()=>nav.back()}>完成</Button>
                    </CardBody>
                </Card>
            </Page>);
            */
        });
    }
    render() {
        let { isOwner, isAdmin } = this.props;
        let caption = isOwner ? "高管" : "管理员";
        return React.createElement(Page, { header: '新增' + caption },
            React.createElement(Container, null,
                React.createElement(Row, null,
                    React.createElement(Col, { className: 'my-4 text-info' },
                        "\u53EA\u6709\u5173\u6CE8\u672C\u5C0F\u53F7\u7684\u7528\u6237\uFF0C\u624D\u80FD\u6210\u4E3A",
                        caption)),
                React.createElement(TonvaForm, { ref: f => this.form = f, formRows: this.formRows, onSubmit: this.onSendInvitation })));
    }
};
NewFellowPage = __decorate([
    observer
], NewFellowPage);
export default NewFellowPage;
// <ValidForm formSchema={this.schema} />
//# sourceMappingURL=NewFellow.js.map