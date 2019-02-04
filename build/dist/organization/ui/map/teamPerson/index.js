var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Muted } from 'tonva-react-form';
import { left0 } from 'tonva-tools';
import { VMapMain, CMap } from 'tonva-react-usql';
class CMapTeamPerson extends CMap {
    searchOnKey(keyField, param) {
        const _super = Object.create(null, {
            searchOnKey: { get: () => super.searchOnKey }
        });
        return __awaiter(this, void 0, void 0, function* () {
            switch (keyField.name) {
                default: return yield _super.searchOnKey.call(this, keyField, param);
                case 'post': return yield this.searchOnPost(param);
            }
        });
    }
    searchOnPost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let querySelect = this.cQuerySelect('teamPosts');
            let val = yield querySelect.call(param);
            return val['post'].id;
        });
    }
}
class VMapTeamPerson extends VMapMain {
}
const ui = {
    CMap: CMapTeamPerson,
    keys: [
        {
            content: ({ name, id }, x) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null,
                    x.team,
                    " \u00A0 "),
                " ",
                name),
            none: (x) => x.noStaff,
        },
        {
            content: ({ name, id }, x) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null,
                    x.staff,
                    " \u00A0 "),
                " ",
                name,
                " \u00A0 ",
                React.createElement(Muted, null,
                    x.no,
                    " ",
                    left0(id, 4))),
            none: (x) => x.noPost,
        },
        {
            content: ({ title, id }, x) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null,
                    x.post,
                    " \u00A0 "),
                " ",
                title),
            none: undefined,
        },
    ]
};
export default ui;
//# sourceMappingURL=index.js.map