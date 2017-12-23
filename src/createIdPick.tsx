import * as React from 'react';
import {nav, Page} from 'tonva-tools';
import {IdPick, IdPickFace, List, SearchBox} from 'tonva-react-form';
import {DevModel} from './model';

export interface IdPickProps {
    caption: string;
    searchPlaceHolder?: string;
    candidateItems: ((params:any, key:string) => Promise<any[]>) | any[];
    moreCandidates: () => Promise<void>;
    row: (item:any, index:number) => JSX.Element;
}

export function createIdPick(props: IdPickProps):IdPick {
    return function(face: IdPickFace, params: any):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            nav.push(<IdPickPage resolve={resolve} face={face} params={params} {...props} />);
        });
    }
}

interface IdPickPageProps extends IdPickProps {
    face: IdPickFace;
    resolve: (item?: any) => void;
    params: any;
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
        let {face, candidateItems, params} = this.props;
        this.setState({
            items: Array.isArray(candidateItems)? candidateItems : await candidateItems(params, ''),
        });
    }
    itemClick(item:any) {
        let {resolve} = this.props;
        resolve(item);
        nav.pop();
    }
    onSearch(key: string) {
        alert('search ' + key);
    }
    render() {
        let {caption, row, searchPlaceHolder} = this.props;
        return <Page header={caption} close={true}>
            <div className="container">
                <SearchBox className="my-2" 
                    onSearch={this.onSearch} 
                    placeholder={searchPlaceHolder}
                    maxLength={100} />
            </div>
            <List items={this.state.items} item={{onClick:this.itemClick, render:row}} />
        </Page>
    }
}
