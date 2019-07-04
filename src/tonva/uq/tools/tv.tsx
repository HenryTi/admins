import * as React from 'react';
import { observer } from 'mobx-react';
import { BoxId, Tuid } from '../uqs';
import { PureJSONContent } from '../controllers';

export type TvTemplet = (values?:any, x?:any) => JSX.Element;

interface Props {
    tuidValue: number|BoxId, 
    ui?: TvTemplet,
    x?: any,
    nullUI?: ()=>JSX.Element
}

function boxIdContent(bi: number|BoxId, ui:TvTemplet, x:any) {
    let logContent:any;
    switch(typeof bi) {
        case 'undefined': logContent = <>boxId undefined</>; break;
        case 'number': logContent = <>id:{bi}</>; break;
    }
    if (typeof (bi as any).render !== 'function') {
        if (ui === undefined) {
            logContent = PureJSONContent(bi, x);
        }
        else {
            return ui(bi, x);
        }
    }
    if (logContent !== undefined) {
        return <del className="text-danger">{logContent}</del>;
    }
    return (bi as any).render(ui, x);
    /*
    let {id, _$tuid, _$com} = bi;
    if (id === undefined || id === null) return;
    let t:TuidBase = _$tuid;
    if (t === undefined) {
        if (ui !== undefined) return ui(bi, x);
        return PureJSONContent(bi, x);
    }
    let com = ui || _$com;
    if (com === undefined) {
        com = bi._$com = t.getTuidContent();
    }
    let val = t.valueFromId(id);
    if (val === undefined) {
        return <>[<FA className="text-danger" name="bug" /> no {t.name} on id={id}]</>;
    }
    switch (typeof val) {
        case 'number': val = {id: val}; break;
    }
    if (ui !== undefined) {
        let ret = ui(val, x);
        if (ret !== undefined) return ret;
        return <>{id}</>;
    }
    return React.createElement(com, val);
    */
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
