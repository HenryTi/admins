import * as React from 'react';
import {nav, NavView, Page, Action, DropdownActions, meInFrame} from 'tonva-tools';
//import {StartPage} from './Admin';
import { CrAdmin } from './Admin';
import './App.css';

class App extends React.Component {
    async onLogined() {
        nav.clear();
        //nav.push(<StartPage />);
        let crAdmin = new CrAdmin();
        await crAdmin.start();
    }
    render() {
        return (
            <NavView onLogined={this.onLogined} />
        )
    }
}

export default App;
