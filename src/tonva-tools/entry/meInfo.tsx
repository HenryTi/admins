import * as React from 'react';
import { observable } from 'mobx';
import { VPage, Page, Form, ItemSchema, UiSchema, StringSchema, UiTextItem, UiPasswordItem, ButtonSchema, Edit, ImageSchema, nav, UiImageItem } from '../ui';
import userApi from './userApi';

export class EditMeInfo extends React.Component {
    private schema:ItemSchema[] = [
        {name:'nick', type:'string'} as StringSchema,
        {name:'icon', type:'image'} as ImageSchema
    ];
    private uiSchema:UiSchema = {
        items: {
            nick: {widget:'text', label:'别名', placeholder:'好的别名更方便记忆'} as UiTextItem,
            icon: {widget:'image', label:'头像'} as UiImageItem,
        }
    }
    @observable private data:any;

    constructor(props:any) {
        super(props);
        let {nick, icon} = nav.user;
        this.data = {
            nick: nick,
            icon: icon,
        }
    }

    private onItemChanged = async (itemSchema:ItemSchema, newValue:any, preValue:any) => {
        let {name} = itemSchema;
        await userApi.userSetProp(name, newValue);
        this.data[name] = newValue;
        nav.user[name] = newValue;
        nav.saveLocalUser();
    }

    render() {
        return <Page header="个人信息">
            <Edit schema={this.schema} uiSchema={this.uiSchema}
                data={this.data}
                onItemChanged={this.onItemChanged} />
        </Page>;
    }
}
