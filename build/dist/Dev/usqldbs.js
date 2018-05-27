import * as React from 'react';
import { Media, PropGrid, LMR, FA } from 'tonva-react-form';
import { nav } from 'tonva-tools';
import { UnitSpan, IdDates } from '../tools';
import { Row } from './row';
import consts from '../consts';
import { store } from '../store';
import { UsqlUpload } from './usqlUpload';
class Info extends React.Component {
    onUsql() {
        nav.push(React.createElement(UsqlUpload, Object.assign({}, this.props)));
    }
    render() {
        let { dbname, discription, cloud, connection, unit, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: consts.appIcon, main: dbname, discription: discription }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'string', label: '云服务', name: 'cloud' },
            { type: 'component', label: 'usql代码', component: React.createElement(LMR, { onClick: () => this.onUsql(), className: "w-100 py-2 cursor-pointer", left: "\u4E0A\u4F20\u7F16\u8BD1usql\u4EE3\u7801", right: React.createElement(FA, { className: "align-self-center", name: "chevron-right" }) })
            },
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
}
const usqldbsProps = {
    title: 'UsqlDB',
    info: Info,
    formRows: [
        {
            label: '数据库名',
            field: { name: 'dbname', type: 'string', maxLength: 50, required: true },
        },
        {
            label: '描述',
            field: { name: 'discription', type: 'string', maxLength: 50, required: true },
        },
        {
            label: '云服务商',
            field: { name: 'cloud', type: 'string', maxLength: 20, required: true },
        },
        {
            label: 'Connection',
            field: { name: 'connection', type: 'string', maxLength: 200 },
            face: { type: 'textarea' }
        },
    ],
    row: (item) => {
        let { dbname, discription, cloud } = item;
        return React.createElement(Row, { icon: consts.appItemIcon, main: discription, vice: React.createElement(React.Fragment, null, dbname + '@' + cloud) });
    },
    items: () => store.dev.usqldbs,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};
export default usqldbsProps;
//# sourceMappingURL=usqldbs.js.map