import * as React from 'react';
import { observer } from 'mobx-react';
import { BoxId, Tuid } from "../entities";
import { PureJSONContent } from '../controllers';

type TvTemplet = (values?:any, x?:any) => JSX.Element;

interface Props {
    tuidValue: number|BoxId, 
    ui?: TvTemplet,
    x?: any,
    nullUI?: ()=>JSX.Element
}

function boxIdContent(bi: number|BoxId, ui:TvTemplet, x:any) {
    if (typeof bi === 'number') return <>{bi}</>;
    let {id, _$tuid, _$com} = bi as BoxId;
    let t:Tuid = _$tuid;
    if (t === undefined) {
        if (ui !== undefined) return ui(bi, x);
        return PureJSONContent(bi, x);
    }
    let com = ui || _$com;
    if (com === undefined) {
        com = bi._$com = t.getTuidContent();
    }
    let val = t.valueFromId(id);
    if (typeof val === 'number') val = {id: val};
    if (ui !== undefined) {
        let ret = ui(val, x);
        if (ret !== undefined) return ret;
        return <>{id}</>;
    }
    return React.createElement(com, val);
}

const Tv = observer(({tuidValue, ui, x, nullUI}:Props) => {
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
        case 'undefined':
            break;
        case 'object':
            if (tuidValue !== null) return boxIdContent(tuidValue, ui, x);
            break;
        case 'number':
            return <>id...{tuidValue}</>;
    }       
    if (nullUI === undefined) return <>.</>;
    return nullUI();
});

export const tv = (tuidValue:number|BoxId, ui?:TvTemplet, x?:any, nullUI?:()=>JSX.Element):JSX.Element => {
    return <Tv tuidValue={tuidValue} ui={ui} x={x} nullUI={nullUI} />;
};
