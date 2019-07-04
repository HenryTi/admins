export function toUiSelectItems(items) {
    if (items === undefined)
        return;
    let ret = [];
    for (let item of items) {
        let pos = item.indexOf(':');
        let val;
        let title;
        if (pos < 0) {
            val = Number(item);
        }
        else {
            val = Number(item.substr(0, pos));
            title = item.substr(pos + 1);
        }
        ret.push({ value: val, title: title });
    }
    return ret;
}
//# sourceMappingURL=toUiSelectItems.js.map