interface a {
    b: string;
}

export interface AppUI<T extends a> {
    uqs: T;
}
