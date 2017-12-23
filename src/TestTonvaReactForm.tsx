import * as React from 'react';
import {Page} from 'tonva-tools';
import consts from './consts';
import {Fields, FormRow, FormView, TonvaForm, IdPick, IdPickFace, PropGrid, Prop, 
    Media} from 'tonva-react-form';
import {createIdPick} from './createIdPick';

export default class  TestTonvaForm extends React.Component {
    private idPick = createIdPick({
        caption: '选择商品',
        candidateItems: [
            {id:1, main: 'dddd1', vice: 'bbb1'},
            {id:2, main: 'dddd2', vice: 'bbb2'},
            {id:3, main: 'dddd3', vice: 'bbb3'},
        ],
        moreCandidates: ():Promise<void> => {return},
        row: (item:any, index:number) => <div>{item.main + ' ' + item.vice}</div>,
    });
    private fields:Fields = {
        decA: {name:'decA', type:'dec', max:100, required:true },
        intA: {name:'intA', type:'int', min:10, max:100 },
        numberA: {name:'numberA', type:'number', min:10, max:100, required:true },
        a: {name:'a', type:'id', required:true },
        b: {name:'b', type:'string', maxLength: 10},
        c: {name:'c', type:'bool'},
    }
    private formRows:FormRow[] = [
        {label: 'decA', field:this.fields.decA},
        {label: 'xxx', help: <div key='r1'>dddd</div>},
        {label: 'intA', field:this.fields.intA},
        {label: 'numberA', field:this.fields.numberA},
        {label: 'labelA', field:this.fields.a, face:{
            type: 'pick-id', 
            initCaption: '请选择商品', 
            pick: this.idPick,
            fromItem: (item:any)=>{return {id: item.id, caption: item.main+' ' + item.vice}},
        }},
        {label: 'labelB', field:this.fields.b, face:{type:'input', placeholder:'kkk'}},
        {label: 'labelC', field:this.fields.c, face:{type:'select', list: [{text:'a mmm bbb', value:1}, {text:'b', value: 2}]}},
        {label: 'labelC', field:this.fields.c, face:{type:'radiobox', list: [
            {text:'a mmm bbb', value:1},
            {text:'b', value: 2},
            {text:'a mmm bbb', value:1},
            {text:'a mmm bbb', value:1},
            {text:'a mmm bbb', value:1},
            {text:'a mmm bbb', value:1},
            {text:'a mmm bbb', value:1},
            {text:'a mmm bbb', value:1},
        ]}},
        {label: undefined, field:this.fields.c, face:{type:'checkbox', label:'dDd'}},
        <div key='r2'>
            <p>as dfsaf sadf asdf </p>
            <ul>
                <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
                <li>a sdfasf asd fasfasf asfd as fasf asdf as df</li>
            </ul>
        </div>,
        {label: 'labelD', group: [{field:{name:'a', type:'string'}, face:{type:'checkbox'}}]}
    ];

    private formView:FormView = new FormView({
        formRows: this.formRows,
        onSubmit: this.onSubmit.bind(this),
        submitButton: <span><i className='fa fa-send' /> 提交</span>
    }, {decA: 22});

    private onSubmit(values:any) {
        alert(JSON.stringify(values));
    }

    private propValues = {
        icon: consts.appIcon,
        a: 1,
        b: 'dsdffasfasdf',
        c: 'dsfasfd',
        d: [
            {main: 'bbb'},
            {main: 'eee'},
        ]
    };

    private rows: Prop[] = [
        '',
        {type: 'component', component: <Media icon={this.propValues.icon} main={this.propValues.b} discription={this.propValues.c} />},
        '',
        {label: 'a-1', type: 'number', name: 'a'},
        '',
        {label: 'b-1', type: 'string', name: 'b', onClick: this.bClick.bind(this)},
        {label: 'c', type: 'string', name: 'c'},
        '',
        {label: 'd-List', type: 'list', list: 'd', row: ARow },
    ];

    bClick() {
        alert('b');
    }

    render() {
        return <Page header='Test Tonva Form'>
            <PropGrid rows={this.rows} values={this.propValues} />
        </Page>;
    }

    //<TonvaForm formView={this.formView} />
}

class ARow extends React.Component<any> {
    render() {
        return <div className='py-1'>{this.props.main}</div>;
    }
}
