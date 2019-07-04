import jwtDecode from 'jwt-decode';
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
export function decodeUserToken(token) {
    let ret = jwtDecode(token);
    let user = {
        id: ret.id,
        name: ret.name,
        guest: ret.guest,
        token: token,
    };
    return user;
}
export function decodeGuestToken(token) {
    let ret = jwtDecode(token);
    let guest = {
        id: 0,
        guest: ret.guest,
        token: token,
    };
    return guest;
}
//# sourceMappingURL=user.js.map