var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { CrUsq, VmPage } from "tonva-react-usql";
import { Page } from 'tonva-tools';
//import { Page, meInFrame } from "tonva-tools";
import ui from './ui';
export class CrOrganization extends CrUsq {
    constructor() {
        super('$$$/$unitx', 0, 0, undefined, ui);
    }
    clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            this.showVm(VmOrganization);
        });
    }
}
class VmOrganization extends VmPage {
    constructor() {
        super(...arguments);
        this.appPage = () => {
            //let crUsq = this.crUsqCollection['$$$/$unitx'];
            let teamPerson = this.coordinator.vmLinkFromName('map', 'teamPerson');
            return React.createElement(Page, { header: "\u7EC4\u7EC7\u7ED3\u6784", logout: () => { } },
                React.createElement("button", { onClick: () => alert('定义组织结构') }, "\u5B9A\u4E49\u7EC4\u7EC7\u7ED3\u6784"),
                teamPerson.render());
        };
    }
    showEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.appPage);
        });
    }
}
//# sourceMappingURL=organization.js.map