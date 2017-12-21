import * as React from 'react';
import {Page} from 'tonva-tools';
import {List, ListProps} from 'tonva-react-form';

interface Item {
    text: string;
}
export default class  TestTonvaMultiForm extends React.Component {
    private listProps:ListProps = {
        items: [
            {text: "a1"},
            {text: "a2"},
        ],
        item: {
            contentClass: 'li-content',
            render: (item, index) => <React.Fragment>
                <div style={{padding:'8px 0', flex:1}}>{item.text}</div>
                <div style={{padding:'8px 0'}}>{item.text}</div>
            </React.Fragment>,
            /*
            onSelect: (item:any, selected:boolean, anySelected:boolean) => {
                alert(JSON.stringify(item) + ' ' + 
                    (selected?'selected':'unselected') + ' ' + 
                    (anySelected?'any selected':'nothing selected'));
            },*/
            onClick: (item:any) => {alert(JSON.stringify(item))}
        }
    };
    render() {
        return <Page header="Tonva List">
            <List {...this.listProps} />
        </Page>;
    }
}
