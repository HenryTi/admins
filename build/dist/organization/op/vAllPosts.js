var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { entityIcons } from 'tonva-react-uq';
import { List, Muted, LMR, FA } from 'tonva-react-form';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
export class VAllPosts extends VPage {
    constructor() {
        super(...arguments);
        this.checked = {};
        this.isChanged = false;
        this.onCheckChanged = (entity, checked) => {
            this.checked[entity.name].checked = checked;
            let isChanged = false;
            for (let i in this.checked) {
                let { def, checked } = this.checked[i];
                if (def !== checked) {
                    isChanged = true;
                    break;
                }
            }
            this.isChanged = isChanged;
        };
        this.saveChange = () => __awaiter(this, void 0, void 0, function* () {
            let entities = [];
            for (let i in this.checked) {
                if (this.checked[i].checked !== true)
                    continue;
                entities.push({ entity: i });
            }
            let saveEntityOpForAll = this.controller.cUq.cFromName('action', 'saveEntityOpForAll');
            let ret = yield saveEntityOpForAll.entity.submit({
                uq: this.uq.id,
                entities: entities,
            });
            this.ceasePage();
            this.openPageElement(React.createElement(Page, { header: "\u6240\u6709\u5C97\u4F4D\u53EF\u64CD\u4F5C", back: "close" },
                React.createElement("div", { className: "p-3" },
                    React.createElement(FA, { name: "check-circle", className: "text-success" }),
                    " \u00A0 \u5DF2\u4FDD\u5B58")));
        });
        this.pageRender = observer(() => {
            /*
            let {name, tuids, actions, maps, books, queries, histories, pendings, sheets} = this.uq;
            let blocks:EntityBlock[] = [
                {items: tuids, type: 'tuid'},
                {items: sheets, type: 'sheet'},
                {items: actions, type: 'action'},
                {items: maps, type: 'map'},
                {items: books, type: 'book'},
                {items: queries, type: 'query'},
                {items: histories, type: 'history'},
                {items: pendings, type: 'pending'},
            ];*/
            let buttonSave = this.isChanged === true ? React.createElement("button", { className: "btn btn-sm btn-success", onClick: this.saveChange }, "\u4FDD\u5B58") : null;
            return React.createElement(Page, { header: '所有岗位可操作', right: buttonSave },
                React.createElement("div", { className: "text-muted p-3 small" },
                    React.createElement("div", { style: { lineHeight: '1.8', fontWeight: 'bold' } }, "\u8BF4\u660E"),
                    React.createElement("ol", { className: "pl-3", style: { listStyleType: '1', lineHeight: '1.8' } },
                        React.createElement("li", null, "\u6709\u4E9B\u64CD\u4F5C\uFF0C\u9ED8\u8BA4\u5141\u8BB8\u6240\u6709\u7528\u6237\u53EF\u64CD\u4F5C\uFF0C\u53EF\u4EE5\u5728\u8FD9\u91CC\u8BBE\u7F6E\u3002"),
                        React.createElement("li", null, "\u6BD4\u5982\uFF0C\u7528\u6237\u4E0B\u8BA2\u5355\u3002\u4EFB\u4F55\u5BA2\u6237\uFF0C\u767B\u5F55\u8FDB\u7CFB\u7EDF\uFF0C\u90FD\u53EF\u4EE5\u4E0B\u5355\u3002"),
                        React.createElement("li", null, "\u5982\u679C\u6BCF\u4E2A\u7528\u6237\u90FD\u9700\u8981\u8BBE\u7F6E\uFF0C\u7528\u6237\u4F1A\u4E22\u5931\uFF0C\u7BA1\u7406\u4EBA\u5458\u4F1A\u7E41\u7410\u3002"))),
                this.blocks.map(block => {
                    let { items, type } = block;
                    let icon = entityIcons[type];
                    return items && items.length > 0 &&
                        React.createElement(List, { key: type, className: "mt-3", header: React.createElement(Muted, { className: "px-3 pt-1 bg-light w-100" }, this.res[type] || type), items: items, item: {
                                render: (item, index) => this.entityRender(item, icon),
                                onClick: undefined
                            } });
                }));
        });
    }
    open(uq) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uq = uq;
            let { name, tuids, actions, maps, books, queries, histories, pendings, sheets } = this.uq;
            this.blocks = [
                { items: tuids, type: 'tuid' },
                { items: sheets, type: 'sheet' },
                { items: actions, type: 'action' },
                { items: maps, type: 'map' },
                { items: books, type: 'book' },
                { items: queries, type: 'query' },
                { items: histories, type: 'history' },
                { items: pendings, type: 'pending' },
            ];
            let getEntityOpForAll = this.controller.cUq.cFromName('query', 'getEntityOpForAll');
            let entityOpForAllResult = yield getEntityOpForAll.entity.query({ uq: this.uq.id });
            let entityOpForAll = {};
            for (let eaa of entityOpForAllResult.ret) {
                entityOpForAll[eaa.entity] = true;
            }
            for (let b of this.blocks) {
                let { items } = b;
                if (items === undefined)
                    continue;
                for (let item of items) {
                    let { name } = item;
                    let checked = (entityOpForAll[name] === true);
                    this.checked[name] = {
                        def: checked,
                        checked: checked,
                    };
                }
            }
            this.openPage(this.pageRender);
            this.regConfirmClose(() => __awaiter(this, void 0, void 0, function* () {
                if (this.isChanged === false)
                    return true;
                return confirm('未保存\n真的不保存吗？');
            }));
        });
    }
    entityRender(entity, icon) {
        let { name } = entity;
        let right = React.createElement("input", { className: "mr-3 align-middle", type: "checkbox", defaultChecked: this.checked[name].def, onChange: (evt) => this.onCheckChanged(entity, evt.target.checked) });
        return React.createElement(LMR, { className: "px-3 py-2 align-items-center", right: right },
            icon,
            " \u00A0 ",
            name);
    }
}
__decorate([
    observable
], VAllPosts.prototype, "isChanged", void 0);
//# sourceMappingURL=vAllPosts.js.map