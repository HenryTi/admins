import { Res } from "../../ui";

export interface LoginRes {
    a: string;
}

export const loginRes: Res<LoginRes> = {
    _: {
        a: 'd',
    }
}
