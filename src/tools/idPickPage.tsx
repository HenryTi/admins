import * as React from 'react';
import { nav, Page } from 'tonva';
import { SearchBox, List } from 'tonva';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export interface IdPickPageProps {
    caption: string;
    searchPlaceHolder?: string;
    candidateItems: ((params:any, key:string) => Promise<any[]>) | any[];
    moreCandidates: () => Promise<void>;
    row: (item:any, index:number) => JSX.Element;
    idFromItem: (item:any) => number;
    resolve: (item?: any) => void;
    params: any;
}

@observer
export class IdPickPage extends React.Component<IdPickPageProps> {
    @observable private items:any[];

    async componentDidMount() {
        let {candidateItems, params} = this.props;
        this.items = Array.isArray(candidateItems)? 
            candidateItems 
            : await candidateItems(params, '');
    }
    private itemClick = (item:any):Promise<void> => {
        let {resolve, idFromItem} = this.props;
        resolve(idFromItem(item));
        nav.pop();
        return;
    }
    private onSearch = async (key: string):Promise<void> => {
        let {candidateItems, params} = this.props;
        if (typeof candidateItems === 'function') {
            let ret = await candidateItems(params, key);
            this.items = ret;
        }
        return;
    }
    render() {
        let {caption, row, searchPlaceHolder} = this.props;
        return <Page header={caption} back="close">
            <div className="container">
                <SearchBox className="my-2" 
                    onSearch={this.onSearch} 
                    placeholder={searchPlaceHolder}
                    maxLength={100} />
            </div>
            <List items={this.items} item={{onClick:this.itemClick, render:row}} />
        </Page>
    }
}
