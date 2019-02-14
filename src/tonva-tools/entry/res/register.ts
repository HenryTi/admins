import { Res } from "../../ui";

export interface RegisterRes {
    a: string;
}

export const registerRes: Res<RegisterRes> = {
    _: {
        a: 'd',
    }
}
