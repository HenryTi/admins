import * as React from 'react';
import { Muted } from 'tonva-react-form';
import { left0 } from 'tonva-tools';
import { VMapMain, MapUI, Field, CMap }  from 'tonva-react-usql'; 

class CMapTeamPerson extends CMap {
    async searchOnKey(keyField:Field, param):Promise<number> {
        switch (keyField.name) {
            default: return await super.searchOnKey(keyField, param);
            case 'post': return await this.searchOnPost(param);                
        }
    }

    private async searchOnPost(param: any):Promise<number> {
        let querySelect = this.cQuerySelect('teamPosts');
        let val = await querySelect.call(param);
        return val['post'].id;
    }
}

class VMapTeamPerson extends VMapMain {
}

const ui:MapUI = {
    CMap: CMapTeamPerson,
    keys: [
        {
            content: ({name, id}:any, x:any) => <><Muted>{x.team} &nbsp; </Muted> {name}</>,
            none: (x:any)=>x.noStaff,
        },
        {
            content: ({name, id}:any, x:any) => <><Muted>{x.staff} &nbsp; </Muted> {name} &nbsp; <Muted>{x.no} {left0(id, 4)}</Muted></>,
            none: (x:any)=>x.noPost,
        },
        {
            content: ({title, id}:any, x:any) => <><Muted>{x.post} &nbsp; </Muted> {title}</>,
            none: undefined,
        },
    ]
}

export default ui;
