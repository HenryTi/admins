import {Id} from './id';

export namespace DevModel {
    export interface ObjBase extends Id {
        unit: number;
        date_init: Date;
        date_update: Date;
    }

    export interface UQ extends ObjBase {
        name: string;
        discription: string;
        owner?: string;
        access: string;
        service_count: number;
    }

    export interface App extends ObjBase {
        name: string;
        caption: string;
        discription: string;
        icon: string;
        "public": number;
        server: number;
        url: string;
        urlDebug: string;
    }

    export interface Bus extends ObjBase {
        name: string;
        version: number;
        discription: string;
        schema: string;
        owner?: string;
        mine: number;
        isPublic: number;
    }

    export interface Server extends ObjBase {
        discription: string;
        cloud: string;
        ip: string;
    }

    /*
    export interface Uqdb extends ObjBase {
        name: string;
        dbtype: string;
        uq: number;
        dbname: string;
        discription: string;
        cloud: string;
        connection: string;
    }
    */
   
    export interface Service extends ObjBase {
        url: string;
        urlTest: string;
        type: number;
        name: string;
        discription: string;
        server: number;
        app: number;
        uq: number;
        db: string;
        compile_time: number;
        deploy_time: number;
        /*
        db_type: string;
        connection: string;
        */
    }
}
