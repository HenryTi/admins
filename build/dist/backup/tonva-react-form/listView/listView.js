var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { ListRow } from './listRow';
let ListView = class ListView extends React.Component {
    render() {
        let { header, items, beforeLoad, none, renderRow, className, footer, itemClick, converter } = this.props;
        let cn = classNames(className, 'va-list');
        let content, elHeader;
        if (items === undefined)
            content = beforeLoad === null ? null : React.createElement("li", { className: 'empty' }, beforeLoad || '...');
        else if (items.length === 0) {
            content = (React.createElement("li", { className: 'empty' }, none || '[none]'));
        }
        else if (renderRow !== undefined) {
            content = items.map((item, index) => renderRow(item, index, this.props.ex));
        }
        else {
            content = items.map((item, index) => {
                let onClick = item.onClick;
                if (onClick === undefined && itemClick !== undefined)
                    onClick = () => itemClick(item);
                let listItem;
                if (converter !== undefined) {
                    listItem = converter(item);
                    if (listItem === undefined)
                        return null;
                }
                else {
                    listItem = Object.assign({}, item);
                }
                if (listItem.key === undefined)
                    listItem.key = listItem.main;
                return React.createElement(ListRow, Object.assign({ onClick: onClick }, listItem));
            });
        }
        if (header !== undefined) {
            if (typeof header === 'string') {
                elHeader = React.createElement("div", { className: 'va-list-header' }, header);
            }
            else {
                elHeader = header;
            }
        }
        return (React.createElement("div", { className: cn },
            elHeader,
            React.createElement("ul", null, content),
            footer));
    }
};
ListView = __decorate([
    observer
], ListView);
export { ListView };
//# sourceMappingURL=listView.js.map