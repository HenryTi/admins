import * as React from 'react';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import {Prop, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {store} from '../store';
import {DevModel} from '../model';
import {IdDates} from './idDates';
import {span} from './span';
import {UnitSpan} from './unitSpan';

export interface ApiLinkProps {
    className?: string;
    id: number;
    isLink?: boolean;
}

@observer
export class ApiSpan extends React.Component<ApiLinkProps> {
    /*
    componentWillMount() {
        let {id} = this.props;
        store.cacheApis.get(id);
    }
    */
    onClick = (evt) => {
        evt.preventDefault();
        nav.push(<ApiInfo id={this.props.id} />);
        return false;
    }
    render() {
        let {id, className, isLink} = this.props;
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
        return span(isLink, className, this.onClick, content);
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
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
        ];
        return <Page header={'API - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}
