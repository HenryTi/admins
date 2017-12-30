import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {Prop, ListProp, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {devApi} from '../api';
import {IdDates} from './idDates';
import {UnitLink} from './unitLink';

export interface AppLinkProps {
    className?: string;
    id: number;
}

@observer
export class AppLink extends React.Component<AppLinkProps> {
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheApps.get(id);
    }
    onClick(evt) {
        evt.preventDefault();
        nav.push(<AppInfo id={this.props.id} />)
        return false;
    }
    render() {
        let {id} = this.props;
        let app = store.cacheApps.get(id);
        let content;
        if (app === null) {
            content = id;
        }
        else {
            let {name, icon, discription} = app;
            let isPublic = app.public;
            let disc = discription && '- ' + discription;
            if (name !== undefined) {
                content = <React.Fragment>{name} &nbsp; <small className="text-muted">{disc}</small></React.Fragment>;
            }
            else {
                content = id;
            }
        }
        return <a className={className(this.props.className)} href="#" onClick={this.onClick}>
            {content}
        </a>;
    }
}


@observer
class AppInfo extends React.Component<AppLinkProps> {
    private rows:Prop[];
    @observable private apis:ListProp = {label: '关联API', type: 'list', list: undefined, row: AppRow};
    constructor(props:any) {
        super(props);
    }
    async componentDidMount() {
        this.apis.list = await devApi.loadAppApis(this.props.id);
    }
    render() {
        let app = store.cacheApps.get(this.props.id);
        let {unit, name, discription, icon, date_init, date_update} = app;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={icon || consts.appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitLink id={unit} /></div> },
            this.apis,
        ];
        return <Page header={'APP - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}

class AppRow extends React.Component<any> {
    render() {
        let {name, discription} = this.props;
        let disp;
        if (discription) disp = <small className="col-sm col-sm-auto text-muted">{discription}</small>;
        return <div className='row form-control-plaintext align-items-center'>
            <div className='col'>{name}</div>
            {disp}
        </div>
    }
}

