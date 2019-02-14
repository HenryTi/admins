import * as React from 'react';
import { IObservableArray, computed } from 'mobx';
import { PageItems } from 'tonva-tools';
import {List} from './index';

export abstract class ListBase {
    protected list: List;
    constructor(list: List) {
        this.list = list;
    }
    get isPaged():boolean {
        let items = this.list.props.items;
        return (items !== null && items !== undefined && Array.isArray(items) === false);
    }
    get items():any[]|IObservableArray<any> {
        let items = this.list.props.items;
        if (items === null) return null;
        if (items === undefined) return undefined;
        if (Array.isArray(items) === true)
            return items as IObservableArray<any>;
        else
            return (items as PageItems<any>).items;
    }
    @computed get loading():boolean {
        let items = this.list.props.items;
        if (items === null) return false;
        if (items === undefined) return true;
        let pageItems = items as PageItems<any>;
        if (pageItems.items === undefined) return false;
        return pageItems.loading;
    }
    get selectedItems():any[] { return; }
    updateProps(nextProps:any) {}
    abstract render(item:any, index:number):JSX.Element;
    protected renderContent(item:any, index:number) {
        let {render} = this.list.props.item;
        if (render === undefined) return <div className="px-3 py-2">{JSON.stringify(item)}</div>;
        return render(item, index);
    }
}
