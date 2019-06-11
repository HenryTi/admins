import * as React from 'react';
import { Schema, UiSchema, ItemSchema, UiItem, UiTextItem } from '../schema';
import { nav } from '../nav';
import { Page } from '../page';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Rule, FieldRule } from '../form/rules';

export abstract class ItemEdit {
    protected name: string;
    protected itemSchema: ItemSchema;
    protected uiItem:UiItem;
    protected value: any;
    protected label: string;

    @observable protected error: string;
    @observable protected isChanged: boolean = false;
    protected newValue: any;

    constructor(itemSchema: ItemSchema, uiItem:UiItem, label:string, value: any) {
        this.itemSchema = itemSchema;
        this.uiItem = uiItem
        this.value = value;
        let {name} = itemSchema;
        this.name = name;
        this.label = label;
    }
    async start():Promise<any> {
        return await this.internalStart();
    }

    protected abstract internalStart():Promise<any>;

    async end():Promise<any> {
        await this.internalEnd()
    }

    protected async internalEnd():Promise<void> {nav.pop()}

    protected verifyValue() {
        if (this.uiItem === undefined) return;
        let {rules} = this.uiItem;
        if (rules === undefined) return;
        let nv = this.newValue;
        function verifyRule(rule:FieldRule, value: any):string {
            let error = rule(nv);
            if (error !== undefined) {
                if (typeof error !== 'object')
                    return error;
                else
                    return JSON.stringify(error);
            }
        }
        if (Array.isArray(rules)) {
            for (let rule of rules) {
                let error = verifyRule(rule as FieldRule, nv);
                if (error !== undefined) {
                    this.error = error;
                    break;
                }
            }
        }
        else {
            this.error = verifyRule(rules as FieldRule, nv);
        }
    }
}
