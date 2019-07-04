import * as React from 'react';
import {observer} from 'mobx-react';
import {Prop, ListProp, Media, PropGrid} from 'tonva';
import {nav, Page}  from 'tonva';
import {store} from '../store';
import {span} from './span';

export interface UnitLinkProps {
    className?: string;
    id: number;
    isLink?: boolean;
}

@observer
export class UnitSpan extends React.Component<UnitLinkProps> {
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
        if (nick) {
            content = <>{nick} &nbsp; <small className="text-muted">{name} {disc}</small></>;
        }
        else if (name) {
            content = <>{name} &nbsp; <small className="text-muted">{disc}</small></>;
        }
        else {
            content = id;
        }
        return span(isLink, className, this.onClick, content);
    }
}

@observer
export class UnitName extends React.Component<UnitLinkProps> {
    render() {
        let {id, isLink, className} = this.props;
        if (id === undefined) return null;
        let unit = store.cacheUnits.get(id);
        let {name} = unit;
        return <>{name}</>;
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
            {type: 'component', component: <Media icon={icon} main={name} discription={discription} />},
            '',
        ];
        return <Page header={'小号 - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
