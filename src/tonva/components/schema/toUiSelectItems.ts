import { UiSelectListItem } from './uiSchema';

export function toUiSelectItems(items: string[]):UiSelectListItem[] {
    if (items === undefined) return;
    let ret:UiSelectListItem[] = [];
    for (let item of items) {
        let pos = item.indexOf(':');
        let val:number;
        let title: string;
        if (pos < 0) {
            val = Number(item);
        }
        else {
            val = Number(item.substr(0, pos));
            title = item.substr(pos+1);
        }
        ret.push({value: val, title: title});
    }
    return ret;
}