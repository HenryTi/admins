
import {setCenterToken} from './uqApi';
import {WSChannel} from './wsChannel';

export const netToken = {
    set(userId:number, token:string) {
        setCenterToken(userId, token);
        WSChannel.setCenterToken(token);
    },
    clear() {
        setCenterToken(0, undefined);
        WSChannel.setCenterToken(undefined);
    }
};
