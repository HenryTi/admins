import {Api} from 'tonva-tools';

export class TestApi extends Api {
    constructor(path: string, apiName: string) {
        super(path, apiName);
    }
    async v(param: {unit:number, start:number}):Promise<any> {
        return this.get('api-list', param);
    }
}

const testApi = new TestApi("/tv/dev/", "dev");
export default testApi;
