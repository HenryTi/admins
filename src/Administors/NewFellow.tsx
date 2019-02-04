import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, Page, Context, Form, Schema, UiSchema, UiTextItem} from 'tonva-tools';
import {store} from '../store';

@observer
export default class NewFellowPage extends React.Component<{isOwner:boolean, isAdmin:boolean}> {
    //private form: TonvaForm;
    private schema: Schema = [
        {name:'user', type:'string', required:true},
        {name:'submit', type:'submit'}
    ]
    private uiSchema: UiSchema = {
        items: {
            user: {widget:'text', maxLength: 100, placeholder: '用户名', label: '邀请成员'} as UiTextItem,
            submit: {widget:'button', label: '邀请'}
        }
    }
    /*
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
    */
    private onSendInvitation = async (name:string, context:Context): Promise<string> => {
        let {isOwner, isAdmin} = this.props;
        let user = context.form.data['user'];
        let ret = await store.admins.addNew(user, isOwner?1:0, isAdmin?1:0);
        if (ret !== undefined) {
            nav.pop();
            return;
        }
        return user + '没有关注小号';
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
            <div className="container">
                <div className='my-4 text-info'>
                    只有关注本小号的用户，才能成为{caption}
                </div>
                <Form schema={this.schema} uiSchema={this.uiSchema} onButtonClick={this.onSendInvitation}/>
            </div>
        </Page>;
    }
}
// <ValidForm formSchema={this.schema} />
//<TonvaForm ref={f=>this.form=f} formRows={this.formRows} onSubmit={this.onSendInvitation} />
