import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from '../store';
import {Unit} from '../model';

export interface UnitLinkProps {
    className?: string;
    id: number;
}

@observer
export class UnitLink extends React.Component<UnitLinkProps> {
    componentWillMount() {
        let {id} = this.props;
        store.cacheUnits.get(id);
    }
    onClick(evt) {
        //alert('a');
        evt.preventDefault();
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
