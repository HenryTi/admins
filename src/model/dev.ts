import {Id} from './id';

export namespace DevModel {
    export interface ObjBase extends Id {
        unit: number;
        date_init: Date;
        date_update: Date;
    }

    export interface Api extends ObjBase {
        name: string;
        discription: string;
    }

    export interface App extends ObjBase {
        name: string;
        discription: string;
        icon: string;
        "public": number;
    }

    export interface Server extends ObjBase {
        discription: string;
        cloud: string;
        ip: string;
    }

    export interface Service extends ObjBase {
        url: string;
        type: number;
        discription: string;
        server: number;
        app: number;
        api: number;
    }
}
