var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bridgeCenterApi, isBridged } from './appBridge';
import { nav } from '../ui/nav';
import { isDevelopment } from './host';
export function httpGet(url, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let channel = new HttpChannel(false, url, undefined, undefined);
        let ret = yield channel.get('', params);
        return ret;
    });
}
export function httpPost(url, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let channel = new HttpChannel(false, url, undefined, undefined);
        let ret = yield channel.post('', params);
        return ret;
    });
}
export class HttpChannel {
    constructor(isCenter, hostUrl, apiToken, ui) {
        this.startWait = () => {
            if (this.ui !== undefined)
                this.ui.startWait();
        };
        this.endWait = (url, reject) => {
            if (this.ui !== undefined)
                this.ui.endWait();
            if (reject !== undefined)
                reject('访问webapi超时 ' + url);
        };
        this.showError = (error) => __awaiter(this, void 0, void 0, function* () {
            if (this.ui !== undefined)
                yield this.ui.showError(error);
        });
        this.isCenter = isCenter;
        this.hostUrl = hostUrl;
        this.apiToken = apiToken;
        this.ui = ui;
        this.timeout = isDevelopment === true ? 500000 : 5000;
    }
    used() {
        this.post('', {});
    }
    get(url, params = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params) {
                let keys = Object.keys(params);
                if (keys.length > 0) {
                    let c = '?';
                    for (let k of keys) {
                        let v = params[k];
                        if (v === undefined)
                            continue;
                        url += c + k + '=' + params[k];
                        c = '&';
                    }
                }
            }
            let options = this.buildOptions();
            options.method = 'GET';
            return yield this.innerFetch(url, options);
        });
    }
    post(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = this.buildOptions();
            options.method = 'POST';
            options.body = JSON.stringify(params);
            return yield this.innerFetch(url, options);
        });
    }
    put(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = this.buildOptions();
            options.method = 'PUT';
            options.body = JSON.stringify(params);
            return yield this.innerFetch(url, options);
        });
    }
    delete(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = this.buildOptions();
            options.method = 'DELETE';
            options.body = JSON.stringify(params);
            return yield this.innerFetch(url, options);
        });
    }
    fetch(url, options, resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            let that = this;
            this.startWait();
            let path = url;
            function buildError(err) {
                return {
                    channel: that,
                    url: path,
                    options: options,
                    resolve: resolve,
                    reject: reject,
                    error: err,
                };
            }
            try {
                console.log('%s %s', options.method, path);
                let timeOutHandler = setTimeout(() => that.endWait(url, reject), this.timeout);
                let res = yield fetch(encodeURI(path), options);
                if (res.ok === false) {
                    clearTimeout(timeOutHandler);
                    that.endWait();
                    console.log('call error %s', res.statusText);
                    throw res.statusText;
                }
                let ct = res.headers.get('content-type');
                if (ct && ct.indexOf('json') >= 0) {
                    return res.json().then((retJson) => __awaiter(this, void 0, void 0, function* () {
                        clearTimeout(timeOutHandler);
                        that.endWait();
                        if (retJson.ok === true) {
                            return resolve(retJson.res);
                        }
                        if (retJson.error === undefined) {
                            yield that.showError(buildError('not valid tonva json'));
                        }
                        else {
                            yield that.showError(buildError(retJson.error));
                            reject(retJson.error);
                        }
                        //throw retJson.error;
                    })).catch((error) => __awaiter(this, void 0, void 0, function* () {
                        yield that.showError(buildError(error.message));
                    }));
                }
                else {
                    let text = yield res.text();
                    clearTimeout(timeOutHandler);
                    that.endWait();
                    resolve(text);
                }
            }
            catch (error) {
                if (typeof error === 'string') {
                    if (error.toLowerCase().startsWith('unauthorized') === true) {
                        nav.logout();
                        return;
                    }
                }
                yield this.showError(buildError(error.message));
            }
            ;
        });
    }
    innerFetch(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let u = this.hostUrl + url;
            if (this.isCenter === true && this.apiToken === undefined && isBridged())
                return yield bridgeCenterApi(u, options.method, options.body);
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.fetch(u, options, resolve, reject);
            }));
        });
    }
    callFetch(url, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = this.buildOptions();
            options.method = method;
            options.body = body;
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.fetch(url, options, resolve, reject);
            }));
        });
    }
    buildOptions() {
        let { language, culture } = nav;
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        let lang = language;
        if (culture)
            lang += '-' + culture;
        headers.append('Accept-Language', lang);
        if (this.apiToken) {
            headers.append('Authorization', this.apiToken);
        }
        let options = {
            headers: headers,
        };
        return options;
    }
}
//# sourceMappingURL=httpChannel.js.map