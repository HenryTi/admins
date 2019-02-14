import * as React from 'react';

export interface EasyDateProps {
    date: Date | string;
}

export class EasyDate extends React.Component<EasyDateProps> {
    render() {
        let {date} = this.props;
        if (!date) return null;
        let d = (typeof date === 'string')? new Date(Date.parse(date)) : date;
        let now = new Date();
        let tick = now.getTime() - d.getTime();
        let nDate=now.getDate();
        let _date=d.getDate(), hour=d.getHours(), minute=d.getMinutes(), month=d.getMonth()+1;
        let hm = hour + ((minute<10?':0':':') + minute);
        if (tick < -24*3600*1000) return d.getFullYear()+'年'+month+'月'+_date+'日 ' + hm;
        if (tick < 24*3600*1000) {
            return _date!==nDate? 
                (tick < 0? '明天 ' : '昨天 ') + hm 
                : hm;
        }
        if (tick < 365*24*3600*1000) {
            return month+'月'+_date+'日 ';
        }
        return d.getFullYear()+'年'+month+'月'+_date+'日';
    }
}
