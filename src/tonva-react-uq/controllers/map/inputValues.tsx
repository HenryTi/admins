import * as React from 'react';
import { VEntity } from "../CVEntity";
import { MapUI, CMap } from "./cMap";
import { Map } from "../../entities";
import { Page } from "tonva-tools";
import { VForm } from '../form';

export class VInputValues extends VEntity<Map, MapUI, CMap> {
    private vForm: VForm;

    async open(param?:any) {
        this.vForm = this.createForm(this.onValuesSubmit);
        this.openPageElement(<this.view />);
    }

    private onValuesSubmit = async () => {
        this.ceasePage();
        let values = this.vForm.getValues();
        this.returnCall(values);
    }

    private view = () => {
        return <Page>
            {this.vForm.render()}
        </Page>
    }
}
