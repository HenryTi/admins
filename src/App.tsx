import * as React from 'react';
import {NavView, Page} from 'tonva-tools';
import testApi from './testApi';
import './App.css';

//const logo = require('./logo.svg');

class MainView extends React.Component {
  async click() {
    let ret = await testApi.v({});
  }
  render() {
    return <Page header='admins'>
      Admins
      <button onClick={this.click}>test</button>
    </Page>;
  }
}

class App extends React.Component {
  render() {
    let env = process.env.NODE_ENV;
    console.log('env:%s REACT_APP_APIHOST:%s', env, process.env.REACT_APP_APIHOST);
    return (
      <NavView view={<MainView />} />
    );
  }
}

export default App;
