var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Page } from 'tonva-tools';
import { Muted, LMR, FA, List } from 'tonva-react-form';
import { VmPage } from 'tonva-react-usql';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
export class VmOpBinding extends VmPage {
    constructor() {
        super(...arguments);
        this.sheetOpsChanged = false;
        this.stateTosView = observer(({ tosText }) => {
            let tos = tosText.get();
            return React.createElement("div", { className: "bg-light py-1 px-2" }, tos === undefined || tos.length === 0 ? React.createElement(Muted, null, "[\u65E0\u5C97\u4F4D]") :
                tos.map((v, index) => {
                    return React.createElement("span", { key: v, className: "d-inline-block border bg-white rounded mr-2 my-1 py-1 px-2" }, v);
                }));
        });
        this.organizationRow = (item, index) => {
            let { id, name } = item;
            return React.createElement("div", null,
                "id:",
                id,
                " name:",
                name);
        };
        this.teamRow = (item, index) => {
            return React.createElement(this.observableTeamRow, Object.assign({}, item));
        };
        this.sectionRow = (item, index) => {
            return React.createElement(this.observableSectionRow, Object.assign({}, item));
        };
        this.postRow = (item, index) => {
            return React.createElement(this.observablePostRow, Object.assign({}, item));
        };
        this.stateView = (state) => {
            let stateCaption = state.name;
            if (stateCaption === '$')
                stateCaption = '[新开单]';
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: () => __awaiter(this, void 0, void 0, function* () { return yield this.saveOps(state); }) }, "\u4FDD\u5B58");
            return React.createElement(Page, { header: `${this.sheet.name} - ${stateCaption}`, back: "close", right: right },
                React.createElement("div", { className: "mx-3 my-2" },
                    React.createElement(Muted, null, "\u8BBE\u7F6E\u5355\u636E\u72B6\u6001\u8DDF\u5C97\u4F4D\u7684\u5BF9\u5E94\u5173\u7CFB")),
                React.createElement(List, { className: "my-2", items: this.selectablePosts, item: { render: this.postRow } }));
        };
        this.observablePostRow = observer((item) => {
            let { post, selected, teams } = item;
            let { title } = post;
            let teamsList;
            let defaultSelected = selected.get();
            if (defaultSelected === true) {
                teamsList = React.createElement(List, { className: "ml-4 va-list-top-border", items: teams, item: { render: this.teamRow } });
            }
            return React.createElement("div", { className: "flex-column" },
                React.createElement("label", { className: "px-3 py-2 w-100 mb-0" },
                    React.createElement("input", { className: "mr-3 align-middle", type: "checkbox", defaultChecked: defaultSelected, onChange: (evt) => this.onPostSelectChanged(item, evt.target.checked) }),
                    React.createElement(Muted, null, "\u5C97\u4F4D"),
                    " \u00A0 ",
                    title),
                teamsList);
        });
        this.observableTeamRow = observer((item) => {
            let { team, selected, sections } = item;
            let { name } = team;
            let teamsList;
            let defaultSelected = selected.get();
            if (defaultSelected === true && sections.length > 0) {
                teamsList = React.createElement(List, { className: "ml-4 va-list-top-border", items: sections, item: { render: this.sectionRow } });
            }
            return React.createElement("div", { className: "flex-column" },
                React.createElement("label", { className: "px-3 py-2 w-100 mb-0" },
                    React.createElement("input", { className: "mr-3 align-middle", type: "checkbox", defaultChecked: defaultSelected, onChange: (evt) => this.onTeamSelectChanged(item, evt.target.checked) }),
                    React.createElement(Muted, null, "\u90E8\u95E8"),
                    " \u00A0 ",
                    name),
                teamsList);
        });
        this.observableSectionRow = observer((item) => {
            let { section, selected } = item;
            let { name } = section;
            let defaultSelected = selected.get();
            return React.createElement("div", { className: "flex-column" },
                React.createElement("label", { className: "px-3 py-2 w-100 mb-0" },
                    React.createElement("input", { className: "mr-3 align-middle", type: "checkbox", defaultChecked: defaultSelected, onChange: (evt) => this.onSectionSelectChanged(item, evt.target.checked) }),
                    React.createElement(Muted, null, "\u5927\u90E8"),
                    " \u00A0 ",
                    name));
        });
    }
    stateClick(state) {
        let { organizations, teams, sections, posts } = this.coordinator;
        let postTos = {};
        let { tos } = state;
        if (tos !== undefined) {
            for (let to of tos) {
                let { post } = to;
                let pid = post.id;
                let pto = postTos[pid];
                if (pto === undefined)
                    postTos[pid] = pto = [];
                pto.push(to);
            }
        }
        this.selectablePosts = posts.map(v => this.buildSelectablePost(v, postTos));
        /*
            return {
                post: v,
                selected: observable.box(false),
                teams: [],
            }
        });*/
        this.sheetOpsChanged = false;
        this.openPage(this.stateView, state);
        this.regConfirmClose(() => __awaiter(this, void 0, void 0, function* () {
            if (this.sheetOpsChanged === false)
                return true;
            return confirm('未保存\n真的不保存吗？');
        }));
    }
    buildSelectablePost(post, postTos) {
        let pto = postTos[post.id];
        let selected;
        let teams;
        if (pto === undefined) {
            selected = false;
            teams = [];
        }
        else {
            selected = true;
            teams = this.buildSelectableTeams(post, pto);
        }
        let ret = {
            post: post,
            selected: observable.box(selected),
            teams: teams,
        };
        return ret;
    }
    buildSelectableTeams(post, tos) {
        let teamTos = {};
        let hasAllTeams = false;
        for (let to of tos) {
            let { team } = to;
            let teamId;
            if (team === undefined) {
                teamId = 0;
                hasAllTeams = true;
            }
            else {
                teamId = team.id;
            }
            let tto = teamTos[teamId];
            if (tto === undefined)
                teamTos[teamId] = tto = [];
            tto.push(to);
        }
        let sections = [];
        for (let team of post.organization.teams) {
            if (team.sections !== undefined)
                sections.push(...team.sections);
        }
        let teams = [];
        let teamTo0 = teamTos[0];
        let teamTo0Sections = this.buildSelectableSections(sections, teamTo0);
        teams.push({
            team: {
                id: 0,
                name: '* 所有部门',
                no: undefined,
                sections: sections,
                organizations: undefined,
            },
            selected: observable.box(teamTo0 !== undefined),
            sections: teamTo0Sections,
        });
        post.organization.teams.forEach(v => {
            let teamTo = teamTos[v.id];
            teams.push({
                team: v,
                selected: observable.box(teamTo !== undefined),
                sections: this.buildSelectableSections(sections, teamTo),
            });
        });
        if (hasAllTeams === true && tos.length === 1) {
            let selectableTeam0 = teams[0];
            let hasSection = false;
            for (let selectableSection of selectableTeam0.sections) {
                if (selectableSection.selected.get() === true) {
                    hasSection = true;
                    break;
                }
            }
            if (hasSection === false) {
                selectableTeam0.selected.set(false);
                selectableTeam0.sections = [];
            }
        }
        return teams;
    }
    buildSelectableSections(sections, tos) {
        let selectableSections = [];
        for (let section of sections) {
            selectableSections.push({
                section: section,
                selected: observable.box(tos && tos.find(v => v.section && section.id === v.section.id) !== undefined),
            });
        }
        return selectableSections;
    }
    renderState(stateTo) {
        let { name, caption, tos, tosText, configable } = stateTo;
        let content;
        if (configable === true) {
            let right = React.createElement(FA, { className: "text-muted align-self-center", name: "chevron-right" });
            let onClick = () => this.stateClick(stateTo);
            let tosView = React.createElement(this.stateTosView, { tosText: tosText });
            content = React.createElement(React.Fragment, null,
                React.createElement(LMR, { className: "bg-white py-1 px-2 cursor-pointer", right: right, onClick: onClick }, caption),
                tosView);
        }
        else {
            content = React.createElement("div", { className: "bg-white py-1 px-2" }, caption);
        }
        return React.createElement("div", { key: name, className: "border border-light rounded mx-1 my-3" }, content);
    }
    tosTexts(tos) {
        return tos && tos.map((v, index) => {
            let { post, team, section } = v;
            let content = post.title;
            if (team !== undefined && team.id > 0)
                content += ' @ ' + team.name;
            if (section !== undefined) {
                if (team === undefined || team.id === 0)
                    content += ' @ * ';
                content += ' / ' + section.name;
            }
            return content;
        });
    }
    showEntry({ sheet, opTos }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sheet = sheet;
            let { name, states } = sheet;
            this.states = states.map(v => {
                let prefix = v.substr(0, 1);
                let caption;
                let configable;
                let tos;
                switch (prefix) {
                    case '<':
                        caption = React.createElement(React.Fragment, null,
                            v.substr(1),
                            " \u00A0 ",
                            React.createElement(Muted, null, "\u56DE\u590D"));
                        configable = false;
                        break;
                    case '#':
                        caption = React.createElement(React.Fragment, null,
                            v.substr(1),
                            " \u00A0 ",
                            React.createElement(Muted, null, "\u8FD4\u521D"));
                        configable = false;
                        break;
                    case '$':
                        caption = '[新开单]';
                        configable = true;
                        tos = opTos[v];
                        break;
                    default:
                        caption = v;
                        configable = true;
                        tos = opTos[v];
                        break;
                }
                return {
                    name: v,
                    caption: caption,
                    configable: configable,
                    tos: tos,
                    tosText: observable.box(this.tosTexts(tos)),
                };
            });
            this.openPageElement(React.createElement(Page, { header: '单据状态对应岗位 - ' + name }, this.states.map(v => this.renderState(v))));
        });
    }
    saveOps(stateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            let stateToName = stateTo.name;
            let tos = [];
            let toArr = [];
            for (let sp of this.selectablePosts) {
                if (sp.selected.get() === false)
                    continue;
                let postId = sp.post.id;
                let teamCount = 0;
                for (let st of sp.teams) {
                    if (st.selected.get() === false)
                        continue;
                    let teamId = st.team.id;
                    ++teamCount;
                    let sectionCount = 0;
                    for (let ss of st.sections) {
                        if (ss.selected.get() === false)
                            continue;
                        let sectionId = ss.section.id;
                        ++sectionCount;
                        toArr.push({
                            post: postId,
                            team: teamId,
                            section: sectionId,
                        });
                        tos.push({
                            post: sp.post,
                            team: st.team,
                            section: ss.section,
                        });
                    }
                    if (sectionCount === 0) {
                        toArr.push({
                            post: postId,
                            team: teamId,
                            section: 0,
                        });
                        tos.push({
                            post: sp.post,
                            team: st.team,
                            section: undefined,
                        });
                    }
                }
                if (teamCount === 0) {
                    toArr.push({
                        post: postId,
                        team: 0,
                        section: 0,
                    });
                    tos.push({
                        post: sp.post,
                        team: undefined,
                        section: undefined,
                    });
                }
            }
            yield this.coordinator.saveSheetStatePosts(this.sheet, stateToName, toArr);
            let state = this.states.find(v => v.name === stateToName);
            state.tos = tos;
            let tosTexts = this.tosTexts(tos);
            state.tosText.set(tosTexts);
            this.closePage();
        });
    }
    /*
    <List className="my-2" header="Organization" items={organizations} item={{render: this.organizationRow}} />
    <List className="my-2" header="Team" items={teams} item={{render: this.teamRow}} />
    <List className="my-2" header="Section" items={sections} item={{render: this.sectionRow}} />
    */
    onPostSelectChanged(item, checked) {
        this.sheetOpsChanged = true;
        let { post, selected } = item;
        if (checked === true) {
            let sections = [];
            for (let team of post.organization.teams) {
                if (team.sections !== undefined)
                    sections.push(...team.sections);
            }
            item.teams.push({
                team: {
                    id: 0,
                    name: '* 所有部门',
                    no: undefined,
                    sections: sections,
                    organizations: undefined,
                },
                selected: observable.box(false),
                sections: []
            });
            post.organization.teams.forEach(v => {
                item.teams.push({
                    team: v,
                    selected: observable.box(false),
                    sections: []
                });
            });
        }
        else {
            item.teams.splice(0);
        }
        selected.set(checked);
    }
    onTeamSelectChanged(item, checked) {
        this.sheetOpsChanged = true;
        let { team, selected } = item;
        if (checked === true) {
            //item.sections.push({section: undefined, selected: observable.box(false)});
            team.sections.forEach(v => {
                item.sections.push({
                    section: v,
                    selected: observable.box(false)
                });
            });
        }
        else {
            item.sections.splice(0);
        }
        selected.set(checked);
    }
    onSectionSelectChanged(item, checked) {
        this.sheetOpsChanged = true;
        let { section, selected } = item;
        selected.set(checked);
    }
}
//# sourceMappingURL=vmOpBinding.js.map