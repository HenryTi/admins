import * as React from 'react';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import {IdPick, IdPickFace} from 'tonva-react-form';

export interface IdPickProps {
    caption: string;
    items: (() => Promise<any[]>) | any[];
    itemRender?: (item:any, index:number, ex?:any) => JSX.Element;
    itemConverter?: (item:any) => ListItem;
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
        let {caption, itemRender, itemConverter} = this.props;
        return <Page header={caption}>
            <ListView items={this.state.items} itemClick={this.itemClick} renderRow={itemRender} converter={itemConverter} />
        </Page>
    }
}
