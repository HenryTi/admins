import jwtDecode from 'jwt-decode';

export interface Unit {
    id: number;
    name: string;
}

export interface Guest {
    id: number;             // id = 0
    guest: number;
    token: string;
}

export interface User extends Guest {
    id: number;
    name: string;
    nick?: string;
    icon?: string;
}

/*
export class UserInNav {
    private user: User;
    constructor(user: User) {
        this.user = user;
    }
    get id():number {return this.user.id}
    get name(): string {return this.user.name}
    get nick(): string {return this.user.nick}
    get icon(): string {return this.user.icon || ('http://' + process.env['REACT_APP_CENTER_HOST'] + '/imgs/Bear-icon.png');}
    get guest(): number {return this.user.guest}
    get token(): string {return this.user.token}
}
*/
export function decodeUserToken(token: string): User {
    let ret:any = jwtDecode(token);
    let user: User = {
        id: ret.id,
        name: ret.name,
        guest: ret.guest,
        token: token,
    };
    return user;
}

export function decodeGuestToken(token: string): Guest {
    let ret:any = jwtDecode(token);
    let guest: Guest = {
        id: 0,
        guest: ret.guest,
        token: token,
    };
    return guest;
}
