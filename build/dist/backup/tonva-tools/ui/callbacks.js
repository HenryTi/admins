export class Callbacks {
    get has() { return this.list !== undefined && this.list.length > 0; }
    register(callback) {
        if (this.list === undefined)
            this.list = [];
        let index = this.list.findIndex(v => v === callback);
        if (index < 0)
            this.list.push(callback);
    }
    unregister(callback) {
        if (this.list === undefined)
            return;
        let index = this.list.findIndex(v => v === callback);
        if (index >= 0)
            this.list.splice(index);
    }
    call(...params) {
        if (this.list === undefined)
            return;
        for (let callback of this.list)
            callback(params);
    }
}
//# sourceMappingURL=callbacks.js.map