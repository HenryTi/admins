import { IObservableValue } from "mobx";

export interface App {
    id: number;
    unit: number;
    name: string;
    discription: string;
    icon: string;
    inUnit: number;
    date_init: Date;
    date_update: Date;
    usqs: Usq[];
}

export interface Sheet {
    usq: Usq;
    name: string;
    states: string[];
}

export interface Usq {
    app: number;
    id: number;
    unit: number;
    name: string;
    discription: string;
    icon: string;
    inUnit: number;
    public: number;
    entities: string;
    date_init: Date;
    date_update: Date;

    tuids: string[];
    maps: string[];
    books: string[];
    histories: string[];
    pendings: string[];
    queries: string[];
    actions: string[];
    sheets: Sheet[];
}

export interface Post {
    owner: number;
    id: number;
    title: string;
    organization: Organization;
}

export interface Team {
    id: number;
    name: string;
    no: string;
    sections: Section[];
    organizations: Organization[];
}

export interface Organization {
    id: number;
    name: string;
    posts: Post[];
    teams: Team[];
}

export interface Section {
    id: number;
    name: string;
    teams: Team[];
}

export interface To {
    post: Post;
    team?: Team;
    section?: Section;
}

export interface StateTo {
    name: string;
    caption: string | JSX.Element;
    configable: boolean;
    tos?: To[];
    tosText?: IObservableValue<string[]>;
}

