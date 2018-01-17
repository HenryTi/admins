import * as React from 'react';
import {Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {List, LMR, FA, StackedFA, PropGrid, Prop} from 'tonva-react-form';
import consts from './consts';
import {Unit, UnitApps, UnitAdmin} from './model';
import {store} from './store';
import Administors from './Administors';
import Dev from './Dev';
import AppsPage from './Apps';

interface Item {
    main: string;
    right?: string;
    icon: string|JSX.Element;
    page?: new (props:any) => React.Component;
    //onClick: () => nav.push(<Administors />),
}

@observer
export default class AdminPage extends React.Component {
    private appsAction:Item = {
        main: 'App设置',
        right: '小号增减App',
        // 'mobile-phone'
        icon: 'cog',
        /*<StackedFA>
            <FA name="square-o" className="fa-stack-2x text-secondary" />
            <FA name="cog" className="fa-stack-1x text-primary"  />
        </StackedFA>*/
        page: AppsPage,
    };
    private usersAction:Item = {
        main: '会员管理',
        right: '会员权限',
        icon: 'users',
        page: Administors,
    };
    private devAction:Item = {
        main: '应用开发',
        right: '程序开发相关管理',
        icon: 'laptop',
        page: Dev,
    };
    private adminsAction:Item = {
        main: '系统管理员',
        right: '增删管理员',
        icon: 'universal-access',
        page: Administors,
    };
    private noneAction:Item = {
        main: '请耐心等待分配任务',
        icon: 'hourglass-start',
    };
    constructor(props) {
        super(props);
    }
    private getItems():Item[] {
        let unit = store.unit;
        let {isAdmin, isOwner, type} = unit;
        let items:Item[] = [];
        if (isOwner === 1) {
            items.push(this.adminsAction);
        }
        if (isAdmin === 1) {
            if ((type & 2) !== 0) {
                // unit
                items.push(this.appsAction, this.usersAction);
            }
            if ((type & 1) !== 0) {
                // dev unit
                items.push(this.devAction);
            }
        }
        return items;
    }
    row(item:Item, index:number):JSX.Element {
        return <LMR className="py-2 px-3 align-items-center"
            left={typeof item.icon === 'string'? 
                <FA className="text-primary" name={item.icon} fixWidth={true} size="lg" /> :
                item.icon
            }
            right={<small className="text-muted">{item.right}</small>}>
            <b>{item.main}</b>
        </LMR>
    }
    rowClick(item:Item) {
        nav.push(<item.page />);
    }
    render() {
        let unit:Unit = store.unit;
        if (unit === undefined) return null;
        let items = this.getItems();
        if (items === undefined) {
            return <Page header="" />;
        }
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            let {name, nick, icon, discription} = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = <Container>
                <Row className='my-4 bg-white py-1 cursor-pointer' onClick={()=>nav.push(<UnitProps />)}>
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
            <List items={items} item={{render:this.row, onClick:this.rowClick}} />
        </Page>;
    }
}

class UnitProps extends React.Component {
    private rows:Prop[] = [
        '',
        {label: '标志图', type: 'string', name: 'icon'},
        '=',
        {label: '唯一号', type: 'string', name: 'name'},
        {
            label: '名称', 
            type: 'string',
            name: 'nick', 
            onClick:()=>nav.push(<StringValueEdit 
                title="修改名称"
                value={store.unit.nick}
                onChanged={this.onNickChanged} 
                info="好的名字会提升接受度" />)
        },
        {
            label: '说明',
            type: 'string',
            name: 'discription',
            onClick:()=>nav.push(<StringValueEdit 
                title="修改说明"
                value={store.unit.discription}
                onChanged={this.onDiscriptionChanged} 
                info="对小号做一个说明" />)
        },
    ];
    async onNickChanged(value:any, orgValue:any):Promise<void> {
        await store.unitChangeProp('nick', value);
    }
    async onDiscriptionChanged(value:any, orgValue:any):Promise<void> {
        await store.unitChangeProp('discription', value);
    }
    render() {
        return <Page header="小号信息">
            <PropGrid rows={this.rows} values={store.unit} alignValue="right" />
        </Page>;
    }
}

interface StringValueEditProps {
    title: string;
    onChanged:(value:any, orgValue:any)=>Promise<void>;
    value?: any;
    buttonText?: string;
    info?: string;
}
interface StringValueEditState {
    disabled: boolean;
}
class StringValueEdit extends React.Component<StringValueEditProps, StringValueEditState> {
    private input:HTMLInputElement;
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
        this.ref = this.ref.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    private ref(input:HTMLInputElement) {
        if (!input) return;
        input.value = this.props.value;
        this.input = input;
    }
    private onChange(evt:React.FormEvent<HTMLInputElement>) {
        let org = this.props.value.trim();
        let v = evt.currentTarget.value.trim();
        this.setState({
            disabled: org === v
        })
    }
    private async onSubmit() {
        let org = this.props.value.trim();
        let v = this.input.value.trim();
        let onChanged = this.props.onChanged;
        if (onChanged !== undefined) {
            await onChanged(v, org);
            nav.pop();
        }
    }
    render() {
        let {title, onChanged, buttonText, info, value} = this.props;
        let right = <Button
            color="success"
            size="sm"
            disabled={this.state.disabled}
            onClick={this.onSubmit}
        >
            {buttonText||'保存'}
        </Button>;
        return <Page header={title} right={right}>
            <div className="m-4">
                <input className="form-control w-100" type="text"
                    ref={this.ref}
                    onChange={this.onChange} />
                <small className="d-block mt-2 text-muted">{info}</small>
            </div>
        </Page>;
    }
}
