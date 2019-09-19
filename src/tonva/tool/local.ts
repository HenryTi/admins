import { env } from './env';

export class LocalData {
    user = env.localDb.child('user');
    guest = env.localDb.child('guest');
    unit = env.localDb.child('unit');

    logoutClear() {
        [
            this.user,
            this.unit,
        ].forEach(d => d.remove());
    }
}
