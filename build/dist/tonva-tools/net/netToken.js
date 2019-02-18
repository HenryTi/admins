import { setCenterToken } from './uqApi';
import { WSChannel } from './wsChannel';
export const netToken = {
    set(userId, token) {
        setCenterToken(userId, token);
        WSChannel.setCenterToken(token);
    },
    clear() {
        setCenterToken(0, undefined);
        WSChannel.setCenterToken(undefined);
    }
};
//# sourceMappingURL=netToken.js.map