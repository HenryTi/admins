var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observable } from 'mobx';
import { Control } from './control';
export class PickTuidControl extends Control {
    constructor(formView, field, face) {
        super(formView, field, face);
        this.onIdChanged = this.onIdChanged.bind(this);
        //this.onClick = this.onClick.bind(this);
    }
    /*
    private async onClick() {
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
    }*/
    onIdChanged(id) {
        this.value = id.id;
    }
    setInitValues(values) {
        let v = values[this.field.name];
        this.value = v;
    }
    buildContent() {
        //let {tuid, input} = this.face;
        return React.createElement(this.face.input.component, Object.assign({}, this.face, { id: this.value, 
            //ui={this.face.ui}
            //input={input}
            //entitiesUI={this.formView.props.context} 
            onFormValues: () => this.formView.readValues(), onIdChanged: this.onIdChanged }));
    }
    renderControl() {
        return React.createElement("div", { className: "form-control-static " }, this.buildContent());
    }
}
__decorate([
    observable
], PickTuidControl.prototype, "caption", void 0);
/*
<button className="form-control btn btn-outline-info"
type="button"
style={{textAlign:'left', paddingLeft:'0.75rem'}}
onClick={this.onClick}>
{this.buildContent()}
</button>
*/ 
//# sourceMappingURL=pickTuidControl.js.map