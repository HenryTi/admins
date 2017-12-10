import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button,
    Container, Row, Col} from 'reactstrap';
import {nav, Page, ListView, ListItem, FormSchema, SubmitReturn, ValidForm, InputSchema} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, UnitAdmin} from '../model';
import {mainData} from '../mainData';
import mainApi from '../mainApi';

@observer
export default class NewFellowPage extends React.Component<{}, null> {
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
        onSumit: this.onSendInvitation.bind(this),
        submitText: '邀请'
    });
    async componentDidMount() {
    }
    private async onSendInvitation(values:any) {
        let msg = {a: 1, b: 'ddd'};
        let toName = values['user'];
        let ret = await mainApi.sendMessage(toName, 'unit-fellow-invite', msg, true);
        if (ret === undefined) {
            this.schema.setInputError('user', toName + ' not exists');
        }
        else {
            nav.replace(<Page header='完成' close={true}>
                <Card>
                    <CardBody>
                        <CardTitle>邀请成员</CardTitle>
                        <CardText>已发送给{toName}，请等待确认。</CardText>
                        <Button color='primary' onClick={()=>nav.back()}>完成</Button>
                    </CardBody>
                </Card>
            </Page>);
        }
    }
    converter(admin: UnitAdmin):ListItem {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon : admin.icon || consts.appItemIcon,
            right: <aside>ddd</aside>
            //unread: 0,
        };
    }
    render() {
        let me = nav.local.user.get().id;
        let list = mainData.unitAdmins && mainData.unitAdmins.sort((a, b) => {
            if (a.isOwner === 1)
                if (b.isOwner === 1) return a.id < b.id? -1:1;
                else return -1;
            if (b.isOwner === 1) return -1;
            return a.id < b.id? -1:1;
        });
        return <Page header={"新增管理成员"}>
            <Container>
                <Row>
                    <Col className='my-4 text-info'>
                        请输入用户名，发送邀请。等待对方同意。
                    </Col>
                </Row>
            </Container>
            <ValidForm formSchema={this.schema} />
        </Page>;
    }
}
