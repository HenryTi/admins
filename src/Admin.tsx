import * as React from 'react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {observer} from 'mobx-react';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import consts from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {mainData} from './mainData';
import AdministorsPage from './Administors';

const iconStyle={color:'#7f7fff', margin:'6px 0'};
const iconFont=(name) => <i style={iconStyle} className={'fa fa-lg fa-' + name} />;

@observer
export default class AdminPage extends React.Component<{}, null> {
    private items: ListItem[] = [
        {
            main: '用户',
            right: '增删用户',
            icon: iconFont('users'),
            onClick: () => nav.push(<AdministorsPage />)
        },
        {
            main: '开发',
            right: 'api, app, server 等资源',
            icon: iconFont('laptop'),
            onClick: () => nav.push(<AdministorsPage />)
        },
        {
            main: '管理员',
            right: '增删管理员',
            icon: iconFont('universal-access'),
            onClick: () => nav.push(<AdministorsPage />)
        },
    ];
    constructor(props) {
        super(props);
        //if (this.props.isOwner === 0) this.items.shift();
    }
    async componentDidMount() {
        await mainData.loadUnit();
    }

    converter(item: ListItem):ListItem {
        item.key = item.main;
        return item;
    }
    render() {
        let unit:Unit = mainData.unit;
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            let {name, nick, icon, discription} = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = <Container>
                <Row className='my-4'>
                    <Col xs={2} className='d-flex justify-content-end align-items-start'>
                        <img className='w-75' src={icon || process.env.REACT_APP_DEFAULT_ICON} />
                    </Col>
                    <Col xs="auto">
                        <h4 className='text-dark'>{name}</h4>
                        <h6><small className='text-secondary'>{nick}</small></h6>
                        <div className='text-info'>{discription}</div>
                    </Col>
                </Row>
            </Container>
        }
        return <Page header={header} debugLogout={true}>
            {top}
            <ListView items={this.items} converter={this.converter} />
        </Page>;
    }
}
