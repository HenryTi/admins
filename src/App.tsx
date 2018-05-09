import * as React from 'react';
import {nav, NavView, Page, Action, DropdownActions, meInFrame} from 'tonva-tools';
import AdminPage from './Admin';
import {StartPage} from './Admin';
import './App.css';

import TestTonvaForm from './TestTonvaReactForm';
import TestTonvaMultiStep from './TestTonvaMultiStep';
import TestTonvaList from './TestTonvaList';

class App extends React.Component {
    render() {
        //let env = process.env.NODE_ENV;
        //console.log('env:%s REACT_APP_APIHOST:%s', env, process.env.REACT_APP_APIHOST);
        return (
            <NavView view={<StartPage />} />
            // <NavView view={<TestTonvaForm />} />
            // <NavView view={<TestTonvaMultiStep />} />
            // <NavView view={<TestTonvaList />} />
        )
    }
}

export default App;
