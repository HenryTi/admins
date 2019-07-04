function replacer(key, value) {
    let first = key.substr(0, 1);
    switch (first) {
        default: return value;
        case '$':
        case '_': return;
    }
}
export function jsonStringify(value) {
    return JSON.stringify(value, replacer, ' ');
}
//# sourceMappingURL=jsonStringify.js.map