import * as React from 'react';

export interface EasyDateProps {
    date: Date | number;
}

function renderDate(vDate:Date|number, withTime:boolean) {
    if (!vDate) return null;
    let date: Date;
    switch (typeof vDate) {
        default: date = vDate as Date; break;
        case 'string': date = new Date(vDate); break;
        case 'number': date = new Date((vDate as number)*1000); break;
    }

    let now = new Date();
    let tick:number, nDate:number, _date:number, month:number, year:number, hm:string, nowYear:number;
    let d = date;
    tick = now.getTime() - d.getTime();
    let hour=d.getHours(), minute=d.getMinutes();
    nDate=now.getDate();
    _date=d.getDate();
    month=d.getMonth()+1;
    year=d.getFullYear();
    nowYear = now.getFullYear();
    hm = withTime === true? ' ' + hour + ((minute<10?':0':':') + minute) : '';

    if (tick < -24*3600*1000) {
        if (year === nowYear)
            return month+'月'+_date+'日' + hm;
        else
            return year+'年'+month+'月'+_date+'日' + hm;
    }
    if (tick < 24*3600*1000) {
        return _date!==nDate? 
            (tick < 0? '明天 ' : '昨天 ') + hm 
            : withTime===true? hm : '今天';
    }
    if (year === nowYear) {
        return month+'月'+_date+'日';
    }
    return year+'年'+month+'月'+_date+'日';
}


export class EasyDate extends React.Component<EasyDateProps> {
    render() {
        return renderDate(this.props.date, false);
    }
}

export class EasyTime extends React.Component<EasyDateProps> {
    render() {
        return renderDate(this.props.date, true);
    }
}
