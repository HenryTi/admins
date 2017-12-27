import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {store} from '../store';
import {DevModel} from '../model';

export interface ApiLinkProps {
    className?: string;
    id: number;
}

@observer
export class ApiLink extends React.Component<ApiLinkProps> {
    componentWillMount() {
        let {id} = this.props;
        store.cacheApis.get(id);
    }
    onClick(evt) {
        //alert('a');
        evt.preventDefault();
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
