import { Controller } from '../../ui';
import { CUq } from './cUq';

export abstract class ControllerUq extends Controller {
    constructor(cUq: CUq, res:any) {
        super(res);
        this.cUq = cUq;
    }
    cUq: CUq;
}
