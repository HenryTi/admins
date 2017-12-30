import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {Prop, ListProp, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import {Unit, DevModel} from '../model';
import {devApi} from '../api';
import {IdDates} from './idDates';

export interface UnitLinkProps {
    className?: string;
    id: number;
}

@observer
export class UnitLink extends React.Component<UnitLinkProps> {
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheUnits.get(id);
    }
    onClick(evt) {
        evt.preventDefault();
        nav.push(<UnitInfo id={this.props.id} />);
        return false;
    }
    render() {
        let {id} = this.props;
        let unit = store.cacheUnits.get(id);
        let content;
        let {name, nick, discription} = unit;
        let disc = discription && '- ' + discription;
        if (nick !== undefined) {
            content = <React.Fragment>{nick} &nbsp; <small className="text-muted">{name} {disc}</small></React.Fragment>;
        }
        else if (name !== undefined) {
            content = <React.Fragment>{name} &nbsp; <small className="text-muted">{disc}</small></React.Fragment>;
        }
        else {
            content = id;
        }
        return <a className={className(this.props.className)} href="#" onClick={this.onClick}>
            {content}
        </a>;
    }
}

class UnitInfo extends React.Component<UnitLinkProps> {
    private rows:Prop[];
    constructor(props:any) {
        super(props);
    }
    render() {
        let unit = store.cacheUnits.get(this.props.id);
        let {name, nick, icon, discription} = unit;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={icon || consts.appIcon} main={name} discription={discription} />},
            '',
        ];
        return <Page header={'小号 - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
