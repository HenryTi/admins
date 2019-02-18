var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { CApp } from "./CApp";
function convertUIKeyToLowercase(obj) {
    for (let i in obj) {
        let v = obj[i];
        obj[i.toLowerCase()] = v;
        if (typeof v !== 'object')
            continue;
        if (React.isValidElement(v))
            continue;
        if (Array.isArray(v) !== true) {
            convertUIKeyToLowercase(v);
            continue;
        }
        for (let i of v) {
            convertUIKeyToLowercase(i);
        }
    }
}
// const appName = 'JKDev/jkOrder';
export function startApp(appName, ui) {
    return __awaiter(this, void 0, void 0, function* () {
        convertUIKeyToLowercase(ui);
        let cApp = new (ui && ui.CApp || CApp)(appName, ui || { uqs: {} });
        yield cApp.start();
    });
}
//# sourceMappingURL=startApp.js.map