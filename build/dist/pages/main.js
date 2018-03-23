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
import { Page, ListView } from 'tonva-tools';
import { devData } from './devData';
import testApi from './testApi';
const unitId = process.env.REACT_APP_DEBUG_UNITID;
let MainPage = class MainPage extends React.Component {
    /*
    private actions:Action[] = [
      {
        caption: '退出登录',
        action: this.logout,
      }
    ];
    logout() {
      nav.logout();
    }*/
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield testApi.v({ unit: 11, start: 0 });
            devData.apiList = ret;
        });
    }
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ret = yield testApi.v({ unit: 11, start: 0 });
                console.log(ret);
                alert(JSON.stringify(ret));
            }
            catch (e) {
                //alert('error: ' + JSON.stringify(e));
                console.error(e);
            }
        });
    }
    renderRow(item, index) {
        return React.createElement("li", null, JSON.stringify(item));
    }
    converter(item) {
        return {
            key: item.id,
            date: item.date_update,
            icon: undefined,
            main: item.name,
            vice: item.discription,
            right: item.unitName,
            unread: 0,
        };
    }
    itemClick(item) {
        alert(JSON.stringify(item));
    }
    render() {
        //let right = <DropdownActions actions={this.actions} />;
        return React.createElement(Page, { header: '开发管理', debugLogout: true },
            "Admins",
            React.createElement("button", { onClick: this.click }, "test"),
            React.createElement(ListView, { items: devData.apiList, converter: this.converter, itemClick: this.itemClick }));
    }
};
MainPage = __decorate([
    observer
], MainPage);
export default MainPage;
//# sourceMappingURL=main.js.map