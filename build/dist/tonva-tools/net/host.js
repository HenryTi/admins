var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const isDevelopment = process.env.NODE_ENV === 'development';
const centerHost = process.env['REACT_APP_CENTER_HOST'];
const centerDebugHost = 'localhost:3000'; //'192.168.86.64';
const uqDebugHost = 'localhost:3015'; //'192.168.86.63';
const uqDebugBuilderHost = 'localhost:3009';
const hosts = {
    centerhost: {
        value: process.env['REACT_APP_CENTER_DEBUG_HOST'] || centerDebugHost,
        local: false
    },
    uqhost: {
        value: process.env['REACT_APP_UQ_DEBUG_HOST'] || uqDebugHost,
        local: false
    },
    unitxhost: {
        value: process.env['REACT_APP_UQ_DEBUG_HOST'] || uqDebugHost,
        local: false
    },
    "uq-build": {
        value: process.env['REACT_APP_UQ_DEBUG_BUILDER_HOST'] || uqDebugBuilderHost,
        local: false
    }
};
function centerUrlFromHost(host) { return `http://${host}/`; }
function centerWsFromHost(host) { return `ws://${host}/tv/`; }
class Host {
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (isDevelopment === true) {
                yield this.tryLocal();
            }
            let host = this.getCenterHost();
            this.url = centerUrlFromHost(host);
            this.ws = centerWsFromHost(host);
        });
    }
    debugHostUrl(host) { return `http://${host}/hello`; }
    tryLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            for (let i in hosts) {
                let hostValue = hosts[i];
                let { value } = hostValue;
                //let host = process.env[env] || value;
                let fetchUrl = this.debugHostUrl(value);
                let fetchOptions = {
                    method: "GET",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                };
                promises.push(localCheck(fetchUrl, fetchOptions));
            }
            let results = yield Promise.all(promises);
            let p = 0;
            for (let i in hosts) {
                let hostValue = hosts[i];
                hostValue.local = results[p];
                ++p;
            }
        });
    }
    getCenterHost() {
        //let host = process.env['REACT_APP_CENTER_HOST'];
        let { value, local } = hosts.centerhost; // process.env.REACT_APP_CENTER_DEBUG_HOST || centerDebugHost;
        let hash = document.location.hash;
        if (hash.includes('sheet_debug') === true) {
            return value;
        }
        //if (process.env.NODE_ENV==='development') {
        if (isDevelopment === true) {
            if (local === true)
                return value;
            /*
            if (debugHost !== undefined) {
                try {
                    console.log('try connect debug url');
                    await fetchLocalCheck(centerUrlFromHost(debugHost));
                    return debugHost;
                }
                catch (err) {
                    //console.error(err);
                }
            }*/
        }
        return centerHost;
    }
    getUrlOrDebug(url, urlDebug) {
        if (isDevelopment !== true)
            return url;
        if (!urlDebug)
            return url;
        for (let i in hosts) {
            let host = hosts[i];
            let { value, local } = host;
            let hostString = `://${i}/`;
            let pos = urlDebug.indexOf(hostString);
            if (pos > 0) {
                if (local === false)
                    return url;
                urlDebug = urlDebug.replace(hostString, `://${value}/`);
                return urlDebug;
            }
        }
        return urlDebug;
    }
}
export const host = new Host();
// 因为测试的都是局域网服务器，甚至本机服务器，所以一秒足够了
// 网上找了上面的fetch timeout代码。
// 尽管timeout了，fetch仍然继续，没有cancel
// 实际上，一秒钟不够。web服务器会自动停。重启的时候，可能会比较长时间。也许两秒甚至更多。
//const timeout = 2000;
const timeout = 100;
function fetchLocalCheck(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(v => {
            v.text().then(resolve).catch(reject);
        })
            .catch(reject);
        const e = new Error("Connection timed out");
        setTimeout(reject, timeout, e);
    });
}
function localCheck(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchLocalCheck(url, options);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
//# sourceMappingURL=host.js.map