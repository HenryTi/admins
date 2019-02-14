
let subAppWindow:Window;
function postWsToSubApp(msg:any) {
    if (subAppWindow === undefined) return;
    subAppWindow.postMessage({
        type: 'ws',
        msg: msg
    }, '*');
}

export function setSubAppWindow(win:Window) {
    subAppWindow = win;
}

export function postWsToTop(msg:any) {
    window.top.postMessage({
        type: 'ws',
        msg: msg
    }, '*');
}

export abstract class WsBase {
    wsBaseId:string;
    private handlerSeed = 1;
    private anyHandlers:{[id:number]:(msg:any)=>Promise<void>} = {};
    private msgHandlers:{[id:number]:{type:string, handler:(msg:any)=>Promise<void>}} = {};
    onWsReceiveAny(handler:(msg:any)=>Promise<void>):number {
        let seed = this.handlerSeed++;
        this.anyHandlers[seed] = handler;
        return seed;
    }
    onWsReceive(type:string, handler:(msg:any)=>Promise<void>):number {
        let seed = this.handlerSeed++;
        this.msgHandlers[seed] = {type:type, handler: handler};
        return seed;
    }
    endWsReceive(handlerId:number) {
        delete this.anyHandlers[handlerId];
        delete this.msgHandlers[handlerId];
    }
    async receive(msg:any) {
        let {$type} = msg;
        for (let i in this.anyHandlers) {
            await this.anyHandlers[i](msg);
        }
        for (let i in this.msgHandlers) {
            let {type, handler} = this.msgHandlers[i];
            if (type !== $type) continue;
            await handler(msg);
        }
    }
}

let wsBaseSeed = 1;
export class WsBridge extends WsBase {
    wsBaseId:string = 'WsBridge seed ' + wsBaseSeed++;
}

export const wsBridge = new WsBridge();

export class WSChannel extends WsBase {
    wsBaseId:string = 'WSChannel seed ' + wsBaseSeed++;
    static centerToken:string;
    private wsHost: string;
    private token: string;
    private ws: WebSocket;

    constructor(wsHost: string, token: string) {
        super();
        this.wsHost = wsHost;
        this.token = token;
    }

    static setCenterToken(token?: string) {
        WSChannel.centerToken = token;
    }
    
    connect():Promise<void> {
        //this.wsHost = wsHost;
        //this.token = token || WSChannel.centerToken;
        if (this.ws !== undefined) return;
        let that = this;
        return new Promise((resolve, reject) => {
            let ws = new WebSocket(this.wsHost, this.token || WSChannel.centerToken);
            console.log('connect webSocket %s', this.wsHost);
            ws.onopen = (ev) => {
                console.log('webSocket connected %s', this.wsHost);
                that.ws = ws;
                resolve();
            };
            ws.onerror = (ev) => {
                reject('webSocket can\'t open!');
            };
            ws.onmessage = async (msg) => await that.wsMessage(msg);
            ws.onclose = (ev) => {
                that.ws = undefined;
                console.log('webSocket closed!');
            }
        });
    }
    close() {
        if (this.ws !== undefined) {
            this.ws.close();
            this.ws = undefined;
        }
    }
    private async wsMessage(event:any):Promise<void> {
        try {
            console.log('websocket message: %s', event.data);
            let msg = JSON.parse(event.data);
            postWsToSubApp(msg);
            await this.receive(msg);
        }
        catch (err) {
            console.log('ws msg error: ', err);
        }
    }
    sendWs(msg:any) {
        let netThis = this;
        this.connect().then(() => {
            netThis.ws.send(msg);
        });
    }
}
