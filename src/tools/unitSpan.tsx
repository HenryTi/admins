import * as React from 'react';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {Prop, ListProp, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {store} from '../store';
import {Unit, DevModel} from '../model';
import {devApi} from '../api';
import {span} from './span';
import {IdDates} from './idDates';

export interface UnitLinkProps {
    className?: string;
    id: number;
    isLink?: boolean;
}

@observer
export class UnitSpan extends React.Component<UnitLinkProps> {
    /*
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheUnits.get(id);
    }
    */
    onClick = (evt) => {
        evt.preventDefault();
        nav.push(<UnitInfo id={this.props.id} />);
        return false;
    }
    render() {
        let {id, isLink, className} = this.props;
        if (id === undefined) return null;
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
        return span(isLink, className, this.onClick, content);
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
            {type: 'component', component: <Media icon={icon || appIcon} main={name} discription={discription} />},
            '',
        ];
        return <Page header={'小号 - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
