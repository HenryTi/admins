import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {Prop, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {IdDates} from './idDates';
import {UnitLink} from './unitLink';

export interface ApiLinkProps {
    className?: string;
    id: number;
}

@observer
export class ApiLink extends React.Component<ApiLinkProps> {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheApis.get(id);
    }
    onClick(evt) {
        evt.preventDefault();
        nav.push(<ApiInfo id={this.props.id} />);
        return false;
    }
    render() {
        let {id} = this.props;
        let api = store.cacheApis.get(id);
        let content;
        if (api === null) {
            content = id;
        }
        else {
            let {name, discription} = api;
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
class ApiInfo extends React.Component<ApiLinkProps> {
    private rows:Prop[];
    constructor(props:any) {
        super(props);
    }
    render() {
        let api = store.cacheApis.get(this.props.id);
        let {name, discription, unit, date_init, date_update} = api;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitLink id={unit} /></div> },
        ];
        return <Page header={'API - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
