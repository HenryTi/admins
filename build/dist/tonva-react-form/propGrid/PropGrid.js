var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { PropView } from './propView';
let PropGrid = class PropGrid extends React.Component {
    /*
        private propView: PropView;
        constructor(props:PropGridProps) {
            super(props);
        }
    */
    /*
        componentWillMount() {
            this.propView = new PropView(this.props.rows);
            this.propView.setValues(this.props.values);
        }
    
        componentWillReceiveProps(nextProps: Readonly<PropGridProps>, nextContext: any) {
            this.propView = new PropView(this.props.rows);
            this.propView.setValues(nextProps.values);
            this.forceUpdate();
        }
    */
    render() {
        let { className, rows, values } = this.props;
        let propView = new PropView(this.props, rows);
        propView.setValues(values);
        let cn = classNames('container-fluid', className);
        return React.createElement("div", { className: cn }, propView.render());
    }
};
PropGrid = __decorate([
    observer
], PropGrid);
export { PropGrid };
//# sourceMappingURL=PropGrid.js.map