import * as React from 'react';
import { LMR, Badge, Muted } from 'tonva-react-form';
export class Row extends React.Component {
    render() {
        let { icon, main, vice } = this.props;
        return React.createElement(LMR, { className: "py-1 px-3 align-items-stretch", left: React.createElement(Badge, { size: "sm", className: "pt-1" },
                React.createElement("img", { src: icon })) },
            React.createElement("div", { className: "px-3" },
                React.createElement("div", null,
                    React.createElement("b", null, main)),
                React.createElement("div", null,
                    React.createElement(Muted, null, vice))));
    }
}
//# sourceMappingURL=row.js.map