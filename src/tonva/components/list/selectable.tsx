import * as React from 'react';
import {observable, IObservableArray, autorun, IReactionDisposer} from 'mobx';
import classNames from 'classnames';
import {ListBase} from './base';
import {uid} from '../../tool/uid';
import { PageItems } from '../../tool/pageItems';
import { List } from './index';

export interface SelectableItem {
    selected: boolean;
    item: any;
    labelId: string;
}

export class Selectable extends ListBase {
    @observable private _items: SelectableItem[];
    //private _selectedItems: any[];
    private input: HTMLInputElement;
    private disposer: IReactionDisposer;

    constructor(list: List) {
        super(list);
        this.disposer = autorun(this.buildItems);
        //this.buildItems();
    }
    dispose() {this.disposer()};
    private buildItems = () => {
        console.log('buildItems in selectable.tsx');
        let {items, selectedItems, compare} = this.list.props;
        let itemsArray:any[] | IObservableArray<any>;
        if (items === undefined) {
            this._items = undefined;
            return;
        }
        if (items === null) {
            this._items = null;
            return;
        }
        if (Array.isArray(items) === true) {
            itemsArray = items as any;
        }
        else {
            itemsArray = (items as PageItems<any>).items;
        }
        //let items = this.items;
        //this._selectedItems = selectedItems;

        let comp: ((item:any, selectItem:any)=>boolean);
        if (compare === undefined) {
            comp = (item:any, selectItem:any) => item === selectItem;
        }
        else {
            comp = compare;
        }
        let retItems = itemsArray.map(v => {
            //let isObserved = isObservable(v);
            //let obj = isObserved === true? toJS(v) : v;
            //let obj = v;
            let selected = selectedItems === undefined?
                false
                : selectedItems.find(si => comp(v, si)) !== undefined;
            return {
                selected: selected, 
                item: v, 
                labelId:uid()
            };
        });
        this._items = retItems;
    }

    get items() {
        //if (this._items === undefined) 
        //this.buildItems();
        return this._items;
    }
    selectAll() {
        if (this._items) this._items.forEach(v => v.selected = true);
    }
    unselectAll() {
        if (this._items) this._items.forEach(v => v.selected = false);
    }
    /*
    updateProps(nextProps:any) {
        if (nextProps.selectedItems === this._selectedItems) return;
        this.buildItems();
    }
    */
    private onSelect(item:SelectableItem, selected:boolean) {
        item.selected = selected;
        let anySelected = this._items.some(v => v.selected);
        this.list.props.item.onSelect(item.item, selected, anySelected);
    }
    
    get selectedItems():any[] {
        return this._items.filter(v => v.selected === true).map(v => v.item);
    }
    /*
    set selectedItems(value: any[]) {
        if (value === undefined) return;
        if (this._items === undefined) return;
        let sLen = this._items.length;
        let list = value.slice();
        for (let n=0; n<sLen; n++) {
            let sItem = this._items[n];
            let len = list.length;
            if (len === 0) break;
            let item = sItem.item;
            for (let i=0; i<len; i++) {
                let v = list[i];
                if (item === v) {
                    sItem.selected = true;
                    value.splice(i, 1);
                    break;
                }
            }
        };
    }
    */
    //w-100 mb-0 pl-3
    //m-0 w-100
    render = (item:SelectableItem, index:number):JSX.Element => {
        let {className, key} = this.list.props.item;
        let {labelId, selected, item:obItem} = item;
        return <li key={key===undefined?index:key(item)} className={classNames(className)}>
            <div className="d-flex align-items-center px-3">
                <input ref={input=>{
                        if (!input) return;
                        this.input = input; input.checked = selected;
                    }}
                    className="" type="checkbox" value="" id={labelId}
                    defaultChecked={selected}
                    onChange={(e)=>{
                        this.onSelect(item, e.target.checked)} 
                    }/>
                <label className="" style={{flex:1, marginBottom:0}} htmlFor={labelId}>
                    {this.renderContent(obItem, index)}
                </label>
            </div>
        </li>
    }
}
/*
<label>
<label className="custom-control custom-checkbox">
    <input type='checkbox' className="custom-control-input"
        //checked={selected}
        onChange={(e)=>this.onSelect(item, e.target.checked)} />
    <span className="custom-control-indicator" />
</label>
{this.renderContent(item.item, index)}
</label>
*/
