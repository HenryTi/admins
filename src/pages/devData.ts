import {observable} from 'mobx';

class DevData {
    @observable apiList:any[] = undefined;
};

export const devData = new DevData();
