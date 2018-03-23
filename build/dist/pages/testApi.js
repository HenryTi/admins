var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Api } from 'tonva-tools';
export class TestApi extends Api {
    constructor(path, apiName) {
        super(path, apiName);
    }
    v(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('api-list', param);
        });
    }
}
const testApi = new TestApi("/tv/dev/", "dev");
export default testApi;
//# sourceMappingURL=testApi.js.map