export interface UnitApp {
    id: number;
    unit: number;
    name: string;
    discription: string;
    icon: string;
    inUnit: number;
    date_init: Date;
    date_update: Date;
}

export interface Role {
    id: number;
    name: string;
    discription: string;
    count: number;
}