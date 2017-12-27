import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from '../store';
import {DevModel} from '../model';

export interface ServerLinkProps {
    className?: string;
    id: number;
}

@observer
export class ServerLink extends React.Component<ServerLinkProps> {
    componentWillMount() {
        let {id} = this.props;
        store.cacheServers.get(id);
    }
    onClick(evt) {
        //alert('a');
        evt.preventDefault();
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
