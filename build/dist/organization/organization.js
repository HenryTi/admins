var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Page, VPage } from 'tonva-tools';
import { List } from 'tonva-react-form';
import { CUq, CLink } from "tonva-react-uq";
import ui from './ui';
import { COpBinding } from './op';
export class COrganization extends CUq {
    constructor() {
        super(undefined, '$$$/$unitx', 0, 0, undefined, ui);
        this.label = '岗位权限';
        this.icon = 'sitemap';
    }
    clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }
    loadEntites() {
        return __awaiter(this, void 0, void 0, function* () {
            // 只有赋Entity权限的地方，需要取全部的Entities，其它地方默认取user access，this.entities.loadAccess()
            yield this.entities.loadEntities();
        });
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            this.links = [
                '',
                new CLink(new COpBinding(this, this.res)),
                '',
                this.linkFromName('map', 'teamPerson'),
                this.linkFromName('map', 'sectionTeam'),
                this.linkFromName('map', 'teamOrganization'),
                '',
                this.linkFromName('tuid', 'person'),
                this.linkFromName('tuid', 'team'),
                this.linkFromName('tuid', 'section'),
                this.linkFromName('tuid', 'organization'),
            ];
            this.openVPage(VOrganization);
        });
    }
}
class VOrganization extends VPage {
    constructor() {
        super(...arguments);
        this.renderRow = (link, index) => {
            return link.render('bg-white');
        };
        this.appPage = () => {
            let { links, label } = this.controller;
            return React.createElement(Page, { header: label, logout: () => __awaiter(this, void 0, void 0, function* () { }) },
                React.createElement(List, { items: links, item: { render: this.renderRow } }));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.appPage);
        });
    }
}
//# sourceMappingURL=organization.js.map