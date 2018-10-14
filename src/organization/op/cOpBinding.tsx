import React from "react";
import { Page, Controller, meInFrame } from "tonva-tools";
import { List, Muted, LMR, FA } from "tonva-react-form";
import { VOpBinding } from './vOpBinding';
import { CAction, CQuery, CUsq, centerApi, entityIcons } from "tonva-react-usql";
import { Organization, Team, Section, Post, Sheet, App, Usq, To } from "./model";

// 单据跟操作的绑定设置
export class COpBinding extends Controller {
    constructor(unitxUsq: CUsq) {
        super({});
        this.unitxUsq = unitxUsq;
    }

    icon = <FA name="map-o" className="text-success" fixWidth={true} />;
    label = '岗位权限 - USQ对象';

    private unitxUsq: CUsq;
    private apps: App[];
    organizations: Organization[];
    teams: Team[];
    sections: Section[];
    posts: Post[];
    postDict: {[id:number]:Post};
    teamDict: {[id:number]:Team};
    organizationDict: {[id:number]:Organization};
    sectionDict: {[id:number]:Section};

    protected async internalStart():Promise<void> {
        await this.buildPosts();
        await this.buildAppsUsqs();
        this.openPage(<this.appsView />);
    }

    private async buildAppsUsqs() {
        let unit = meInFrame.unit;
        let ret:any[][] = await centerApi.get('/unit/apps-usqs', {unit: unit});
        this.apps = ret[0];
        let usqs: Usq[] = ret[1];

        for (let app of this.apps) {
            app.usqs = [];
        }
        for (let usq of usqs) {
            let app = this.apps.find(v => v.id === usq.app);
            if (app === undefined) continue;
            app.usqs.push(usq);
            this.setUsqEntities(usq);
        }
    }

    private async buildPosts() {
        let queryAllTeams = this.unitxUsq.cFromName('query', 'allteams') as CQuery;
        let ret:any[][] = await queryAllTeams.entity.query(undefined);
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
            let {team:tm, organization:og} = teamOrganization;
            let team = this.teamDict[tm];
            let organization = this.organizationDict[og];
            team.organizations.push(organization);
            organization.teams.push(team);
        }
        // sectionTeam
        for (let sectionTeam of ret['sectionteam']) {
            let {section:sec, team:tm} = sectionTeam;
            let section = this.sectionDict[sec];
            let team = this.teamDict[tm];
            section.teams.push(team);
            team.sections.push(section);
        }
    }

    private setUsqEntities(usq:Usq) {
        let entities = usq.entities;
        if (entities === null) return;
        let lns = entities.split('\n');
        let len = lns.length;
        let p:number;
        for (let i=0; i<len;) {
            switch (lns[i]) {
                case 'tuid': p = this.setNames(usq.tuids = [], lns, i); break;
                case 'map': p = this.setNames(usq.maps = [], lns, i); break;
                case 'book': p = this.setNames(usq.books = [], lns, i); break;
                case 'history': p = this.setNames(usq.histories = [], lns, i); break;
                case 'pending': p = this.setNames(usq.pendings = [], lns, i); break;
                case 'query': p = this.setNames(usq.queries = [], lns, i); break;
                case 'action': p = this.setNames(usq.actions = [], lns, i); break;
                case 'sheet': p = this.setSheets(usq.sheets = [], lns, i, usq); break;
                default:
                    alert('unknown entity type: ' + lns[i]);
                    return;
            }
            i = p;
        }
    }

    private setNames(names:string[], lines:string[], p:number):number {
        let len = lines.length;
        let i = p+1;
        for (; i<len; i++) {
            let ln = lines[i];
            if (ln.length > 0) names.push(ln);
            else return i+1;
        }
        return i;
    }

    private setSheets(sheets:Sheet[], lines:string[], p:number, usq:Usq):number {
        let len = lines.length;
        let i = p+1;
        for (; i<len; i++) {
            let ln = lines[i];
            if (ln.length > 0) {
                let parts:string[] = ln.split('\t');
                let name = parts[0];
                parts[0] = '$';
                let sheet:Sheet = {
                    usq: usq,
                    name: name,
                    states: parts,
                }
                sheets.push(sheet);
            }
            else return i+1;
        }
        return i;
    }

    async saveSheetStatePosts(sheet:Sheet, stateName:string, toArr:{post:number, team:number, section:number}[]) {
        let actionSaveEntityOpPost = this.unitxUsq.cFromName('action', 'saveentityoppost') as CAction;
        let {usq, name} = sheet;
        await actionSaveEntityOpPost.submit({
            usq: usq.id,
            entityName: name,
            opName: stateName,
            posts: toArr
        });
    }

    private appRender = (app:App, index:number) => {
        let {name, discription} = app;
        return <LMR className="px-3 py-2" right={discription && <Muted>{discription}</Muted>}>
            {name}
        </LMR>
    }

    private appClick = (app:App) => {
        this.openPage(<this.appView {...app} />)
    }

    private appsView = () => <Page header={this.label}>
        <div className="text-dark p-3 pl-5 small">
            <div>说明</div>
            <ol className="pl-0" style={{listStyleType: '1', lineHeight: '1.8'}}>
                <li >
                    下面是全部启用的APP。请选择
                </li>
                <li>
                    每个APP会使用一个以上的USQ。USQ里面定义了Tuid，Action，Map和Sheet等对象。
                </li>
                <li>
                    设置对象跟岗位的关联
                </li>
            </ol>
        </div>
        <List items={this.apps} item={{render:this.appRender, onClick:this.appClick}} />
    </Page>;

    private nameRender(name:string, icon:any) {
        return <div className="px-3 py-2 align-items-center">{icon} &nbsp; {name}</div>
    }
    private sheetRender(sheet:Sheet, icon:any) {
        let {name, states} = sheet;
        return <div className="px-3 py-2 align-items-center">
            {icon} &nbsp; {name} <Muted> &nbsp; {sheet.states.join(', ')}</Muted>
        </div>
    }
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
    private sheetClick = async (sheet:Sheet) => {
        let entityPosts = this.unitxUsq.cFromName('query', 'getEntityPost') as CQuery;
        let ret = await entityPosts.entity.query({entityName: sheet.name});
        let opTos:{[op:string]:To[]} = {};
        for (let row of ret.ret) {
            let {op, post, team, section} = row;
            let opTo = opTos[op];
            if (opTo === undefined) opTos[op] = opTo = [];
            opTo.push({
                post: this.postDict[post],
                team: this.teamDict[team],
                section: this.sectionDict[section],
            });
        }
        this.showVPage(VOpBinding, {sheet:sheet, opTos:opTos});
    }
    private usqRender = (usq:Usq, index:number) => {
        let {name, tuids, actions, maps, books, queries, histories, pendings, sheets} = usq;
        let nameRender = this.nameRender;
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
        return <div key={name} className="my-2">
            <div className="px-3 font-weight-blid">{name}</div>
            {itemList(tuids, 'tuid', this.tuidClick)}
            {itemList(sheets, 'sheet', this.sheetClick, this.sheetRender)}
            {itemList(actions, 'action', this.actionClick)}
            {itemList(maps, 'map', this.mapClick)}
            {itemList(books, 'book', this.bookClick)}
            {itemList(queries, 'query', this.queryClick)}
            {itemList(histories, 'history', this.historyClick)}
            {itemList(pendings, 'pending', this.pendingClick)}
        </div>;
    }

    private appView = (app:App) => <Page header={app.name + '操作权限'}>
        {
            app.usqs.map((v, index) => this.usqRender(v, index))
        }
    </Page>;
}
