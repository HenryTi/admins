import React from "react";
import { Page, Controller, meInFrame, VPage } from "tonva-tools";
import { List, Muted, LMR, FA } from "tonva-react-form";
import { VOpBinding } from './vOpBinding';
import { CAction, CQuery, centerApi, entityIcons, ControllerUq } from "tonva-react-uq";
import { Organization, Team, Section, Post, Sheet, App, Uq, To, Entity, EntityBlock } from "./model";
import { VAllPosts } from "./vAllPosts";
import { VFullFunction } from "./vFullFunction";
import { VSearchUser } from "./vSearchUser";

// 单据跟操作的绑定设置
export class COpBinding extends ControllerUq {
    /*
    constructor(unitxUq: CUq, res:any) {
        super({});
        this.unitxUq = unitxUq;
    }*/

    icon = <FA name="map-o" className="text-success" fixWidth={true} />;
    label = '岗位权限 - UQ对象';

    //private unitxUq: CUq;
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
        await this.buildAppsUqs();
        this.openPage(<this.appsView />);
    }

    private async buildAppsUqs() {
        let unit = meInFrame.unit;
        let ret:any[][] = await centerApi.get('/unit/apps-uqs', {unit: unit});
        this.apps = ret[0];
        let uqs: Uq[] = ret[1];

        for (let app of this.apps) {
            app.uqs = [];
        }
        for (let uq of uqs) {
            let app = this.apps.find(v => v.id === uq.app);
            if (app === undefined) continue;
            app.uqs.push(uq);
            this.setUqEntities(uq);
        }
    }

    private async buildPosts() {
        let queryAllTeams = this.cUq.cFromName('query', 'allteams') as CQuery;
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

    private setUqEntities(uq:Uq) {
        let entities = uq.entities;
        if (entities === null) return;
        let lns = entities.split('\n');
        let len = lns.length;
        let p:number;
        for (let i=0; i<len;) {
            switch (lns[i]) {
                case 'tuid': p = this.setEntities(uq.tuids = [], lns, i, uq); break;
                case 'map': p = this.setEntities(uq.maps = [], lns, i, uq); break;
                case 'book': p = this.setEntities(uq.books = [], lns, i, uq); break;
                case 'history': p = this.setEntities(uq.histories = [], lns, i, uq); break;
                case 'pending': p = this.setEntities(uq.pendings = [], lns, i, uq); break;
                case 'query': p = this.setEntities(uq.queries = [], lns, i, uq); break;
                case 'action': p = this.setEntities(uq.actions = [], lns, i, uq); break;
                case 'sheet': p = this.setSheets(uq.sheets = [], lns, i, uq); break;
                default:
                    alert('unknown entity type: ' + lns[i]);
                    return;
            }
            i = p;
        }
    }

    private setEntities(entities:Entity[], lines:string[], p:number, uq:Uq):number {
        let len = lines.length;
        let i = p+1;
        for (; i<len; i++) {
            let ln = lines[i];
            if (ln.length > 0) {
                let name = ln;
                entities.push({
                    uq: uq,
                    name: name,
                    states: undefined
                });
            }
            else return i+1;
        }
        return i;
    }

    private setSheets(sheets:Sheet[], lines:string[], p:number, uq:Uq):number {
        let len = lines.length;
        let i = p+1;
        for (; i<len; i++) {
            let ln = lines[i];
            if (ln.length > 0) {
                let parts:string[] = ln.split('\t');
                let name = parts[0];
                parts[0] = '$';
                let sheet:Sheet = {
                    uq: uq,
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
        let actionSaveEntityOpPost = this.cUq.cFromName('action', 'saveentityoppost') as CAction;
        let {uq, name} = sheet;
        await actionSaveEntityOpPost.submit({
            uq: uq.id,
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

    async callSearchUser(uq:Uq): Promise<any> {
        let user = await this.vCall(VSearchUser, meInFrame.unit);
        return user;
    }

    private appsView = () => <Page header={this.label}>
        <div className="text-muted p-3 small">
            <div style={{lineHeight:'1.8', fontWeight:'bold'}}>说明</div>
            <ol className="pl-3" style={{listStyleType: '1', lineHeight: '1.8'}}>
                <li >
                    下面是全部启用的APP。请选择
                </li>
                <li>
                    每个APP会使用一个以上的UQ。UQ里面定义了Tuid，Action，Map和Sheet等对象。
                </li>
                <li>
                    设置对象跟岗位的关联
                </li>
            </ol>
        </div>
        <List items={this.apps} item={{render:this.appRender, onClick:this.appClick}} />
    </Page>;

    private entityRender(entity:Entity, icon:any) {
        let {name} = entity;
        return <div className="px-3 py-2 align-items-center">{icon} &nbsp; {name}</div>
    }
    private sheetRender(sheet:Sheet, icon:any) {
        let {name, states} = sheet;
        return <div className="px-3 py-2 align-items-center">
            {icon} &nbsp; {name} <Muted> &nbsp; {sheet.states.join(', ')}</Muted>
        </div>
    }
    private entityClick = async (block:EntityBlock, entity:Entity) => {
        //alert('entity click');
        let entityPosts = this.cUq.cFromName('query', 'getEntityPost') as CQuery;
        let ret = await entityPosts.entity.query({uq: entity.uq.id, entityName: entity.name});
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
        this.showVPage(VOpBinding, {entity:entity, opTos:opTos});
    }
    private sheetClick = async (block:EntityBlock, sheet:Sheet) => {
        this.sheetClickOld(sheet);
    }

    private sheetClickOld = async (sheet:Sheet) => {
        let entityPosts = this.cUq.cFromName('query', 'getEntityPost') as CQuery;
        let ret = await entityPosts.entity.query({uq: sheet.uq.id, entityName: sheet.name});
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
        this.showVPage(VOpBinding, {entity:sheet, opTos:opTos});
    }

    private renderSetting = (item:any, index:number) => {
        let {icon, color, text} = item;
        return <div className="px-3 py-2 align-items-center">
            {<FA name={icon} fixWidth={true} className={color} />} &nbsp; {text}
        </div>
    }

    private settingClick = (item:any, uq:Uq) => {
        let {name} = item;
        let V: new (coordinator) => VPage<COpBinding>;
        switch (name) {
            default: return;
            case 'entity-by-all-post': V = VAllPosts; break;
            case 'user-all-entities': V = VFullFunction; break;
        }
        this.showVPage(V, uq);
    }
    
    private uqRender = (uq:Uq, index:number) => {
        let {name, tuids, actions, maps, books, queries, histories, pendings, sheets} = uq;
        let nameRender = this.entityRender;
        let blocks:EntityBlock[] = [
            {items: tuids, type: 'tuid', itemClick: this.entityClick},
            {items: sheets, type: 'sheet', itemClick: this.sheetClick, itemRender: this.sheetRender},
            {items: actions, type: 'action', itemClick: this.entityClick},
            {items: maps, type: 'map', itemClick: this.entityClick},
            {items: books, type: 'book', itemClick: this.entityClick},
            {items: queries, type: 'query', itemClick: this.entityClick},
            {items: histories, type: 'history', itemClick: this.entityClick},
            {items: pendings, type: 'pending', itemClick: this.entityClick},
        ];

        let settings:any[] = [
            {name:'entity-by-all-post', icon: 'cog', color: 'text-success', text: '所有岗位可操作'},
            {name: 'user-all-entities', icon: 'cog', color: 'text-success', text: '全功能用户'}
        ];

        // {icon} &nbsp; {name} <Muted> &nbsp; {sheet.states.join(', ')}</Muted>
        return <div key={name} className="my-2">
            <div className="px-3 font-weight-bold">{name}</div>
            <List className="mt-3"
                items={settings}
                item={{
                    key: (item:any)=>item.name, 
                    render: this.renderSetting,
                    onClick:(item:any)=>this.settingClick(item, uq) 
                }}
             />
            {blocks.map(block => {
                let {items, type, itemClick, itemRender} = block;
                let icon = entityIcons[type];
                return items && items.length>0 &&
                    <List key={type} className="mt-3"
                        header={<Muted className="px-3 pt-1 bg-light w-100">{this.res[type]||type}</Muted>} 
                        items={items} 
                        item={{
                            key: (item:any)=>item.name, 
                            render:(item:any, index:number)=>(itemRender || nameRender)(item, icon), 
                            onClick: (item:Entity)=>itemClick(block, item)
                        }} />;
            })}
        </div>;
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
    }

    private appView = (app:App) => <Page header={app.name + '操作权限'}>
        {
            app.uqs.map((v, index) => this.uqRender(v, index))
        }
    </Page>;

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
