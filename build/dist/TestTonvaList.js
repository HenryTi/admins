import * as React from 'react';
import { Page } from 'tonva';
import { List, LMR, Badge, FA, StackedFA } from 'tonva';
import { appIcon } from './consts';
export default class TestTonvaMultiForm extends React.Component {
    constructor() {
        super(...arguments);
        this.listProps = {
            items: [
                { text: "a1" },
                { text: "a2" },
            ],
            item: {
                render: (item, index) => (index === 0 ?
                    React.createElement(LMR, { className: "py-1 px-2 align-items-stretch", left: React.createElement(Badge, { badge: 1 },
                            React.createElement("img", { src: appIcon })), right: React.createElement("small", { className: "d-block align-self-end" }, "KK") },
                        React.createElement("div", null,
                            React.createElement("h6", null, "ddd"),
                            React.createElement("div", null, item.text))) :
                    React.createElement(LMR, { className: "py-1 px-2 align-items-center", left: React.createElement(Badge, { badge: 2, size: "sm" },
                            React.createElement(StackedFA, { size: "lg" },
                                React.createElement(FA, { name: "square-o", className: "fa-stack-2x text-primary" }),
                                React.createElement(FA, { name: "twitter", className: "fa-stack-1x text-success" }))), right: React.createElement("small", null,
                            React.createElement(FA, { name: "chevron-right" })) }, item.text)),
                //<div style={{padding:'8px 0', flex:1}}>{item.text}</div>
                //    <div style={{padding:'8px 0'}}>{item.text}</div>
                //</div>,
                onSelect: (item, selected, anySelected) => {
                    alert(JSON.stringify(item) + ' ' +
                        (selected ? 'selected' : 'unselected') + ' ' +
                        (anySelected ? 'any selected' : 'nothing selected'));
                },
            }
        };
    }
    render() {
        return React.createElement(Page, { header: "Tonva List" },
            React.createElement(List, Object.assign({}, this.listProps)));
    }
}
//# sourceMappingURL=TestTonvaList.js.map