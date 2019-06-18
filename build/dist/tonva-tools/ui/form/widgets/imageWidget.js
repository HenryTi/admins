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
import classNames from 'classnames';
import { Widget } from './widget';
import { Image } from '../../image';
import { ImageItemEdit } from '../../edit/imageItemEdit';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
export class ImageWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onClick = () => __awaiter(this, void 0, void 0, function* () {
            let edit = new ImageItemEdit(this.itemSchema, this.ui, this.ui.label, this.value);
            let ret = yield edit.start();
            if (ret !== null) {
                this.setValue(ret);
                this.imageSrc = ret;
            }
            yield edit.end();
        });
        this.observerRender = observer(() => {
            let cn = [
                'bg-white p-1 d-flex justify-content-center',
            ];
            let onClick;
            if (!this.readOnly && !this.disabled) {
                cn.push('cursor-pointer');
                onClick = this.onClick;
            }
            return React.createElement("div", { className: classNames(cn), onClick: onClick },
                React.createElement(Image, { src: this.imageSrc, className: "w-4c h-4c" }));
        });
    }
    init() {
        super.init();
        this.imageSrc = this.value;
    }
    render() {
        return React.createElement(this.observerRender, null);
    }
}
__decorate([
    observable
], ImageWidget.prototype, "imageSrc", void 0);
//# sourceMappingURL=imageWidget.js.map