import * as React from 'react';

interface ZhRes<T> {
    _?: T;
    cn?: T;
    tw?: T;
    hk?: T;
}

interface EnRes<T> {
    _?: T;
    us?: T;
    ca?: T;
    gb?: T;
}

interface Res<T> {
    _?: T;
    zh?: ZhRes<T>;
    en?: EnRes<T>;
}

interface EntryA {
    a?: string;
    b?: string;
    c?: JSX.Element;
}

interface EntryB {
    a?: string;
    b?: string;
    c?: JSX.Element;
}

interface AbcEntry {
    entryA?: EntryA;
    entryB?: EntryB;
}

const en_AbcEntry = {
    entryA: {
        a: 'dd',
        b: 'a',
        c: <div></div>,
    }
}

const enAbcEntry = {
    _: en_AbcEntry,
}

const zhAbcEntry = {
};

let resEntry:Res<AbcEntry> = {
    _: en_AbcEntry,
    en: enAbcEntry,
    zh: zhAbcEntry,
};

function buildRes<T>(res:Res<T>):T {
    return res._ || ({} as T);
}
