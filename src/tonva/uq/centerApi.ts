import {CenterApiBase} from '../net';

//

export class CenterApi extends CenterApiBase {
    async userAppUnits(app:number):Promise<any[]> {
        return await this.get('tie/user-app-units', {app:app});
    }
}

export const centerApi = new CenterApi('tv/', undefined);
