export function serializeJson(obj) {
    let source = [];
    let result = [];
    function serialize(obj) {
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
    function serializeArr(obj, retObj) {
        let len = obj.length;
        for (let i = 0; i < len; i++) {
            retObj[i] = serial(obj[i]);
        }
    }
    function serializeObj(obj, retObj) {
        for (let i in obj) {
            //if (i === '_tuid') continue;
            //if (i === 'waitingIds') debugger;
            retObj[i] = serial(obj[i]);
        }
    }
    function serial(obj) {
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
export function deserializeJson(str) {
    let arr = JSON.parse(str);
    let obj = arr[0];
    deserialize(obj);
    return obj;
    function deserialize(obj) {
        if (Array.isArray(obj) === true) {
            deserializeArr(obj);
        }
        else {
            deserializeObj(obj);
        }
    }
    function deserializeArr(obj) {
        let len = obj.length;
        for (let i = 0; i < len; i++) {
            obj[i] = deserial(obj[i]);
        }
    }
    function deserializeObj(obj) {
        for (let i in obj) {
            obj[i] = deserial(obj[i]);
        }
    }
    function deserial(obj) {
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
//# sourceMappingURL=serializeJson.js.map