import * as React from 'react';
import { List, Muted, LMR, EasyDate, FA } from 'tonva-react-form';
import { VEntity } from '../CVEntity';
const leftFlowStyle = { width: '8rem' };
export class VSheetView extends VEntity {
    constructor() {
        super(...arguments);
        //data: any;
        //state: string;
        //flows:any[];
        this.flowRow = (item, index) => {
            let { date, user, preState, state, action } = item;
            if (action === undefined)
                action = React.createElement(React.Fragment, null,
                    React.createElement(FA, { className: "text-primary", name: "pencil-square-o" }),
                    " \u5236\u5355");
            let to;
            switch (state) {
                case '$': break;
                case '#':
                    to = React.createElement(React.Fragment, null,
                        React.createElement(FA, { className: "text-success", name: "file-archive-o" }));
                    break;
                default:
                    to = React.createElement(React.Fragment, null,
                        React.createElement(FA, { className: "text-muted", name: "arrow-right" }),
                        " \u00A0 ",
                        state);
                    break;
            }
            /*
            return <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm"><div className="p-2">{to}</div></div>
                <div className="col-sm text-right"><div className="p-2"><Muted><EasyDate date={date} /></Muted></div></div>
            </div>;
            */
            return React.createElement(LMR, { left: React.createElement("div", { className: "pl-3 py-2", style: leftFlowStyle }, action), right: React.createElement("div", { className: "p-2" },
                    React.createElement(Muted, null,
                        React.createElement(EasyDate, { date: date }))) },
                React.createElement("div", { className: "p-2" }, to));
        };
        this.sheetView = () => {
            let { brief, flows } = this.sheetData;
            let removed;
            if (brief.state === '-')
                removed = React.createElement("div", { className: "mx-3 my-2", style: { color: 'red' } }, "\u672C\u5355\u636E\u4F5C\u5E9F");
            return React.createElement("div", null,
                removed,
                this.vForm.render(),
                React.createElement(List, { header: React.createElement(Muted, { className: "mx-3 my-1" }, "\u6D41\u7A0B"), items: flows, item: { render: this.flowRow } }));
        };
    }
}
//# sourceMappingURL=vSheetView.js.map