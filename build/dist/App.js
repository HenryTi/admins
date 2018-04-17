import * as React from 'react';
import { NavView } from 'tonva-tools';
import AdminPage from './Admin';
import './App.css';
class App extends React.Component {
    render() {
        //let env = process.env.NODE_ENV;
        //console.log('env:%s REACT_APP_APIHOST:%s', env, process.env.REACT_APP_APIHOST);
        return (React.createElement(NavView, { view: React.createElement(AdminPage, null) })
        // <NavView view={<TestTonvaForm />} />
        // <NavView view={<TestTonvaMultiStep />} />
        // <NavView view={<TestTonvaList />} />
        );
    }
}
export default App;
//# sourceMappingURL=App.js.map