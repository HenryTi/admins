var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nav } from '../ui/nav';
export class HttpChannelNavUI {
    startWait() {
        nav.startWait();
    }
    endWait() {
        nav.endWait();
    }
    showError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            nav.endWait();
            /*
            if (error.name === 'SyntaxError') {
                error = {
                    name: error.name,
                    message: error.message,
                }
            }*/
            yield nav.onError(error);
        });
    }
}
//# sourceMappingURL=httpChannelUI.js.map