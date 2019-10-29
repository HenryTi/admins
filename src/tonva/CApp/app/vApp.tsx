import * as React from 'react';
import { VPage, Page, FA, nav, LMR, List } from "../../components";
import { appInFrame } from '../../net';
import { CApp } from "./CApp";

export class VAppMain extends VPage<CApp> {
    async open(param?:any) {
        this.openPage(this.appPage);
    }

    render(param?:any) {
        return this.appContent();
    }

    protected appPage = () => {
        let {caption} = this.controller;
        return <Page header={caption} logout={async()=>{appInFrame.unit = undefined}}>
            {this.appContent()}
        </Page>;
    }

    protected appContent = () => {
        let {cUqArr} = this.controller;
        let content:any;
        if (cUqArr.length === 0) {
            content = <div className="text-danger">
                <FA name="" /> 此APP没有绑定任何的UQ
            </div>;
        }
        else {
            content = cUqArr.map((v,i) => <div key={i}>{v.render()}</div>);
        }
        return <>{content}</>;
    };
}

export class VUnsupportedUnit extends VPage<CApp> {
    async open(predefinedUnit: number) {
        this.openPage(this.page, predefinedUnit);
    }

    private page = (predefinedUnit: number) => {
        let {user} = nav;
        let userName:string = user? user.name : '[未登录]';
        let {appOwner, appName} = this.controller.uqs;
        return <Page header="APP无法运行" logout={true}>
            <div className="m-3 text-danger container">
                <div className="form-group row">
                    <div className="col-sm-3 font-weight-bold">登录用户</div>
                    <div className="col-sm text-body">{userName}</div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-3 font-weight-bold">App</div>
                    <div className="col-sm text-body">{`${appOwner}/${appName}`}</div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-3 font-weight-bold">预设小号</div>
                    <div className="col-sm text-body">{predefinedUnit || <small className="">[无预设小号]</small>}</div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-3 font-weight-bold">
                        可能原因<FA name="exclamation-triangle" />
                    </div>
                    <div className="col-sm text-body">
                        <ul className="p-0">
                            <li>没有小号运行 {appName}</li>
                            <li>用户 <b>{userName}</b> 没有加入任何一个运行{appName}的小号</li>
                            {
                                predefinedUnit && 
                                <li>预设小号 <b>{predefinedUnit}</b> 没有运行App {appName}</li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-3 font-weight-bold">小号{predefinedUnit}</div>
                    <div className="col-sm text-body">
                        预设小号定义在 public/unit.json 文件中。
                        定义了这个文件的程序，只能由url直接启动。
                        用户第一次访问app之后，会缓存在localStorage里。<br/>
                        如果要删去缓存的预定义Unit，logout然后再login。
                    </div>
                </div>
            </div>
        </Page>;
    }
}

export class VUnitSelect extends VPage<CApp> {
    async open() {
        this.openPage(this.page);
    }

    private renderRow = (item: any, index: number):JSX.Element => {
        let {id, nick, name} = item;
        return <LMR className="px-3 py-2" right={'id: ' + id}>
            <div>{nick || name}</div>
        </LMR>;
    }
    private onRowClick = async (item: any) => {
        appInFrame.unit = item.id; // 25;
        await this.controller.start();
    }

    private page = () => {
        return <Page header="选择小号" logout={true}>
            <List items={this.controller.appUnits} item={{render: this.renderRow, onClick: this.onRowClick}}/>
        </Page>
    }
}
/*
export class VErrorsPage extends VPage<CApp> {
    async open(errors:string[]) {
        this.openPage(this.page, errors);
    }

    private page = (errors:string[]) => {
        return <Page header="ERROR">
            <div className="m-3">
                <div>Load Uqs 发生错误：</div>
                {errors.map((r, i) => <div key={i}>{r}</div>)}
            </div>
        </Page>;
    }
}

export class VAppStartError extends VPage<CApp> {
    async open(error:any) {
        this.openPage(this.page, error);
    }

    private page = (error:any) => {
        return <Page header="App start error!">
            <pre>
                {typeof error === 'string'? error : error.message}
            </pre>
        </Page>;
    }
}
*/