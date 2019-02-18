var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Clickable } from './clickable';
import { Static } from './static';
import { Selectable } from './selectable';
import "../css/va-list.css";
let List = class List extends React.Component {
    constructor(props) {
        super(props);
        this._$scroll = (direct) => {
            console.log('############### items scroll to ' + direct);
        };
        let { item } = this.props;
        let { onClick, onSelect } = item;
        if (onSelect !== undefined)
            this.listBase = new Selectable(this);
        else if (onClick !== undefined)
            this.listBase = new Clickable(this);
        else
            this.listBase = new Static(this);
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.listBase.updateProps(nextProps);
    }
    get selectedItems() {
        return this.listBase.selectedItems;
    }
    render() {
        let { className, header, footer, before, loading, none, item, selectedItems } = this.props;
        if (before === undefined)
            before = 'before';
        if (loading === undefined)
            loading = 'loading';
        if (none === undefined)
            none = 'none';
        //this.listBase.selectedItems = selectedItems;
        let { isPaged, items, loading: isLoading } = this.listBase;
        function staticRow(row, type) {
            if (!row)
                return;
            switch (typeof row) {
                default:
                case 'string': return React.createElement("li", { className: "va-list-" + type }, row);
                case 'function': return React.createElement("li", { className: "va-list-" + type }, row());
                case 'object': return React.createElement("li", null, row);
            }
        }
        let content;
        if (items === null)
            content = staticRow(before, 'before');
        else if (items === undefined)
            content = staticRow(loading, 'loading');
        else if (items.length === 0)
            content = staticRow(none, 'none');
        else {
            content = items.map((item, index) => {
                return this.listBase.render(item, index);
            });
        }
        return React.createElement("ul", { className: classNames('va-list', className) },
            staticRow(header, 'header'),
            content,
            staticRow(footer, 'footer'));
    }
};
List = __decorate([
    observer
], List);
export { List };
//# sourceMappingURL=index.js.map