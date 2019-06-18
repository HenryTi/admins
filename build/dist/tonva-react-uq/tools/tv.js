import * as React from 'react';
import { observer } from 'mobx-react';
import { PureJSONContent } from '../controllers';
import { FA } from 'tonva-react-form';
function boxIdContent(bi, ui, x) {
    if (typeof bi === 'number')
        return React.createElement(React.Fragment, null, bi);
    let { id, _$tuid, _$com } = bi;
    if (id === undefined || id === null)
        return;
    let t = _$tuid;
    if (t === undefined) {
        if (ui !== undefined)
            return ui(bi, x);
        return PureJSONContent(bi, x);
    }
    let com = ui || _$com;
    if (com === undefined) {
        com = bi._$com = t.getTuidContent();
    }
    let val = t.valueFromId(id);
    if (val === undefined) {
        return React.createElement(React.Fragment, null,
            "[",
            React.createElement(FA, { className: "text-danger", name: "bug" }),
            " no ",
            t.name,
            " on id=",
            id,
            "]");
    }
    switch (typeof val) {
        case 'number':
            val = { id: val };
            break;
    }
    if (ui !== undefined) {
        let ret = ui(val, x);
        if (ret !== undefined)
            return ret;
        return React.createElement(React.Fragment, null, id);
    }
    return React.createElement(com, val);
}
const Tv = observer(({ tuidValue, ui, x, nullUI }) => {
    if (tuidValue === undefined) {
        if (nullUI === undefined)
            return React.createElement(React.Fragment, null, "[undefined]");
        return nullUI();
    }
    if (tuidValue === null) {
        if (nullUI === undefined)
            return React.createElement(React.Fragment, null, "[null]");
        return nullUI();
    }
    let ttv = typeof tuidValue;
    switch (ttv) {
        default:
            if (ui === undefined)
                return React.createElement(React.Fragment, null,
                    ttv,
                    "-",
                    tuidValue);
            else {
                let ret = ui(tuidValue, x);
                if (ret !== undefined)
                    return ret;
                return React.createElement(React.Fragment, null, tuidValue);
            }
        case 'object':
            let divObj = boxIdContent(tuidValue, ui, x);
            if (divObj !== undefined)
                return divObj;
            return nullUI();
        case 'number':
            return React.createElement(React.Fragment, null,
                "id...",
                tuidValue);
    }
});
export const tv = (tuidValue, ui, x, nullUI) => {
    return React.createElement(Tv, { tuidValue: tuidValue, ui: ui, x: x, nullUI: nullUI });
};
//# sourceMappingURL=tv.js.map