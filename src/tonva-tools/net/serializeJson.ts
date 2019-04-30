
export function serializeJson(obj:any):string {
    let source = [];
    let result = [];

    function serialize(obj:any):any {
        let p = source.findIndex(v => v === obj);
        if (p <= 0) {
            p = result.length;
            source.push(obj);
            if (Array.isArray(obj) === true) {
                let retObj = [];
                result.push(retObj);
                serializeArr(obj, retObj);
            }
            else {
                let retObj = {};
                result.push(retObj);
                serializeObj(obj, retObj);
            }
        }
        return '___' + p;
    }

    function serializeArr(obj:any[], retObj:any[]) {
        let len = obj.length;
        for (let i=0; i<len; i++) {
            retObj[i] = serial(obj[i]);
        }
    }
    
    function serializeObj(obj:any, retObj:any) {
        for (let i in obj) {
            retObj[i] = serial(obj[i]);
        }
    }

    function serial(obj:any) {
        switch (typeof obj) {
            default: return obj;
            case 'object': return serialize(obj);
            case 'function': break;
        }
    }

    serialize(obj);
    try {
        let ret = JSON.stringify(result);
        return ret;
    }
    catch (err) {
        debugger;
    }
}

export function deserializeJson(str:string):any {
    let arr = JSON.parse(str) as any[];
    let obj = arr[0];
    deserialize(obj);
    return obj;

    function deserialize(obj:any) {
        if (Array.isArray(obj) === true) {
            deserializeArr(obj);
        }
        else {
            deserializeObj(obj);
        }
    }

    function deserializeArr(obj:any[]) {
        let len = obj.length;
        for (let i=0; i<len; i++) {
            obj[i] = deserial(obj[i]);
        }
    }
    
    function deserializeObj(obj:any) {
        for (let i in obj) {
            obj[i] = deserial(obj[i]);
        }
    }

    function deserial(obj:any) {
        if (typeof obj === 'string') {
            if (obj.startsWith('___') === true) {
                let p = Number(obj.substr(3));
                let ret = arr[p];
                deserialize(ret);
                return ret;
            }
        }
        return obj;
    }

}
