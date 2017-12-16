import * as React from 'react';
import {nav, NavView, Page, Action, DropdownActions} from 'tonva-tools';
import AdminPage from './Admin';
import './App.css';

import TestTonvaForm from './TestTonvaReactForm';

class App extends React.Component {
  render() {
    let env = process.env.NODE_ENV;
    console.log('env:%s REACT_APP_APIHOST:%s', env, process.env.REACT_APP_APIHOST);
    return (
      <NavView view={<AdminPage />} />
      // <NavView view={<TestTonvaForm />} />
    );
  }
}

export default App;
