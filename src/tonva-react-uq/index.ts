import * as React from 'react';
import { CApp, AppUI } from './controllers';
export * from './entities';
export * from './controllers';
export * from './centerApi';
export * from './tools';

function convertUIKeyToLowercase(obj: any) {
    for (let i in obj) {
        let v = obj[i];
        obj[i.toLowerCase()] = v;
        if (typeof v !== 'object') continue;
        if (React.isValidElement(v)) continue;
        if (Array.isArray(v) !== true) {
            convertUIKeyToLowercase(v);
            continue;
        }
        for (let i of (v as any[])) {
            convertUIKeyToLowercase(i);
        }
    }
}

export async function startApp(ui: AppUI) {
    convertUIKeyToLowercase(ui);
    let cApp = new (ui && ui.CApp || CApp)(ui);
    await cApp.start();
}
