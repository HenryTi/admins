import React from 'react';
import { observer } from 'mobx-react';
import { IObservableValue, observable } from 'mobx';
import { Page, VmPage } from 'tonva-tools';
import { Muted, LMR, FA, List } from 'tonva-react-form';
import { CrOpBinding } from './crOpBinding';
import { StateTo, Sheet, Organization, Post, Team, Section, To } from './model';

interface SelectablePost {
    post: Post;
    selected: IObservableValue<boolean>;
    teams?: SelectableTeam[];
}

interface SelectableTeam {
    team: Team;
    selected: IObservableValue<boolean>;
    sections?: SelectableSection[];
}

interface SelectableSection {
    section: Section;
    selected: IObservableValue<boolean>;
}

export class VmOpBinding extends VmPage<CrOpBinding> {
    //protected coordinator: CrOpBinding;
    private sheet: Sheet;
    private states: StateTo[];
    private selectablePosts:SelectablePost[];
    private sheetOpsChanged:boolean = false;

    private stateClick(state:StateTo) {
        let {organizations, teams, sections, posts} = this.coordinator;
        let postTos:{[post:number]:To[]} = {};
        let {tos} = state;
        if (tos !== undefined) {
            for (let to of tos) {
                let {post} = to;
                let pid = post.id;
                let pto = postTos[pid];
                if (pto === undefined) postTos[pid] = pto = [];
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
        this.regConfirmClose(async ():Promise<boolean> => {
            if (this.sheetOpsChanged === false) return true;
            return confirm('未保存\n真的不保存吗？');
        });
    }

    private buildSelectablePost(post:Post, postTos:{[post:number]:To[]}):SelectablePost {
        let pto = postTos[post.id];
        let selected:boolean;
        let teams:SelectableTeam[];
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
        }
        return ret;
    }

    private buildSelectableTeams(post:Post, tos: To[]):SelectableTeam[] {
        let teamTos:{[team:number]:To[]} = {};
        let hasAllTeams = false;
        for (let to of tos) {
            let {team} = to;
            let teamId;
            if (team === undefined) {
                teamId = 0;
                hasAllTeams = true;
            }
            else {
                teamId = team.id;
            }
            let tto = teamTos[teamId];
            if (tto === undefined) teamTos[teamId] = tto = [];
            tto.push(to);
        }
        let sections:Section[] = [];
        for (let team of post.organization.teams) {
            if (team.sections !== undefined) sections.push(...team.sections);
        }
        let teams:SelectableTeam[] = [];
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
            selected: observable.box(teamTo0!==undefined), 
            sections: teamTo0Sections,
        });
        post.organization.teams.forEach(v => {
            let teamTo = teamTos[v.id];
            teams.push({
                team: v,
                selected: observable.box(teamTo!==undefined),
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

    private buildSelectableSections(sections:Section[], tos: To[]):SelectableSection[] {
        let selectableSections:SelectableSection[] = [];
        for (let section of sections) {
            selectableSections.push({
                section: section,
                selected: observable.box(tos && tos.find(v => v.section && section.id === v.section.id) !== undefined),
            });
        }
        return selectableSections;
    }

    private renderState(stateTo:StateTo) {
        let {name, caption, tos, tosText, configable} = stateTo;
        let content;
        if (configable === true) {
            let right = <FA className="text-muted align-self-center" name="chevron-right" />;
            let onClick = () => this.stateClick(stateTo);
            let tosView = <this.stateTosView tosText={tosText} />;
            content = <>
                <LMR className="bg-white py-1 px-2 cursor-pointer" right={right} onClick={onClick}>
                    {caption}
                </LMR>
                {tosView}
            </>
        }
        else {
            content = <div className="bg-white py-1 px-2">
                {caption}
            </div>;
        }
        return <div key={name} className="border border-light rounded mx-1 my-3">
            {content}
        </div>
    }

    private stateTosView = observer(({tosText}:{tosText: IObservableValue<string[]>}) => {
        let tos = tosText.get();
        return <div className="bg-light py-1 px-2">{
            tos === undefined || tos.length === 0? <Muted>[无岗位]</Muted> :
            tos.map((v,index) => {
                return <span
                    key={v}
                    className="d-inline-block border bg-white rounded mr-2 my-1 py-1 px-2">
                    {v}
                </span>
            })
        }
        </div>
    });

    private tosTexts(tos: To[]):string[] {
        return tos && tos.map((v,index) => {
            let {post, team, section} = v;
            let content:string = post.title;
            if (team !== undefined && team.id > 0) content += ' @ ' + team.name;
            if (section !== undefined) {
                if (team === undefined || team.id === 0) content += ' @ * ';
                content += ' / ' + section.name;
            }
            return content;
        });
    }

    async showEntry({sheet, opTos}:{sheet:Sheet, opTos:{[op:string]:To[]}}) {
        this.sheet = sheet;
        let {name, states} = sheet;
        this.states = states.map(v => {
            let prefix = v.substr(0, 1);
            let caption: string | JSX.Element;
            let configable: boolean;
            let tos;
            switch (prefix) {
                case '<': caption = <>{v.substr(1)} &nbsp; <Muted>回复</Muted></>; configable = false; break;
                case '#': caption = <>{v.substr(1)} &nbsp; <Muted>返初</Muted></>; configable = false; break;
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
                tosText: observable.box<string[]>(this.tosTexts(tos)),
            };
        })
        this.openPageElement(<Page header={'单据状态对应岗位 - ' + name} >
            {this.states.map(v => this.renderState(v))}
        </Page>);
    }

    private async saveOps(stateTo: StateTo) {
        let stateToName = stateTo.name;
        let tos:To[] = [];
        let toArr:{post:number, team:number, section:number}[] = [];
        for (let sp of this.selectablePosts) {
            if (sp.selected.get() === false) continue;
            let postId = sp.post.id;
            let teamCount = 0;
            for (let st of sp.teams) {
                if (st.selected.get() === false) continue;
                let teamId = st.team.id;
                ++teamCount;
                let sectionCount = 0;
                for (let ss of st.sections) {
                    if (ss.selected.get() === false) continue;
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
        await this.coordinator.saveSheetStatePosts(this.sheet, stateToName, toArr);
        let state = this.states.find(v => v.name === stateToName);
        state.tos = tos;
        let tosTexts = this.tosTexts(tos);
        state.tosText.set(tosTexts);
        this.closePage();
    }

    private organizationRow = (item: Organization, index:number) => {
        let {id, name} = item;
        return <div>id:{id} name:{name}</div>;
    }
    private teamRow = (item: SelectableTeam, index:number) => {
        return <this.observableTeamRow {...item} />;
    }
    private sectionRow = (item: SelectableSection, index:number) => {
        return <this.observableSectionRow {...item} />;
    }
    private postRow = (item:SelectablePost, index:number) => {
        return <this.observablePostRow {...item} />;
    };
    private stateView: React.SFC<StateTo> = (state:StateTo) => {
        let stateCaption = state.name;
        if (stateCaption === '$') stateCaption = '[新开单]';
        let right = <button className="btn btn-sm btn-success" onClick={async ()=>await this.saveOps(state)}>保存</button>
        return <Page header={`${this.sheet.name} - ${stateCaption}`}
            back="close"
            right={right}>
            <div className="mx-3 my-2">
                <Muted>设置单据状态跟岗位的对应关系</Muted>
            </div>
            <List className="my-2" 
                items={this.selectablePosts} 
                item={{render: this.postRow}} />
        </Page>
    }
    /*
    <List className="my-2" header="Organization" items={organizations} item={{render: this.organizationRow}} />
    <List className="my-2" header="Team" items={teams} item={{render: this.teamRow}} />
    <List className="my-2" header="Section" items={sections} item={{render: this.sectionRow}} />
    */

    private onPostSelectChanged(item:SelectablePost, checked:boolean) {
        this.sheetOpsChanged = true;
        let {post, selected} = item;
        if (checked === true) {
            let sections:Section[] = [];
            for (let team of post.organization.teams) {
                if (team.sections !== undefined) sections.push(...team.sections);
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
                sections:[]
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

    private onTeamSelectChanged(item:SelectableTeam, checked:boolean) {
        this.sheetOpsChanged = true;
        let {team, selected} = item;
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

    private onSectionSelectChanged(item:SelectableSection, checked:boolean) {
        this.sheetOpsChanged = true;
        let {section, selected} = item;
        selected.set(checked);
    }

    private observablePostRow = observer((item:SelectablePost) => {
        let {post, selected, teams} = item;
        let {title} = post;
        let teamsList;
        let defaultSelected = selected.get();
        if (defaultSelected === true) {
            teamsList = <List className="ml-4 va-list-top-border" items={teams} item={{render:this.teamRow}} />
        }
        return <div className="flex-column">
            <label className="px-3 py-2 w-100 mb-0">
                <input className="mr-3 align-middle"
                    type="checkbox" 
                    defaultChecked={defaultSelected}
                    onChange={(evt)=>this.onPostSelectChanged(item, evt.target.checked)} />
                <Muted>岗位</Muted> &nbsp; {title}
            </label>
            {teamsList}
        </div>;
    });

    private observableTeamRow = observer((item:SelectableTeam) => {
        let {team, selected, sections} = item;
        let {name} = team;
        let teamsList;
        let defaultSelected = selected.get();
        if (defaultSelected === true && sections.length > 0) {
            teamsList = <List className="ml-4 va-list-top-border" items={sections} item={{render:this.sectionRow}} />
        }
        return <div className="flex-column">
            <label className="px-3 py-2 w-100 mb-0">
                <input className="mr-3 align-middle"
                    type="checkbox" 
                    defaultChecked={defaultSelected}
                    onChange={(evt)=>this.onTeamSelectChanged(item, evt.target.checked)} />
                <Muted>部门</Muted> &nbsp; {name}
            </label>
            {teamsList}
        </div>;
    });

    private observableSectionRow = observer((item:SelectableSection) => {
        let {section, selected} = item;
        let {name} = section;
        let defaultSelected = selected.get();
        return <div className="flex-column">
            <label className="px-3 py-2 w-100 mb-0">
                <input className="mr-3 align-middle"
                    type="checkbox" 
                    defaultChecked={defaultSelected}
                    onChange={(evt)=>this.onSectionSelectChanged(item, evt.target.checked)} />
                <Muted>大部</Muted> &nbsp; {name}
            </label>
        </div>;
    });
}
 