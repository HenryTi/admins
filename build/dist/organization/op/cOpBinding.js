var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import { Page, meInFrame } from "tonva-tools";
import { List, Muted, LMR, FA } from "tonva-react-form";
import { VOpBinding } from './vOpBinding';
import { centerApi, entityIcons, ControllerUsq } from "tonva-react-usql";
import { VAllPosts } from "./vAllPosts";
import { VFullFunction } from "./vFullFunction";
// 单据跟操作的绑定设置
export class COpBinding extends ControllerUsq {
    constructor() {
        /*
        constructor(unitxUsq: CUsq, res:any) {
            super({});
            this.unitxUsq = unitxUsq;
        }*/
        super(...arguments);
        this.icon = React.createElement(FA, { name: "map-o", className: "text-success", fixWidth: true });
        this.label = '岗位权限 - USQ对象';
        this.appRender = (app, index) => {
            let { name, discription } = app;
            return React.createElement(LMR, { className: "px-3 py-2", right: discription && React.createElement(Muted, null, discription) }, name);
        };
        this.appClick = (app) => {
            this.openPage(React.createElement(this.appView, Object.assign({}, app)));
        };
        this.appsView = () => React.createElement(Page, { header: this.label },
            React.createElement("div", { className: "text-muted p-3 small" },
                React.createElement("div", { style: { lineHeight: '1.8', fontWeight: 'bold' } }, "\u8BF4\u660E"),
                React.createElement("ol", { className: "pl-3", style: { listStyleType: '1', lineHeight: '1.8' } },
                    React.createElement("li", null, "\u4E0B\u9762\u662F\u5168\u90E8\u542F\u7528\u7684APP\u3002\u8BF7\u9009\u62E9"),
                    React.createElement("li", null, "\u6BCF\u4E2AAPP\u4F1A\u4F7F\u7528\u4E00\u4E2A\u4EE5\u4E0A\u7684USQ\u3002USQ\u91CC\u9762\u5B9A\u4E49\u4E86Tuid\uFF0CAction\uFF0CMap\u548CSheet\u7B49\u5BF9\u8C61\u3002"),
                    React.createElement("li", null, "\u8BBE\u7F6E\u5BF9\u8C61\u8DDF\u5C97\u4F4D\u7684\u5173\u8054"))),
            React.createElement(List, { items: this.apps, item: { render: this.appRender, onClick: this.appClick } }));
        this.entityClick = (block, entity) => __awaiter(this, void 0, void 0, function* () {
            //alert('entity click');
            let entityPosts = this.cUsq.cFromName('query', 'getEntityPost');
            let ret = yield entityPosts.entity.query({ usq: entity.usq.id, entityName: entity.name });
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
            this.showVPage(VOpBinding, { entity: entity, opTos: opTos });
        });
        this.sheetClick = (block, sheet) => __awaiter(this, void 0, void 0, function* () {
            this.sheetClickOld(sheet);
        });
        this.sheetClickOld = (sheet) => __awaiter(this, void 0, void 0, function* () {
            let entityPosts = this.cUsq.cFromName('query', 'getEntityPost');
            let ret = yield entityPosts.entity.query({ usq: sheet.usq.id, entityName: sheet.name });
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
            this.showVPage(VOpBinding, { entity: sheet, opTos: opTos });
        });
        this.renderSetting = (item, index) => {
            let { icon, color, text } = item;
            return React.createElement("div", { className: "px-3 py-2 align-items-center" },
                React.createElement(FA, { name: icon, fixWidth: true, className: color }),
                " \u00A0 ",
                text);
        };
        this.settingClick = (item, usq) => {
            let { name } = item;
            let V;
            switch (name) {
                default: return;
                case 'entity-by-all-post':
                    V = VAllPosts;
                    break;
                case 'user-all-entities':
                    V = VFullFunction;
                    break;
            }
            this.showVPage(V, usq);
        };
        this.usqRender = (usq, index) => {
            let { name, tuids, actions, maps, books, queries, histories, pendings, sheets } = usq;
            let nameRender = this.entityRender;
            let blocks = [
                { items: tuids, type: 'tuid', itemClick: this.entityClick },
                { items: sheets, type: 'sheet', itemClick: this.sheetClick, itemRender: this.sheetRender },
                { items: actions, type: 'action', itemClick: this.entityClick },
                { items: maps, type: 'map', itemClick: this.entityClick },
                { items: books, type: 'book', itemClick: this.entityClick },
                { items: queries, type: 'query', itemClick: this.entityClick },
                { items: histories, type: 'history', itemClick: this.entityClick },
                { items: pendings, type: 'pending', itemClick: this.entityClick },
            ];
            let settings = [
                { name: 'entity-by-all-post', icon: 'cog', color: 'text-success', text: '所有岗位可操作' },
                { name: 'user-all-entities', icon: 'cog', color: 'text-success', text: '全功能用户' }
            ];
            // {icon} &nbsp; {name} <Muted> &nbsp; {sheet.states.join(', ')}</Muted>
            return React.createElement("div", { key: name, className: "my-2" },
                React.createElement("div", { className: "px-3 font-weight-bold" }, name),
                React.createElement(List, { className: "mt-3", items: settings, item: {
                        key: (item) => item.name,
                        render: this.renderSetting,
                        onClick: (item) => this.settingClick(item, usq)
                    } }),
                blocks.map(block => {
                    let { items, type, itemClick, itemRender } = block;
                    let icon = entityIcons[type];
                    return items && items.length > 0 &&
                        React.createElement(List, { key: type, className: "mt-3", header: React.createElement(Muted, { className: "px-3 pt-1 bg-light w-100" }, this.res[type] || type), items: items, item: {
                                key: (item) => item.name,
                                render: (item, index) => (itemRender || nameRender)(item, icon),
                                onClick: (item) => itemClick(block, item)
                            } });
                }));
            /*
            function headerCaption(caption:string):JSX.Element {
                return <Muted className="px-3 pt-1 bg-light w-100">{caption}</Muted>
            }
            function itemList(items:any[], type:string, itemClick:(item:any)=>void, render:((item:any, icon:any)=>JSX.Element) = nameRender) {
                //let res = entitiesRes;
                //let {caption, icon} = res[type];
                let icon = entityIcons[type];
                return items &&
                    <List className="mt-3"
                        header={headerCaption(type)}
                        items={items}
                        item={{render:(item:any, index:number)=>render(item, icon), onClick: itemClick}} />;
            }
                {itemList(tuids, 'tuid', this.tuidClick)}
                {itemList(sheets, 'sheet', this.sheetClickOld, this.sheetRender)}
                {itemList(actions, 'action', this.actionClick)}
                {itemList(maps, 'map', this.mapClick)}
                {itemList(books, 'book', this.bookClick)}
                {itemList(queries, 'query', this.queryClick)}
                {itemList(histories, 'history', this.historyClick)}
                {itemList(pendings, 'pending', this.pendingClick)}
            */
        };
        this.appView = (app) => React.createElement(Page, { header: app.name + '操作权限' }, app.usqs.map((v, index) => this.usqRender(v, index)));
        /*
        private tuidClick = (entityName:string) => {
            alert(entityName);
        }
        private mapClick = (entityName:string) => {
            alert(entityName);
        }
        private actionClick = (entityName:string) => {
            alert(entityName);
        }
        private bookClick = (entityName:string) => {
            alert(entityName);
        }
        private queryClick = (entityName:string) => {
            alert(entityName);
        }
        private historyClick = (entityName:string) => {
            alert(entityName);
        }
        private pendingClick = (entityName:string) => {
            alert(entityName);
        }
        */
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
            let queryAllTeams = this.cUsq.cFromName('query', 'allteams');
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
                if (organization === undefined) {
                    continue;
                }
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
                    p = this.setEntities(usq.tuids = [], lns, i, usq);
                    break;
                case 'map':
                    p = this.setEntities(usq.maps = [], lns, i, usq);
                    break;
                case 'book':
                    p = this.setEntities(usq.books = [], lns, i, usq);
                    break;
                case 'history':
                    p = this.setEntities(usq.histories = [], lns, i, usq);
                    break;
                case 'pending':
                    p = this.setEntities(usq.pendings = [], lns, i, usq);
                    break;
                case 'query':
                    p = this.setEntities(usq.queries = [], lns, i, usq);
                    break;
                case 'action':
                    p = this.setEntities(usq.actions = [], lns, i, usq);
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
    setEntities(entities, lines, p, usq) {
        let len = lines.length;
        let i = p + 1;
        for (; i < len; i++) {
            let ln = lines[i];
            if (ln.length > 0) {
                let name = ln;
                entities.push({
                    usq: usq,
                    name: name,
                    states: undefined
                });
            }
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
            let actionSaveEntityOpPost = this.cUsq.cFromName('action', 'saveentityoppost');
            let { usq, name } = sheet;
            yield actionSaveEntityOpPost.submit({
                usq: usq.id,
                entityName: name,
                opName: stateName,
                posts: toArr
            });
        });
    }
    entityRender(entity, icon) {
        let { name } = entity;
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
//# sourceMappingURL=cOpBinding.js.map