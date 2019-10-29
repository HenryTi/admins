export abstract class Caller<T> {
    protected readonly _params: T;
    constructor(params: T, waiting: boolean) {
        this._params = params;
        this.waiting = waiting;
    }
    protected get params():any {return this._params;}
    buildParams():any {return this.params;}
    method: string  = 'POST';
    abstract get path(): string;
    get headers(): {[header:string]: string} {return undefined}
    waiting: boolean;
}
