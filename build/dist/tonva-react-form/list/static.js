import * as React from 'react';
import * as classNames from 'classnames';
import { ListBase } from './base';
import { uid } from '../uid';
export class Static extends ListBase {
    render(item, index) {
        let { className, key, render } = this.list.props.item;
        if (typeof item === 'string') {
            let cn = classNames('va-list-gap', 'px-3', 'pt-1');
            return React.createElement("li", { key: uid(), className: cn }, item);
        }
        return React.createElement("li", { key: key === undefined ? index : key(item), className: classNames(className) }, this.renderContent(item, index));
    }
}
//# sourceMappingURL=static.js.map