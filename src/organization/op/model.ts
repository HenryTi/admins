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

export type EntityType = 'tuid' | 'sheet' | 'action' | 'map' | 'book' | 'query' | 'history' | 'pending';

export interface Entity {
    usq: Usq;
    name: string;
    states: string[];       // 非sheet的entity，只有一个state，is $
}

export interface Sheet extends Entity {
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

    tuids: Entity[];
    maps: Entity[];
    books: Entity[];
    histories: Entity[];
    pendings: Entity[];
    queries: Entity[];
    actions: Entity[];
    sheets: Sheet[];
}

export interface EntityBlock {
    items: Entity[];
    type: EntityType;
    itemClick?: (block:EntityBlock, entity:Entity) => Promise<void>;
    itemRender?: ((item:any, icon:any)=>JSX.Element);
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

