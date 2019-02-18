import * as React from 'react';
import { FA } from './FA';
export class IconText extends React.Component {
    render() {
        let { icon, iconClass, text, textClass } = this.props;
        return React.createElement("div", { className: "py-2" },
            React.createElement(FA, { className: iconClass, name: icon, fixWidth: true }),
            React.createElement("span", { className: textClass }, text));
    }
}
//# sourceMappingURL=IconText.js.map