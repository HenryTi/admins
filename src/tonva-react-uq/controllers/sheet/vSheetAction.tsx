import React from 'react';
import classNames from 'classnames';
import { nav, Page } from 'tonva-tools';
import { FA } from 'tonva-react-form';
import { VSheetView } from './vSheetView';
import { SheetData } from './cSheet';

export class VSheetAction extends VSheetView { 
    async open(sheetData:SheetData) {
        this.sheetData = sheetData;
        //let {brief, data, flows} = await this.controller.getSheetData(sheetId);
        //this.brief = brief;
        //this.flows = flows;
        //this.data = data;
        //this.state = this.brief.state;
        this.vForm = this.createForm(undefined, sheetData.data);
        this.openPage(this.page);
    }

    actionClick = async (action:any) => {
        let {id, flow, state} = this.sheetData.brief;
        let res = await this.controller.action(id, flow, state, action.name);
        this.ceasePage();
        this.openPage(this.acted);
        //alert(jsonStringify(res));
        //await this.backPage();
    }

    deleteClick = async () => {
        alert('单据作废：程序正在设计中');
    }

    editClick = async () => {
        //alert('修改单据：程序正在设计中');
        let values = await this.controller.editSheet(this.sheetData);
        this.vForm.setValues(values);
    }

    protected page = () => {
        let {brief} = this.sheetData;
        let {state, no} = brief;
        let stateLabel = this.controller.getStateLabel(state);
        let {states} = this.entity;
        let s = states.find(v => v.name === state);
        let actionButtons, startButtons;
        if (s === undefined) {
            let text:string, cn:string;
            switch (state) {
                default:
                    text = '不认识的单据状态\'' + state + '\'';
                    cn = 'text-info';
                    break;
                case '-': 
                    text = '已作废';
                    cn = 'text-danger';
                    break;
                case '#':
                    text = '已归档';
                    cn = 'text-success';
                    break;
            }
            actionButtons = <div className={classNames(cn)}>[{text}]</div>;
        }
        else {
            actionButtons = <div className="flex-grow-1">{s.actions.map((v,index) => 
                <button
                    key={index}
                    className="btn btn-primary mr-2"
                    onClick={()=>this.actionClick(v)}
                >
                    {this.controller.getActionLabel(state, v.name)}
                </button>)}
            </div>;
            if (state === '$') {
                startButtons = <div>
                    <button className="btn btn-outline-info ml-2" onClick={this.editClick}>修改</button>
                    <button className="btn btn-outline-danger ml-2" onClick={this.deleteClick}>作废</button>
                </div>
            }
        };
        return <Page header={this.label + ':' + stateLabel + '-' + no}>
            <div className="mb-2">
                <div className="d-flex px-3 py-2 border-bottom bg-light">
                    {actionButtons}
                    {startButtons}
                </div>
                <this.sheetView />
            </div>
        </Page>;
    }

    private acted = () => {
        let {discription} = this.sheetData.brief;
        return <Page header="已处理" back="close">
            <div className="p-3 d-flex flex-column align-items-center">
                <div className="p-3">{discription}</div>
                <div className="text-success"><FA name="check-circle-o" /> 单据已处理！</div>
                <div className="p-3">
                    <button className="btn btn-outline-info" onClick={()=>this.backPage()}>返回</button>
                </div>
            </div>
        </Page>
    }
}
