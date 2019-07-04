import * as React from 'react';
import { EasyDate } from 'tonva';
export class IdDates extends React.Component {
    render() {
        let { date_init, date_update } = this.props;
        return React.createElement("small", { className: "text-muted" },
            "\u4E0A\u6B21\u4FEE\u6539: ",
            React.createElement(EasyDate, { date: date_update }),
            React.createElement("i", { className: "fa fa-fw" }),
            "\u521B\u5EFA: ",
            React.createElement(EasyDate, { date: date_init }));
    }
}
//# sourceMappingURL=idDates.js.map