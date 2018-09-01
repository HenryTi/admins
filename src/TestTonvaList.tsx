import * as React from 'react';
import {Page} from 'tonva-tools';
import {List, ListProps, LMR, Badge, FA, StackedFA} from 'tonva-react-form';
import {appIcon, appItemIcon} from './consts';

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
            render: (item, index) => (index===0?
            <LMR className="py-1 px-2 align-items-stretch"
                left={<Badge badge={1}><img src={appIcon} /></Badge>}
                right={<small className="d-block align-self-end">KK</small>}
            >
                <div><h6>ddd</h6><div>{item.text}</div></div>
            </LMR> :
            <LMR className="py-1 px-2 align-items-center"
                left={<Badge badge={2} size="sm"><StackedFA size="lg">
                        <FA name="square-o" className="fa-stack-2x text-primary" />
                        <FA name="twitter" className="fa-stack-1x text-success"  />
                    </StackedFA></Badge>}
                right={<small><FA name="chevron-right" /></small>}
            >
                {item.text}
            </LMR>),
            //<div style={{padding:'8px 0', flex:1}}>{item.text}</div>
            //    <div style={{padding:'8px 0'}}>{item.text}</div>
            //</div>,
            
            onSelect: (item:any, selected:boolean, anySelected:boolean) => {
                alert(JSON.stringify(item) + ' ' + 
                    (selected?'selected':'unselected') + ' ' + 
                    (anySelected?'any selected':'nothing selected'));
            },
            //onClick: (item:any) => {alert(JSON.stringify(item))}
        }
    };
    render() {
        return <Page header="Tonva List">
            <List {...this.listProps} />
        </Page>;
    }
}
