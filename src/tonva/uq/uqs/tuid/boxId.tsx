import * as React from 'react';
import { Tuid, TuidLocal } from './tuid';
import { TuidDiv } from './tuidDiv';
import { TvTemplet } from '../../tools';
import { PureJSONContent } from '../../controllers';

export class BoxId {
    readonly id: number;
    //obj?: any;
    //content: (templet?:(values?:any, x?:any)=>JSX.Element, x?:any)=>JSX.Element;
    //valueFromFieldName: (fieldName:string)=>BoxId|any;
    //_$com?: any;
    //_$tuid?: TuidBase;
    //getObj: ()=>any;
    protected tuid: Tuid;
    get obj():any {
        return this.tuid.valueFromId(this.id);
    }

    constructor(tuid: Tuid, id: number) {
        this.tuid = tuid;
        this.id = id;
    }

    render(ui:TvTemplet, x:any):JSX.Element {
        if (this.id === undefined || this.id === null) return;
        let boxName = this.boxName(); // this.tuid.name;
        let val = this.obj; // this.tuid.valueFromId(this.id);
        if (this.isUndefined() === true) {
            if (ui !== undefined) return ui(val, x);
            return PureJSONContent(val, x);
        }
        switch (typeof val) {
            case 'undefined':
                return <del className="text-black-50">{boxName} undefined</del>;
            case 'number':
                return <del className="text-black-50">{boxName} {this.id}</del>;
        }
        if (ui === undefined) {
            ui = this.ui();
        }
        if (ui !== undefined) {
            let ret = ui(val, this.res());
            if (ret !== undefined) return ret;
            return <del className="text-danger">{boxName} {this.id}</del>;
        }

        return PureJSONContent(val);
    }

    boxName():string {return this.tuid.name}
    //valueFromId(): any {return this.tuid.valueFromId(this.id)}
    isUndefined(): boolean {return this.tuid === undefined}
    ui(): TvTemplet {return this.tuid.ui}
    res(): any {return this.tuid.res}

    async assure(): Promise<void> {
        await this.tuid.assureBox(this.id);
    }
}

export class BoxDivId extends BoxId {
    private div: TuidDiv;
    constructor(tuid: Tuid, div: TuidDiv, id: number) {
        super(tuid, id);
        this.div = div;
    }
    get obj():any {
        return this.div.valueFromId(this.id);
    }
    boxName():string {return this.div.name}
    //valueFromId(): any {return this.div.valueFromId(this.id)}
    isUndefined(): boolean {return this.div === undefined}
    ui(): TvTemplet {return this.div.ui}
    res(): any {return this.div.res}

    async assure(): Promise<void> {
        await this.div.assureBox(this.id);
    }

/*
    render(ui:TvTemplet, x:any):JSX.Element {
        if (this.id === undefined || this.id === null) return;
        //let {name} = this.tuid;
        let boxName = this.div.name;
        let val = this.div.valueFromId(this.id);
        if (this.div === undefined) {
            if (ui !== undefined) return ui(val, x);
            return PureJSONContent(val, x);
        }
        switch (typeof val) {
            case 'undefined':
                return <del className="text-black-50">{boxName} undefined</del>;
            case 'number':
                return <del className="text-black-50">{boxName} {this.id}</del>;
        }
        if (ui === undefined) {
            ui = this.div.ui;
        }
        if (ui !== undefined) {
            return PureJSONContent(val);
        }

        let ret = ui(val, this.div.res);
        if (ret !== undefined) return ret;
        return <del className="text-danger">{boxName} {this.id}</del>;
    }
*/
}
