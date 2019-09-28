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
