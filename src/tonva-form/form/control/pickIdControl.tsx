import * as React from 'react';
import {observable} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face, IdPickFace} from '../face';
import {Control} from './control';

export class PickIdControl extends Control {
    protected face: IdPickFace;
    @observable private caption: string|JSX.Element;

    private onClick = async () => {
        let {pick, fromPicked} = this.face;
        let item = await pick(this.face, this.formView.props, this.formView.readValues());
        if (item === undefined) {
            this.value = undefined;
            return;
        }
        if (fromPicked === undefined) {
            this.value = item.id;
            return;
        }
        let {id, caption} = fromPicked(item);
        this.value = id;
        this.caption = caption;
    }
    onPicked = (value: any) => {
        this.value = value.id;
    }
    setInitValues(values: any) {
        let v = values[this.field.name];
        this.value = v;
    }
    private controlContent():string|JSX.Element {
        let {itemFromId, fromPicked, initCaption} = this.face;
        if (this.value === undefined) {
            return initCaption || '请选择Id';
        }
        if (this.caption !== undefined) {
            return this.caption;
        }
        if (itemFromId !== undefined) {
            if (fromPicked !== undefined) {
                let item = itemFromId(this.value);
                if (item) {
                    let ret = fromPicked(item);
                    if (ret !== undefined) return ret.caption;
                }
            }
        }
        return String(this.value);
    }
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
        let {tuid, input} = this.face;
        if (input === undefined) {
            //return <div>no input on idpick</div>;
            return <div className="form-control-plaintext px-2 border text-primary rounded cursor-pointer"
                onClick={this.onClick}>
                {this.controlContent()}
            </div>;
        }
        return <div className="form-control-static ">
            <input.component id={this.value} 
                ui={tuid}
                //input={input}
                //entitiesUI={this.formView.props.context} 
                //params={this.formView.readValues()}
                //onPicked={this.onPicked}
                />
        </div>;
    }
}
