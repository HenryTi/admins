import * as React from 'react';
import { observer } from 'mobx-react';
import { Tuid, BoxId } from '../../uq';
import { PureJSONContent } from '../tools';

export class TuidWithUIRes {
    readonly tuid: Tuid;
    readonly ui: any;
    readonly res: any;
    constructor(tuid:Tuid, ui:any, res:any) {
        this.tuid = tuid;
        this.ui = ui;
        this.res = res;
    }
}

export class ReactBoxId implements BoxId {
    readonly id: number;
    protected tuidUR: TuidWithUIRes;
    readonly isUndefined:boolean;
    constructor(tuidUR: TuidWithUIRes, id: number) {
        this.tuidUR = tuidUR;
        this.id = id;
        this.isUndefined = (this.tuidUR.tuid === undefined);
    }

    get obj():any {
        return this.tuidUR.tuid.valueFromId(this.id);
    }

    render(ui:TvTemplet, x:any):JSX.Element {
        if (this.id === undefined || this.id === null) return;
        let boxName = this.boxName; // this.tuid.name;
        let val = this.obj; // this.tuid.valueFromId(this.id);
        if (this.isUndefined === true) {
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
            ui = this.tuidUR.ui;
        }
        if (ui !== undefined) {
            if (typeof ui !== 'function') {
                ui = (ui as any).content;
            }
            if (ui !== undefined) {
                let ret = ui(val, this.tuidUR.res);
                if (ret !== undefined) return ret;
                return <del className="text-danger">{boxName} {this.id}</del>;
            }
        }

        return PureJSONContent(val);
    }

    get boxName():string {return this.tuidUR.tuid.name}
    // ui(): TvTemplet {return this.tuid.ui}
    // res(): any {return this.tuid.res}

    async assure(): Promise<void> {
        await this.tuidUR.tuid.assureBox(this.id);
    }
}

function boxIdContent(bi: number|BoxId, ui:TvTemplet, x:any) {
    let logContent:any;
    let boxId:ReactBoxId = bi as ReactBoxId;
    switch(typeof bi) {
        case 'undefined': logContent = <>boxId undefined</>; break;
        case 'number': logContent = <>id:{bi}</>; break;
        default:
            if (typeof boxId.render !== 'function') {
                if (ui === undefined) {
                    logContent = PureJSONContent(bi, x);
                }
                else {
                    return ui(bi, x);
                }
            }
            break;
    }
    if (logContent !== undefined) {
        return <del className="text-danger">{logContent}</del>;
    }
    return boxId.render(ui, x);
}

export type TvTemplet = (values?:any, x?:any) => JSX.Element;

interface Props {
    tuidValue: number|BoxId, 
    ui?: TvTemplet,
    x?: any,
    nullUI?: ()=>JSX.Element
}

const Tv = observer(({tuidValue, ui, x, nullUI}:Props) => {
    if (tuidValue === undefined) {
        if (nullUI === undefined) return <>[undefined]</>;
        return nullUI();
    }
    if (tuidValue === null) {
        if (nullUI === undefined) return <>[null]</>;
        return nullUI();
    }
    let ttv = typeof tuidValue;
    switch (ttv) {
        default:
            if (ui === undefined)
                return <>{ttv}-{tuidValue}</>;
            else {
                let ret = ui(tuidValue, x);
                if (ret !== undefined) return ret;
                return <>{tuidValue}</>;
            }
        case 'object':
            let divObj = boxIdContent(tuidValue, ui, x);
            if (divObj !== undefined) return divObj;
            return nullUI === undefined? <>id null</>: nullUI();
        case 'number':
            return <>id...{tuidValue}</>;
    }
});

export const tv = (tuidValue:number|BoxId, ui?:TvTemplet, x?:any, nullUI?:()=>JSX.Element):JSX.Element => {
    return <Tv tuidValue={tuidValue} ui={ui} x={x} nullUI={nullUI} />;
};

/*
class BoxDivId extends BoxId {
    private div: TuidDiv;
    constructor(tuid: Tuid, div: TuidDiv, id: number) {
        super(tuid, id);
        this.div = div;
    }
    get obj():any {
        return this.div.valueFromId(this.id);
    }
    boxName():string {return this.div.name}
    isUndefined(): boolean {return this.div === undefined}
    ui(): TvTemplet {return this.div.ui}
    res(): any {return this.div.res}

    async assure(): Promise<void> {
        await this.div.assureBox(this.id);
    }
}
*/
