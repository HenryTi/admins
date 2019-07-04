import _ from 'lodash';

export interface KeyValueRes {
    [key:string]: any;
}

export interface Res<T extends KeyValueRes> {
    [lang:string]: T | {[district:string]: T};
}

export const resOptions:{lang:string, district:string} = {
    lang: undefined,
    district: undefined,
}

export function setResOptions(lang:string, district:string) {
    resOptions.lang = lang;
    resOptions.district = district;
}

(function() {
    let lang: string, district: string;
    let language = navigator.languages && navigator.languages[0] || // Chrome / Firefox
        navigator.language; // ||   // All browsers
    //navigator.userLanguage; // IE <= 10
    if (!language) {
        lang = 'zh';
        district = 'CN';
    }
    else {
        let parts = language.split('-');
        lang = parts[0];
        if (parts.length > 1) district = parts[1];
    }
    setResOptions(lang, district);
}());

export function resLang<T extends KeyValueRes>(res:Res<T>):T {
    let {lang, district} = resOptions;
    let ret:T = {} as T;
    if (res === undefined) return ret;
    _.merge(ret, res._);
    let l = res[lang];
    if (l === undefined) return ret;
    _.merge(ret, l._);
    let d = l[district];
    if (d === undefined) return ret;
    _.merge(ret, d);
    let {entity} = ret;
    if (entity !== undefined) {
        for (let i in entity) {
            entity[i.toLowerCase()] = entity[i];
        }
    }
    return ret;
}
