import * as React from 'react';
import { Page } from 'tonva-tools';
import { FA } from 'tonva-react-form';
import { VSheet } from "./vSheet";

export class VSheetSaved extends VSheet {
    private brief: any;
    async open(brief?:any) {
        this.brief = brief;
        this.openPage(this.view);
    }

    private restart = async () => {
        this.ceasePage();
        await this.event('new');
    }

    actionClick = async (action:any) => {
        this.ceasePage();
        let {id, flow, state} = this.brief;
        let res = await this.controller.action(id, flow, state, action.name);
        this.openPage(this.acted);
    }

    private buttons = <>
        <button className="btn btn-outline-primary mr-3" onClick={this.restart}>继续开单</button>
        <button className="btn btn-outline-info" onClick={()=>this.backPage()}>返回</button>
    </>;

    private view = () => {
        let {states} = this.entity;
        const state = '$';
        let s = states.find(v => v.name === state);
        let actionButtons = <>{s.actions.map((v,index) => 
            <button
                key={index}
                className="btn btn-primary mr-3"
                onClick={()=>this.actionClick(v)}
            >
                {this.controller.getActionLabel(state, v.name)}
            </button>)}
        </>;
        return <Page header="已保存" back="close">
            <div className="p-3 d-flex flex-column align-items-center">
                <div className="text-success"><FA name="check-circle-o" /> 单据已保存！系统尚未处理</div>
                <div className="p-3">
                    {actionButtons}
                    {this.buttons}
                </div>
            </div>
        </Page>;
    }

    private acted = () => {
        return <Page>
            <div className="p-3 d-flex flex-column align-items-center">
                <div className="text-success"><FA name="check-circle-o" /> 单据已处理！</div>
                <div className="p-3">
                    {this.buttons}
                </div>
            </div>
        </Page>
    }
}
