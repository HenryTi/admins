var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Page, meInFrame } from "tonva-tools";
import React from "react";
import { List, Muted, LMR } from "tonva-react-form";
import { VmSheet } from './vmSheet';
import { Coordinator, entitiesRes, centerApi } from "tonva-react-usql";
// 单据跟操作的绑定设置
export class OpCoordinator extends Coordinator {
    constructor(unitxUsq) {
        super();
        this.appRender = (app, index) => {
            let { name, discription } = app;
            return React.createElement(LMR, { className: "px-3 py-2", right: discription && React.createElement(Muted, null, discription) }, name);
        };
        this.appClick = (app) => {
            this.openPage(React.createElement(this.appView, Object.assign({}, app)));
        };
        this.appsView = () => React.createElement(Page, { header: "\u8BBE\u7F6E\u64CD\u4F5C\u6743\u9650" },
            React.createElement(List, { items: this.apps, item: { render: this.appRender, onClick: this.appClick } }));
        this.tuidClick = (entityName) => {
            alert(entityName);
        };
        this.mapClick = (entityName) => {
            alert(entityName);
        };
        this.actionClick = (entityName) => {
            alert(entityName);
        };
        this.bookClick = (entityName) => {
            alert(entityName);
        };
        this.queryClick = (entityName) => {
            alert(entityName);
        };
        this.historyClick = (entityName) => {
            alert(entityName);
        };
        this.sheetClick = (sheet) => __awaiter(this, void 0, void 0, function* () {
            let entityPosts = this.unitxUsq.crFromName('query', 'getEntityPost');
            let ret = yield entityPosts.entity.query({ entityName: sheet.name });
            let opTos = {};
            for (let row of ret.ret) {
                let { op, post, team, section } = row;
                let opTo = opTos[op];
                if (opTo === undefined)
                    opTos[op] = opTo = [];
                opTo.push({
                    post: this.postDict[post],
                    team: this.teamDict[team],
                    section: this.sectionDict[section],
                });
            }
            this.showVm(VmSheet, { sheet: sheet, opTos: opTos });
        });
        this.usqRender = (usq, index) => {
            let { name, tuids, actions, maps, books, queries, histories, sheets } = usq;
            let nameRender = this.nameRender;
            function headerCaption(caption) {
                return React.createElement(Muted, { className: "px-3 pt-1 bg-light w-100" }, caption);
            }
            function itemList(items, type, itemClick, render = nameRender) {
                let { caption, icon } = entitiesRes[type];
                return items &&
                    React.createElement(List, { className: "mt-3", header: headerCaption(caption), items: items, item: { render: (item, index) => render(item, icon), onClick: itemClick } });
            }
            return React.createElement("div", { key: name, className: "my-2" },
                React.createElement("div", { className: "px-3 font-weight-bold" }, name),
                itemList(tuids, 'tuid', this.tuidClick),
                itemList(actions, 'action', this.actionClick),
                itemList(maps, 'map', this.mapClick),
                itemList(books, 'book', this.bookClick),
                itemList(queries, 'query', this.queryClick),
                itemList(histories, 'history', this.historyClick),
                itemList(sheets, 'sheet', this.sheetClick, this.sheetRender));
        };
        this.appView = (app) => React.createElement(Page, { header: app.name + '操作权限' }, app.usqs.map((v, index) => this.usqRender(v, index)));
        this.unitxUsq = unitxUsq;
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildPosts();
            yield this.buildAppsUsqs();
            this.openPage(React.createElement(this.appsView, null));
        });
    }
    buildAppsUsqs() {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = meInFrame.unit;
            let ret = yield centerApi.get('/unit/apps-usqs', { unit: unit });
            this.apps = ret[0];
            let usqs = ret[1];
            for (let app of this.apps) {
                app.usqs = [];
            }
            for (let usq of usqs) {
                let app = this.apps.find(v => v.id === usq.app);
                if (app === undefined)
                    continue;
                app.usqs.push(usq);
                this.setUsqEntities(usq);
            }
        });
    }
    buildPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryAllTeams = this.unitxUsq.crFromName('query', 'allteams');
            let ret = yield queryAllTeams.entity.query(undefined);
            this.teams = ret['teams'];
            this.organizations = ret['organization'];
            this.posts = ret['organizationpost'];
            this.sections = ret['sections'];
            this.postDict = {};
            this.teamDict = {};
            this.organizationDict = {};
            this.sectionDict = {};
            for (let organization of this.organizations) {
                organization.posts = [];
                organization.teams = [];
                this.organizationDict[organization.id] = organization;
            }
            for (let team of this.teams) {
                team.organizations = [];
                team.sections = [];
                this.teamDict[team.id] = team;
            }
            for (let section of this.sections) {
                section.teams = [];
                this.sectionDict[section.id] = section;
            }
            for (let post of this.posts) {
                this.postDict[post.id] = post;
                let organization = this.organizationDict[post.owner];
                if (organization === undefined)
                    continue;
                post.organization = organization;
                organization.posts.push(post);
            }
            // teamOrganization
            for (let teamOrganization of ret['teamorganization']) {
                let { team: tm, organization: og } = teamOrganization;
                let team = this.teamDict[tm];
                let organization = this.organizationDict[og];
                team.organizations.push(organization);
                organization.teams.push(team);
            }
            // sectionTeam
            for (let sectionTeam of ret['sectionteam']) {
                let { section: sec, team: tm } = sectionTeam;
                let section = this.sectionDict[sec];
                let team = this.teamDict[tm];
                section.teams.push(team);
                team.sections.push(section);
            }
        });
    }
    setUsqEntities(usq) {
        let entities = usq.entities;
        if (entities === null)
            return;
        let lns = entities.split('\n');
        let len = lns.length;
        let p;
        for (let i = 0; i < len;) {
            switch (lns[i]) {
                case 'tuid':
                    p = this.setNames(usq.tuids = [], lns, i);
                    break;
                case 'map':
                    p = this.setNames(usq.maps = [], lns, i);
                    break;
                case 'book':
                    p = this.setNames(usq.books = [], lns, i);
                    break;
                case 'history':
                    p = this.setNames(usq.histories = [], lns, i);
                    break;
                case 'query':
                    p = this.setNames(usq.queries = [], lns, i);
                    break;
                case 'action':
                    p = this.setNames(usq.actions = [], lns, i);
                    break;
                case 'sheet':
                    p = this.setSheets(usq.sheets = [], lns, i, usq);
                    break;
                default:
                    alert('unknown entity type: ' + lns[i]);
                    return;
            }
            i = p;
        }
    }
    setNames(names, lines, p) {
        let len = lines.length;
        let i = p + 1;
        for (; i < len; i++) {
            let ln = lines[i];
            if (ln.length > 0)
                names.push(ln);
            else
                return i + 1;
        }
        return i;
    }
    setSheets(sheets, lines, p, usq) {
        let len = lines.length;
        let i = p + 1;
        for (; i < len; i++) {
            let ln = lines[i];
            if (ln.length > 0) {
                let parts = ln.split('\t');
                let name = parts[0];
                parts[0] = '$';
                let sheet = {
                    usq: usq,
                    name: name,
                    states: parts,
                };
                sheets.push(sheet);
            }
            else
                return i + 1;
        }
        return i;
    }
    saveSheetStatePosts(sheet, stateName, toArr) {
        return __awaiter(this, void 0, void 0, function* () {
            let actionSaveEntityOpPost = this.unitxUsq.crFromName('action', 'saveentityoppost');
            let { usq, name } = sheet;
            yield actionSaveEntityOpPost.submit({
                usq: usq.id,
                entityName: name,
                opName: stateName,
                posts: toArr
            });
        });
    }
    nameRender(name, icon) {
        return React.createElement("div", { className: "px-3 py-2 align-items-center" },
            icon,
            " \u00A0 ",
            name);
    }
    sheetRender(sheet, icon) {
        let { name, states } = sheet;
        return React.createElement("div", { className: "px-3 py-2 align-items-center" },
            icon,
            " \u00A0 ",
            name,
            " ",
            React.createElement(Muted, null,
                " \u00A0 ",
                sheet.states.join(', ')));
    }
}
//# sourceMappingURL=op.js.map