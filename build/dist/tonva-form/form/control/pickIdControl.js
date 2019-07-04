var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observable } from 'mobx';
import { Control } from './control';
export class PickIdControl extends Control {
    constructor() {
        super(...arguments);
        this.onClick = () => __awaiter(this, void 0, void 0, function* () {
            let { pick, fromPicked } = this.face;
            let item = yield pick(this.face, this.formView.props, this.formView.readValues());
            if (item === undefined) {
                this.value = undefined;
                return;
            }
            if (fromPicked === undefined) {
                this.value = item.id;
                return;
            }
            let { id, caption } = fromPicked(item);
            this.value = id;
            this.caption = caption;
        });
        this.onPicked = (value) => {
            this.value = value.id;
        };
    }
    setInitValues(values) {
        let v = values[this.field.name];
        this.value = v;
    }
    controlContent() {
        let { itemFromId, fromPicked, initCaption } = this.face;
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
                    if (ret !== undefined)
                        return ret.caption;
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
    renderControl() {
        let { tuid, input } = this.face;
        if (input === undefined) {
            //return <div>no input on idpick</div>;
            return React.createElement("div", { className: "form-control-plaintext px-2 border text-primary rounded cursor-pointer", onClick: this.onClick }, this.controlContent());
        }
        return React.createElement("div", { className: "form-control-static " },
            React.createElement(input.component, { id: this.value, ui: tuid }));
    }
}
__decorate([
    observable
], PickIdControl.prototype, "caption", void 0);
//# sourceMappingURL=pickIdControl.js.map