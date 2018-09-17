var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Page } from 'tonva-tools';
import { List, FA } from 'tonva-react-form';
import { CrUsq, VmPage, CrLink } from "tonva-react-usql";
import ui from './ui';
import { OpCoordinator } from './op';
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
            this.links = [
                this.linkFromName('map', 'teamPerson'),
                this.linkFromName('map', 'teamPerson'),
                new CrLink(new OpCoordinator(this), React.createElement(FA, { name: "plus", fixWidth: true }), '设置操作权限'),
            ];
            this.showVm(VmOrganization);
        });
    }
}
class VmOrganization extends VmPage {
    constructor() {
        super(...arguments);
        this.renderRow = (link, index) => {
            return link.render('bg-white');
        };
        this.appPage = () => {
            let { links } = this.coordinator;
            return React.createElement(Page, { header: "\u7EC4\u7EC7\u7ED3\u6784", logout: () => { } },
                React.createElement(List, { items: links, item: { render: this.renderRow } }));
        };
    }
    showEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.appPage);
        });
    }
}
//# sourceMappingURL=organization.js.map