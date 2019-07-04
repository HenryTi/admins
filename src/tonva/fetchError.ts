import {HttpChannel} from './net/httpChannel';

export interface FetchError {
    channel: HttpChannel;
    url: string;
    options: any;
    resolve:(value?:any)=>void;
    reject: (reason?:any)=>void;
    error: any;
}
