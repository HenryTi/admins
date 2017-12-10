
export interface Api {
    name: string;
    url: string;
    token: string;
}

export interface App {
    id: number;
    name: string;
    discription: string;
    icon: string;
    owner: number;
    ownerName: string;
    ownerDiscription: string;
    url: string;
    apis?: {[name:string]: Api};
}

export interface Unit {
    id: number;
    name: string;
    nick: string;
    discription: string;
    icon: string;
    isOwner: number;
    isAdmin: number;
    owner: number;
    ownerName: string;
    ownerNick: string;
    ownerIcon: string;
}

export interface UnitApps extends Unit {
    apps: App[];
}

export interface UnitAdmin {
    id: number;
    name: string;
    nick: string;
    icon: string;
    country: string;
    mobile: string;
    email: string;
    isOwner: number;
    isAdmin: number;
}
