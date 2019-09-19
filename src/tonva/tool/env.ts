import { LocalMap } from './localDb';

const testingTags:string[] = ['/test', '/test/', '-test', '-test/'];
function isTesting():boolean {
    let {pathname} = document.location;
    let pn = pathname.toLowerCase();
    for (let item of testingTags) {
        if (pn.endsWith(item) === true) return true;
    }
    return false;
}

export const env = (function () {
    let testing = isTesting();
    let localDb = new LocalMap(testing===true? '$$':'$');
    return {
        testing: testing,
        isDevelopment: process.env.NODE_ENV === 'development',
        localDb: localDb,
    }
}());
