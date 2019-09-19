import * as React from 'react';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {PageItems} from '../../tool/pageItems';
import {ListBase} from './base';
import {Clickable} from './clickable';
import {Static} from './static';
import {Selectable} from './selectable';
import '../../css/va-list.css';
import { IObservableArray } from 'mobx';

type StaticRow = string|JSX.Element|(()=>string|JSX.Element);

export interface ListProps {
    className?: string|string[];
    items: any[] | IObservableArray<any> | PageItems<any>;
    item: {
        className?: string|string[];
        render?: (item:any, index:number) => JSX.Element;
        onSelect?: (item:any, isSelected:boolean, anySelected:boolean)=>void;
        onClick?: (item:any)=>void;
        key?: (item:any)=>string|number;
    };
    compare?:(item:any, selectItem:any)=>boolean;
    selectedItems?:any[];
    header?: StaticRow;
    footer?: StaticRow;
    before?: StaticRow;
    loading?: StaticRow;
    none?: StaticRow;
}

@observer
export class List extends React.Component<ListProps> {
    private listBase: ListBase;
    private selectable: Selectable;
    constructor(props:ListProps) {
        super(props);
        this.buildBase();
    }
    _$scroll = (direct: 'top'|'bottom') => {
        console.log('############### items scroll to ' + direct);
    }
    private buildBase() {
        let {item} = this.props;
        let {onClick, onSelect} = item;
        if (onSelect !== undefined)
            this.selectable = this.listBase = new Selectable(this);
        else if (onClick !== undefined)
            this.listBase = new Clickable(this);
        else
            this.listBase = new Static(this);
    }
    /*
    componentWillUpdate(nextProps:ListProps, nextState, nextContext) {
        //this.listBase.updateProps(nextProps);
    }
    */
    componentWillUnmount() {
        this.listBase.dispose();
    }
    selectAll() {
        if (this.selectable) this.selectable.selectAll();
    }
    unselectAll() {
        if (this.selectable) this.selectable.unselectAll();
    }
    get selectedItems():any[] {
        return this.listBase.selectedItems;
    }
    render() {
        let {className, header, footer, before, loading, none} = this.props;
        if (before === undefined) before = '-';
        if (loading === undefined) loading = () => <i className="fa fa-spinner fa-spin fa-2x fa-fw text-info" />;
        if (none === undefined) none = 'none';
        //this.listBase.selectedItems = selectedItems;
        let {items, loading:isLoading} = this.listBase;
        function staticRow(row:StaticRow, type:string) {
            if (!row) return;
            switch (typeof row) {
                default:
                case 'string': return <li className={"va-list-"+type}>{row}</li>;
                case 'function': return <li className={"va-list-"+type}>{(row as ()=>string|JSX.Element)()}</li>;
                case 'object': return <li>{row}</li>
            } 
        }
        let content:any, waitingMore:any;
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
        if (isLoading === true && items) {
            waitingMore = staticRow(loading, 'loading');
        }
        return <ul className={classNames('va-list', className)}>
            {staticRow(header, 'header')}
            {content}
            {waitingMore}
            {staticRow(footer, 'footer')}
        </ul>;
    }
}
