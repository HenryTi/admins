import * as React from 'react';
import {observer} from 'mobx-react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {nav, Page, ValidForm, FormSchema, FormFields, Field} from 'tonva-tools';
import {store} from '../store';
import {mainApi} from '../api';
import { UnitAdmin } from '../model/index';

@observer
export default class EditAdmin extends React.Component {
    private schema:FormSchema;
    private async onSubmit(values:any) {
        let {isOwner, isAdmin} = values;
        await store.admins.unitSetAdmin(isOwner, isAdmin);
        nav.pop();
    }
    componentWillMount() {
        let {unit} = store;
        let {isRoot, isOwner, isAdmin} = unit;
        let unitAdmin = store.admins.cur;
        let fields: Field[] = [];
        let ownerField: Field = {
            type: 'checkbox',
            name: 'isOwner',
            label: '高管',
            defaultValue: unitAdmin.isOwner,
        };
        let adminField: Field = {
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
        return <Page header='权限'>
            <Fellow {...store.admins.cur} />
            <ValidForm formSchema={this.schema} />
        </Page>;
    }
}

const Fellow = (props:UnitAdmin) => {
    let {name, nick, icon} = props;
    return <Container>
        <Row className='my-4'>
            <Col xs={2} className='d-flex justify-content-end align-items-start'>
                <img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
            </Col>
            <Col xs="auto">
                <h4 className='text-dark'>{name}</h4>
                <h6><small className='text-secondary'>{nick}</small></h6>
                <div className='text-info'>设置成员权限</div>
            </Col>
        </Row>
        <hr className='mb-4' />
    </Container>;
}
