import {observable, IObservableArray, computed} from 'mobx';
import {uid} from './uid';

export abstract class PageItems<T> {
    constructor(itemObservable:boolean = false) {
        this._items = observable.array<T>([], {deep:itemObservable});
    }
    private isFirst: boolean = true;
    @observable loading: boolean = false;
    @observable private beforeLoad: boolean = true;
    @observable protected loaded: boolean = false;
    protected _items:IObservableArray<T>;
    @observable allLoaded: boolean = false;
    @computed get items():IObservableArray<T> {
        if (this.beforeLoad === true) return null;
        if (this.loaded === false) return undefined;
        return this._items;
    }

    @observable topDiv:string;
    @observable bottomDiv:string;
    scrollToTop() {
        this.topDiv = '$$'+uid();
    }
    scrollToBottom() {
        this.bottomDiv = '$$'+uid();
    }

    protected param: any;
    protected firstSize = 100;
    protected pageStart = undefined;
    protected pageSize = 30;
    protected appendPosition:'head'|'tail' = 'tail';

    protected abstract async load(param:any, pageStart:any, pageSize:number):Promise<T[]>;
    protected abstract setPageStart(item:T);

    reset() {
        this.isFirst = true;
        this.beforeLoad = true;
        this.loaded = false;
        this.param = undefined;
        this.allLoaded = false;
        this._items.clear();
        this.setPageStart(undefined);
    }

    append(item:T) {
        if (this.appendPosition === 'tail')
            this._items.unshift(item);
        else
            this._items.push(item);
    }

    async first(param:any):Promise<void> {
        this.reset();
        this.beforeLoad = false;
        this.param = param;
        await this.more();        
    }

    async more():Promise<void> {
        if (this.allLoaded === true) return;
        if (this.loading === true) return;
        this.loading = true;
        let pageSize = this.pageSize + 1;
        if (this.isFirst === true) {
            if (this.firstSize > this.pageSize) pageSize = this.firstSize+1;
        }
        let ret = await this.load(
                this.param, 
                this.pageStart,
                pageSize);
        this.loading = false;
        this.loaded = true;
        let len = ret.length;
        if (this.isFirst===true && len>this.firstSize ||
            this.isFirst===false && len>this.pageSize)
        {
            this.allLoaded = false;
            --len;
            ret.splice(len, 1);
        }
        else {
            this.allLoaded = true;
        }
        if (len === 0) {
            this._items.clear();
            return;
        }
        this.setPageStart(ret[len-1]);
        if (this.appendPosition === 'tail')
            this._items.push(...ret);
        else
            this._items.unshift(...ret.reverse());
        this.isFirst = false;
    }
}
