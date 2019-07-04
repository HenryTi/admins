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
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ResUploader } from '../resUploader';
import { Image } from '../image';
import { nav } from '../nav';
import { Page } from '../page';
import { ItemEdit } from './itemEdit';
export class ImageItemEdit extends ItemEdit {
    constructor() {
        super(...arguments);
        this.overSize = false;
        this.upload = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.resUploader)
                return;
            let ret = yield this.resUploader.upload();
            if (ret === null) {
                this.overSize = true;
                setTimeout(() => this.overSize = false, 3000);
                return;
            }
            this.resId = ret;
            this.isChanged = (this.resId != this.value);
        });
        this.page = observer((props) => {
            let { resolve } = props;
            let right = React.createElement("button", { className: "btn btn-sm btn-success", disabled: !this.isChanged, onClick: () => resolve(this.resId) }, "\u4FDD\u5B58");
            let overSize;
            if (this.overSize === true) {
                overSize = React.createElement("div", { className: "text-danger" },
                    React.createElement("i", { className: "fa fa-times-circle" }),
                    " \u56FE\u7247\u6587\u4EF6\u5927\u5C0F\u8D85\u8FC72M\uFF0C\u65E0\u6CD5\u4E0A\u4F20");
            }
            return React.createElement(Page, { header: '更改' + this.label, right: right },
                React.createElement("div", { className: "my-3 px-3 py-3 bg-white" },
                    React.createElement("div", null,
                        React.createElement("div", null, "\u4E0A\u4F20\u56FE\u7247\uFF1A"),
                        React.createElement("div", { className: "my-3" },
                            React.createElement(ResUploader, { ref: v => this.resUploader = v, multiple: false, maxSize: 2048 })),
                        React.createElement("div", null,
                            React.createElement("button", { className: "btn btn-primary", onClick: this.upload }, "\u4E0A\u4F20"))),
                    overSize,
                    React.createElement("div", { className: "small muted my-4" }, "\u652F\u6301JPG\u3001GIF\u3001PNG\u683C\u5F0F\u56FE\u7247\uFF0C\u4E0D\u8D85\u8FC72M\u3002"),
                    React.createElement("div", { className: "d-flex" },
                        React.createElement("div", { className: "w-12c h-12c mr-4", style: { border: '1px dotted gray', padding: '8px' } },
                            React.createElement(Image, { className: "w-100 h-100", src: this.resId })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "small" }, "\u56FE\u7247\u9884\u89C8"),
                            React.createElement(Image, { className: "w-4c h-4c mt-3", src: this.resId })))));
        });
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resId = this.value;
            return new Promise((resolve, reject) => {
                nav.push(React.createElement(this.page, { resolve: resolve, reject: reject }), () => reject());
            });
        });
    }
}
__decorate([
    observable
], ImageItemEdit.prototype, "resId", void 0);
__decorate([
    observable
], ImageItemEdit.prototype, "overSize", void 0);
//# sourceMappingURL=imageItemEdit.js.map