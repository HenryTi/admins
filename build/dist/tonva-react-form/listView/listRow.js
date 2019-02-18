var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import '../css/va-row.css';
let ListRow = class ListRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
        };
    }
    render() {
        let { date, main, vice, middle, midSize, icon, unread, right, onClick } = this.props;
        let header, isIcon, noteNum;
        if (unread !== undefined) {
            let uv;
            if (typeof unread === 'number')
                uv = unread;
            else
                uv = unread.get();
            if (uv > 0)
                noteNum = React.createElement("b", null, uv);
            else if (uv < 0)
                noteNum = React.createElement("b", { className: 'dot' });
        }
        switch (typeof icon) {
            case 'object':
                header = React.createElement("header", null,
                    icon,
                    noteNum);
                isIcon = false;
                break;
            case 'string':
                header = React.createElement("header", { className: 'icon' },
                    React.createElement("img", { src: icon }),
                    noteNum);
                isIcon = true;
                break;
        }
        let mid;
        if (middle !== undefined) {
            switch (typeof middle) {
                case 'string':
                    mid = React.createElement("div", { style: { flex: midSize } }, middle);
                    break;
                default:
                    mid = middle;
                    break;
            }
        }
        let footer;
        if (right !== undefined) {
            if (typeof right === 'string')
                footer = React.createElement("footer", null,
                    React.createElement("small", { className: "text-muted" }, right));
            else
                footer = React.createElement("footer", null, right);
        }
        let viceSpan;
        if (vice !== undefined)
            viceSpan = React.createElement("span", null, vice);
        let cn = classNames('va-row', { icon: isIcon, pressed: this.state.pressed }, { "va-action": onClick !== undefined });
        return (React.createElement("li", { className: cn, onClick: onClick },
            header,
            React.createElement("div", null,
                React.createElement("div", null, main),
                viceSpan),
            mid,
            footer));
    }
};
ListRow = __decorate([
    observer
], ListRow);
export { ListRow };
//# sourceMappingURL=listRow.js.map