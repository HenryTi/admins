import * as React from 'react';
import {nav, Page} from 'tonva-tools';
import {IdPick, IdPickFace, List} from 'tonva-react-form';

export interface IdPickProps {
    caption: string;
    items: (() => Promise<any[]>) | any[];
    //itemRender?: (item:any, index:number, ex?:any) => JSX.Element;
    //itemConverter?: (item:any) => ListItem;
    row: (item:any, index:number) => JSX.Element;
}

export function createIdPick(props: IdPickProps):IdPick {
    return function(face: IdPickFace):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            nav.push(<IdPickPage resolve={resolve} face={face} {...props} />);
        });
    }
}

interface IdPickPageProps extends IdPickProps {
    face: IdPickFace;
    resolve: (item?: any) => void;
}
interface IdPickPageState {
    items?: any[];
}

class IdPickPage extends React.Component<IdPickPageProps, IdPickPageState> {
    constructor(props) {
        super(props);
        this.state = {
            items: undefined,
        }
        this.itemClick = this.itemClick.bind(this);
    }
    async componentDidMount() {
        let {items} = this.props;
        this.setState({
            items: Array.isArray(items)? items : await items(),
        });
    }
    itemClick(item:any) {
        let {resolve} = this.props;
        resolve(item);
        nav.pop();
    }
    render() {
        let {caption, row} = this.props;
        return <Page header={caption}>
            <List items={this.state.items} item={{onClick:this.itemClick, render:row}} />
        </Page>
    }
}
