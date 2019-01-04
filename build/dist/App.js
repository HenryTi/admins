var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, NavView } from 'tonva-tools';
import { CAdmin } from './Admin';
import './App.css';
class App extends React.Component {
    onLogined() {
        return __awaiter(this, void 0, void 0, function* () {
            nav.clear();
            //nav.push(<StartPage />);
            let cAdmin = new CAdmin({});
            yield cAdmin.start();
        });
    }
    render() {
        return (React.createElement(NavView, { onLogined: this.onLogined }));
    }
}
export default App;
//# sourceMappingURL=App.js.map