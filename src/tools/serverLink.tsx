import * as React from 'react';
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

export interface ServerLinkProps {
    className?: string;
    id: number;
}

@observer
export class ServerLink extends React.Component<ServerLinkProps> {
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheServers.get(id);
    }
    onClick(evt) {
        evt.preventDefault();
        nav.push(<ServerInfo id={this.props.id} />)
        return false;
    }
    render() {
        let {id} = this.props;
        let server = store.cacheServers.get(id);
        let content;
        if (server === null) {
            content = id;
        }
        else {
            let {cloud, ip, discription} = server;
            if (discription !== undefined) {
                content = <React.Fragment>{discription} &nbsp; <small className="text-muted">{ip}</small></React.Fragment>;
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

class ServerInfo extends React.Component<ServerLinkProps> {
    private rows:Prop[];
    constructor(props:any) {
        super(props);
    }
    render() {
        let server = store.cacheServers.get(this.props.id);
        let {discription, cloud, ip, unit, date_init, date_update} = server;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={discription} discription={ip} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitLink id={unit} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
        ];
        return <Page header={'服务器 - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
