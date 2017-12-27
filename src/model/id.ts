export interface Id {
    id: number;
}

export interface Api {
    name: string;
    url: string;
    token: string;
}

export interface App extends Id {
    name: string;
    discription: string;
    icon: string;
    owner: number;
    ownerName: string;
    ownerDiscription: string;
    url: string;
    apis?: {[name:string]: Api};
}

export interface Unit extends Id {
    name: string;
    nick: string;
    discription: string;
    icon: string;
    isRoot: number;
    isOwner: number;
    isAdmin: number;
    owner?: number;
    ownerName?: string;
    ownerNick?: string;
    ownerIcon?: string;
}

export interface UnitApps extends Unit {
    apps: App[];
}

export interface UnitAdmin extends Id {
    name: string;
    nick: string;
    icon: string;
    country: string;
    mobile: string;
    email: string;
    isRoot: number;
    isOwner: number;
    isAdmin: number;
}
