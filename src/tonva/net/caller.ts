export abstract class Caller<T> {
    protected readonly params: T;
    constructor(params: T) {
        this.params = params;
    }
    buildParams():any {return this.params;}
    method: string  = 'POST';
    abstract get path(): string;
    get headers(): {[header:string]: string} {return undefined}
}
