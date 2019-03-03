import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Prop, ListProp, Media, PropGrid} from 'tonva-react-form';
import {nav, Page}  from 'tonva-tools';
import {store} from '../store';
import {devApi} from '../api';
import {span} from './span';
import {IdDates} from './idDates';
import {UnitSpan} from './unitSpan';

export interface AppSpanProps {
    className?: string;
    id: number;
    isLink?: boolean;
}

@observer
export class AppSpan extends React.Component<AppSpanProps> {
    /*
    constructor(props:any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let {id} = this.props;
        store.cacheApps.get(id);
    }
    */
    onClick = (evt) => {
        evt.preventDefault();
        nav.push(<AppInfo id={this.props.id} />)
        return false;
    }
    render() {
        let {id, isLink, className} = this.props;
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
        return span(isLink, className, this.onClick, content);
    }
}


@observer
class AppInfo extends React.Component<AppSpanProps> {
    private rows:Prop[];
    @observable private apis:ListProp = {
        label: '关联API', type: 'list', list: undefined, row: AppRow
    };
    constructor(props:any) {
        super(props);
    }
    async componentDidMount() {
        this.apis.list = await devApi.loadAppUqs(this.props.id);
    }
    render() {
        let app = store.cacheApps.get(this.props.id);
        let {unit, name, discription, icon, date_init, date_update} = app;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={icon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            this.apis,
        ];
        return <Page header={'APP - 详细资料'}>
            <PropGrid rows={this.rows} values={this.props} />
        </Page>;
    }
}

class AppRow extends React.Component<any> {
    render() {
        let {name, discription} = this.props;
        let disp;
        if (discription) disp = <div className="small text-muted">{discription}</div>;
        return <div className='form-control-plaintext'>
            <div>{name}</div>
            {disp}
        </div>
    }
}

