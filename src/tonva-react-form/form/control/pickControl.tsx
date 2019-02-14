import * as React from 'react';
import {observable} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face, PickFace} from '../face';
import {Control} from './control';
import { observer } from 'mobx-react';

export class PickControl extends Control {
    protected face: PickFace;
    @observable private caption: string|JSX.Element;

    private onClick = async () => {
        let {pick, fromPicked} = this.face;
        let item = await pick(this.face, this.formView.props, this.formView.readValues());
        if (item === undefined) {
            this.value = undefined;
            return;
        }
        let {id, caption} = fromPicked(item);
        this.value = id;
        this.caption = caption;
    }
    setInitValues(values: any) {
        let v = values[this.field.name];
        this.value = v;
    }
    /*
    private controlContent():string|JSX.Element {
        let {content: Content} = this.face;
        if (this.value === undefined) {
            return '请选择';
        }
        
        if (this.caption !== undefined) {
            return this.caption;
        }
        return <Content id={this.value} />;
    }*/
    /*
    private buildContent():string|JSX.Element {
        let {tuid, input} = this.face;
        if (input === undefined) {
            //return <div>no input on idpick</div>;
            return <div onClick={this.onClick}>{this.controlContent()}</div>;
        }
        return <input.component id={this.value} 
            tuid={tuid}
            input={input}
            entitiesUI={this.formView.props.context} 
            params={this.formView.readValues()}
            onPicked={this.onPicked} />;
    }*/
    renderControl():JSX.Element {
        return <this.view />;
        /*
        let {content:Content} = this.face;
        //if (this.value === undefined) {
            //return <div>no input on idpick</div>;
        //}
        //return <div className="form-control-static ">
        //    <Content />
        //</div>;
        */
    }

    private view = observer(() => {
        let content;
        let {content: Content} = this.face;
        if (this.value === undefined || this.value === null) {
            content = '请选择';
        }
        /*
        else if (this.caption !== undefined) {
            content = this.caption;
        }*/
        else {
            content = <Content id={this.value} />;
        } 
        return <div
            className="form-control-plaintext px-2 border text-primary rounded cursor-pointer bg-light"
            onClick={this.onClick}>
            {content}
        </div>
    });
}
