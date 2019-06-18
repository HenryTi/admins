import * as React from 'react';
import { PropGrid, LMR, Muted, FA } from 'tonva-react-form';
import { UnitSpan, IdDates } from '../tools';
import { store } from '../store';
class Info extends React.Component {
    render() {
        let { discription, cloud, ip, unit, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        //<Media icon={appIcon} main={discription} discription={ip} />},
        let rows = [
            '',
            { type: 'component', component: React.createElement(LMR, { className: "py-2", left: React.createElement(FA, { name: "server", className: "text-primary fa-2x mr-3" }) },
                    React.createElement("div", null,
                        React.createElement("b", null, ip)),
                    disp) },
            '',
            { type: 'component', label: '开发号', component: React.createElement("div", { className: "py-2" },
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
        let { discription, cloud } = item;
        //return <Row main={item.discription} vice={<>{item.cloud}  {item.ip}</>} />;
        return React.createElement(LMR, { className: "py-2 px-3 align-items-center", left: React.createElement(FA, { name: "server", className: "text-primary fa-lg" }) },
            React.createElement("div", { className: "px-3" },
                React.createElement("div", null,
                    React.createElement("b", null, discription)),
                React.createElement("div", null,
                    React.createElement(Muted, null, cloud))));
    },
    items: () => store.dev.servers,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};
export default serversProps;
//# sourceMappingURL=servers.js.map