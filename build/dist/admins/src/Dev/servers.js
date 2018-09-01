import * as React from 'react';
import { Media, PropGrid } from 'tonva-react-form';
import { UnitSpan, IdDates } from '../tools';
import { Row } from './row';
import {appIcon, appItemIcon} from '../consts';
import { store } from '../store';
class Info extends React.Component {
    /*
    private rows:Prop[];
    constructor(props:any) {
        super(props);
        let {discription, cloud, ip, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={discription} discription={ip} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
        ];
    }*/
    render() {
        let { discription, cloud, ip, unit, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: discription, discription: ip }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'string', label: '云服务', name: 'cloud' },
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
}
const serversProps = {
    title: 'Server',
    info: Info,
    formRows: [
        {
            label: '描述',
            field: { name: 'discription', type: 'string', maxLength: 50, required: true },
        },
        {
            label: '云服务商',
            field: { name: 'cloud', type: 'string', maxLength: 20, required: true },
        },
        {
            label: 'IP地址',
            field: { name: 'ip', type: 'string', maxLength: 20 },
        },
    ],
    row: (item) => {
        return React.createElement(Row, { icon: appItemIcon, main: item.discription, vice: React.createElement(React.Fragment, null,
                item.cloud,
                "  ",
                item.ip) });
    },
    items: () => store.dev.servers,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};
export default serversProps;
//# sourceMappingURL=servers.js.map