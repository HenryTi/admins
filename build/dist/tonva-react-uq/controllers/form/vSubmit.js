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
import { ViewModel } from "./viewModel";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
export class VSubmit extends ViewModel {
    constructor(vForm) {
        super();
        this.onClickSubmit = () => __awaiter(this, void 0, void 0, function* () {
            this.vForm.submit();
        });
        this.view = observer(() => {
            let { isOk } = this.vForm;
            return React.createElement("button", { type: "button", onClick: this.onClickSubmit, className: this.className, disabled: isOk === false }, this.caption);
        });
        this.vForm = vForm;
        this.caption = this.vForm.submitCaption;
        this.className = 'btn btn-primary w-25';
    }
}
__decorate([
    observable
], VSubmit.prototype, "caption", void 0);
__decorate([
    observable
], VSubmit.prototype, "className", void 0);
//# sourceMappingURL=vSubmit.js.map