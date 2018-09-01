import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button,
    Container, Row, Col} from 'reactstrap';
import {nav, Page, FormSchema, SubmitReturn, ValidForm, InputSchema} from 'tonva-tools';
import {TonvaForm, FormRow, SubmitResult} from 'tonva-react-form';
import {appIcon, appItemIcon} from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {store} from '../store';
import {mainApi} from '../api';

@observer
export default class NewFellowPage extends React.Component<{isOwner:boolean, isAdmin:boolean}> {
    private form: TonvaForm;
    private formRows:FormRow[] = [
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
    private schema:FormSchema = new FormSchema({
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
    constructor(props) {
        super(props);
        this.onSendInvitation = this.onSendInvitation.bind(this);
    }
    private async onSendInvitation(values:any): Promise<SubmitResult | undefined> {
        let {isOwner, isAdmin} = this.props;
        let user = values['user'];
        let ret = await store.admins.addNew(user, isOwner?1:0, isAdmin?1:0);
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
    }
    render() {
        let {isOwner, isAdmin} = this.props;
        let caption = isOwner? "高管" : "管理员";
        return <Page header={'新增' + caption}>
            <Container>
                <Row>
                    <Col className='my-4 text-info'>
                        只有关注本小号的用户，才能成为{caption}
                    </Col>
                </Row>
                <TonvaForm ref={f=>this.form=f} formRows={this.formRows} onSubmit={this.onSendInvitation} />
            </Container>
        </Page>;
    }
}
// <ValidForm formSchema={this.schema} />
