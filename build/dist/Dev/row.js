import * as React from 'react';
import { LMR, Badge } from 'tonva-react-form';
export class Row extends React.Component {
    render() {
        let { icon, main, vice } = this.props;
        return React.createElement(LMR, { className: "py-1 px-2 align-items-stretch", left: React.createElement(Badge, { size: "sm" },
                React.createElement("img", { src: icon })) },
            React.createElement("b", null, main),
            React.createElement("small", null, vice));
    }
}
//# sourceMappingURL=row.js.map