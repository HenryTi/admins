import * as React from 'react';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {Prop, ListProp, Media, PropGrid} from 'tonva';
import {nav, Page}  from 'tonva';
import {appIcon, appItemIcon} from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {devApi} from '../api';
import {span} from './span';
import {IdDates} from './idDates';
import {UnitSpan} from './unitSpan';

export interface ServerSpanProps {
    className?: string;
    id: number;
    isLink?: boolean;
}

@observer
export class ServerSpan extends React.Component<ServerSpanProps> {
    /*
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheServers.get(id);
    }
    */
    onClick = (evt) => {
        evt.preventDefault();
        nav.push(<ServerInfo id={this.props.id} />)
        return false;
    }
    render() {
        let {id, isLink, className} = this.props;
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
        return span(isLink, className, this.onClick, content);
    }
}

class ServerInfo extends React.Component<ServerSpanProps> {
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
            {type: 'component', component: <Media icon={appIcon} main={discription} discription={ip} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
        ];
        return <Page header={'服务器 - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
