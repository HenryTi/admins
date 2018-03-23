var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CacheIds } from 'tonva-tools';
import { mainApi, devApi } from '../api';
export class CacheUnits extends CacheIds {
    _load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mainApi.unit(id);
        });
    }
}
export class CacheApis extends CacheIds {
    _load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.api(id);
        });
    }
}
export class CacheApps extends CacheIds {
    _load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.app(id);
        });
    }
}
export class CacheServers extends CacheIds {
    _load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.server(id);
        });
    }
}
//# sourceMappingURL=cacheIds.js.map