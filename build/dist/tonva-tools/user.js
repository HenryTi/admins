import jwtDecode from 'jwt-decode';
export class UserInNav {
    constructor(user) {
        this.user = user;
    }
    get id() { return this.user.id; }
    get name() { return this.user.name; }
    get nick() { return this.user.nick; }
    get icon() { return this.user.icon || ('http://' + process.env['REACT_APP_CENTER_HOST'] + '/imgs/Bear-icon.png'); }
    get guest() { return this.user.guest; }
    get token() { return this.user.token; }
}
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