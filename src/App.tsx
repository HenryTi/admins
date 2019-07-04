import * as React from 'react';
import { nav, NavView } from 'tonva';
import { CAdmin } from './Admin';
import './App.css';

class App extends React.Component {
    async onLogined() {
        let loc = document.location;
        nav.clear();
        //nav.push(<StartPage />);
        let cAdmin = new CAdmin({});
        await cAdmin.start();
    }
    render() {
        return (
            <NavView onLogined={this.onLogined} />
        )
    }
}

export default App;
