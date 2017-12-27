import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from '../store';
import {DevModel} from '../model';
import { EventHandler } from 'react';

export interface AppLinkProps {
    className?: string;
    id: number;
}

@observer
export class AppLink extends React.Component<AppLinkProps> {
    componentWillMount() {
        let {id} = this.props;
        store.cacheApps.get(id);
    }
    onClick(evt) {
        //alert('a');
        evt.preventDefault();
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
