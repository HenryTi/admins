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
import { VmMapMain, CrMap } from 'tonva-react-usql';
import { dictionary as x } from '../../res';
class CrMapTeamPerson extends CrMap {
    searchOnKey(keyField, param) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            switch (keyField.name) {
                default: return yield _super("searchOnKey").call(this, keyField, param);
                case 'post': return yield this.searchOnPost(param);
            }
        });
    }
    searchOnPost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let querySelect = this.crQuerySelect('teamPosts');
            let val = yield querySelect.call(param);
            return val['post'].id;
        });
    }
}
class VmMapTeamPerson extends VmMapMain {
}
const ui = {
    CrMap: CrMapTeamPerson,
    //label: '部门员工对照表',
    //main: VmMapTeamPerson,
    keys: [
        {
            content: ({ name, id }) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null, x.team),
                " ",
                name),
            none: () => x.noStaff,
        },
        {
            content: ({ name, id }) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null, x.staff),
                " ",
                name,
                " \u00A0 ",
                React.createElement(Muted, null,
                    x.no,
                    " ",
                    left0(id, 4))),
            none: () => x.noPost,
        },
        {
            content: ({ title, id }) => React.createElement(React.Fragment, null,
                React.createElement(Muted, null, x.post),
                " ",
                title),
            none: undefined,
        },
    ]
};
export default ui;
//# sourceMappingURL=index.js.map