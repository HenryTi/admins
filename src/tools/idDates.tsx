import * as React from 'react';
import {EasyDate, EasyTime} from 'tonva';

export interface IdDatesProps {
    date_init: Date;
    date_update: Date;
}

export class IdDates extends React.Component<IdDatesProps> {
    render() {
        let {date_init, date_update} = this.props;
        return <small className="text-muted">
            最新: <EasyTime date={date_update}/>
            <i className="fa fa-fw" />
            创建: <EasyDate date={date_init}/>
        </small>
    }
}
