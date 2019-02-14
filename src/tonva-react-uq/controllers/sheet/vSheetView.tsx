import * as React from 'react';
import {List, Muted, LMR, EasyDate, FA} from 'tonva-react-form';
import { Sheet } from '../../entities';
import { VForm } from '../form';
import { VEntity } from '../CVEntity';
import { CSheet, SheetUI, SheetData } from './cSheet';

const leftFlowStyle = {width: '8rem'};

export abstract class VSheetView extends VEntity<Sheet, SheetUI, CSheet> {
    protected vForm: VForm;
    protected sheetData: SheetData;
    //data: any;
    //state: string;
    //flows:any[];

    flowRow = (item:any, index:number):JSX.Element => {
        let {date, user, preState, state, action} = item;
        if (action === undefined) action = <><FA className="text-primary" name="pencil-square-o" /> 制单</>;
        let to;
        switch (state) {
            case '$': break;
            case '#': to = <><FA className="text-success" name="file-archive-o" /></>; break;
            default: to = <><FA className="text-muted" name="arrow-right" /> &nbsp; {state}</>; break;
        }
        /*
        return <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm"><div className="p-2">{to}</div></div>
            <div className="col-sm text-right"><div className="p-2"><Muted><EasyDate date={date} /></Muted></div></div>
        </div>;
        */
        return <LMR 
            left={<div className="pl-3 py-2" style={leftFlowStyle}>{action}</div>}
            right={<div className="p-2"><Muted><EasyDate date={date} /></Muted></div>}>
            <div className="p-2">{to}</div>
        </LMR>;
    }

    protected sheetView = () => {
        let {brief, flows} = this.sheetData;
        let removed;
        if (brief.state === '-')
            removed = <div className="mx-3 my-2" style={{color:'red'}}>本单据作废</div>;
        return <div>
            {removed}
            {this.vForm.render()}
    
            <List header={<Muted className="mx-3 my-1">流程</Muted>}
                items={flows}
                item={{render:this.flowRow}}/>
        </div>;
    };
}
