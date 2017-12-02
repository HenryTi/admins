import {Api, TestApi} from 'tonva-tools';

export class TestApi1 extends Api {
    constructor(path: string, apiName: string) {
        super(path, apiName);
    }
    async v(param: {}):Promise<any> {
        return this.get('v', param);
    }
}

const testApi = new TestApi("/v", "v");
export default testApi;

export let testApi1 = new TestApi1("/v", "v");
