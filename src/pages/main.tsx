import * as React from 'react';
import {observer} from 'mobx-react';
import {nav, NavView, Page, Action, DropdownActions, ListView, ListItem} from 'tonva-tools';
import {devData} from './devData';
import testApi from './testApi';

const unitId = process.env.REACT_APP_DEBUG_UNITID;

@observer
export default class MainPage extends React.Component {
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
    async componentDidMount() {
        let ret = await testApi.v({unit:11, start:0});
        devData.apiList = ret;
    }
    async click() {
      try {
        let ret = await testApi.v({unit:11, start:0});
        console.log(ret);
        alert(JSON.stringify(ret));
      }
      catch (e) {
        //alert('error: ' + JSON.stringify(e));
        console.error(e);
      }
    }

    renderRow(item: any, index: number):JSX.Element {
        return <li>{JSON.stringify(item)}</li>;
    }
    converter(item:any):ListItem {
        return {
            key: item.id,
            date: item.date_update,
            icon: undefined,
            main: item.name,
            vice: item.discription,
            right: item.unitName,
            unread: 0,         // <0 表示red dot
        };
    }
    itemClick(item:any) {
        alert(JSON.stringify(item));
    }
    render() {
      //let right = <DropdownActions actions={this.actions} />;
      return <Page header='开发管理' debugLogout={true}>
        Admins
        <button onClick={this.click}>test</button>
        <ListView items={devData.apiList} converter={this.converter} itemClick={this.itemClick} />
      </Page>;
    }
  }
  