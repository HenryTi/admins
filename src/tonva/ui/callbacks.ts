export interface Callback {
    (...params:any[]): Promise<void>;
}

export class Callbacks<T extends Callback> {
    private list: T[];
    get has():boolean {return this.list !== undefined && this.list.length>0}
    register(callback: T) {
        if (this.list === undefined) this.list = [];
        let index = this.list.findIndex(v => v === callback);
        if (index < 0) this.list.push(callback);
    }
    unregister(callback: T) {
        if (this.list === undefined) return;
        let index = this.list.findIndex(v => v === callback);
        if (index >= 0) this.list.splice(index);
    }
    call(...params:any[]) {
        if (this.list === undefined) return;
        for (let callback of this.list) callback(params);
    }
}
