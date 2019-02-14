function replacer(key:string, value:any) {
    let first = key.substr(0, 1);
    switch (first) {
        default: return value;
        case '$':
        case '_': return;
    }
}

export function jsonStringify(value:any) {
    return JSON.stringify(value, replacer, ' ');
}
