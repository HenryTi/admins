import * as React from 'react';
import {nav, Page, ListView, ListItem} from 'tonva-tools';
import {IdPick, IdPickFace, IdPickResult} from 'tonva-react-form';

export interface IdPickProps {
    title: string;
    items: (() => Promise<any[]>) | any[];
    itemRender?: (item:any, index:number, ex?:any) => JSX.Element;
    itemConverter?: (item:any) => ListItem;
    result?: (item:any) => IdPickResult;
}

export function createIdPick(props: IdPickProps):IdPick {
    return function(face: IdPickFace):Promise<IdPickResult> {
        return new Promise<IdPickResult>((resolve, reject) => {
            nav.push(<IdPickPage resolve={resolve} face={face} {...props} />);
        });
    }
}

interface IdPickPageProps extends IdPickProps {
    face: IdPickFace;
    resolve: (value?: IdPickResult) => void;
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
        let {resolve, result} = this.props;
        resolve(
            result === undefined?
                {id: 3, element: '3号商品'} :
                result(item)
        );
        nav.pop();
    }
    render() {
        let {title, itemRender, itemConverter} = this.props;
        return <Page header={title}>
            <ListView items={this.state.items} itemClick={this.itemClick} renderRow={itemRender} converter={itemConverter} />
        </Page>
    }
}
