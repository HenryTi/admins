import * as React from 'react';
import * as classNames from 'classnames';
import { ListBase } from './base';
export class Clickable extends ListBase {
    render(item, index) {
        let { className, key, onClick } = this.list.props.item;
        return React.createElement("li", { key: key === undefined ? index : key(item), className: classNames('va-row-clickable', className), onClick: () => onClick(item) }, this.renderContent(item, index));
    }
}
//# sourceMappingURL=clickable.js.map