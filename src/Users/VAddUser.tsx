import * as React from 'react';
import { VPage, Page, Image, nav } from 'tonva';
import { UsersController, User } from './cUsers';
import { SearchBox } from 'tonva';
import { mainApi } from 'api';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export class VAddUser extends VPage<UsersController> {
    @observable private user: User = null;
    //@observable private addedUser: User;
    private searchBox: SearchBox;
    async open() {
        this.openPage(this.page);
    }

    private page = observer(():JSX.Element => {
        let searchBox = <SearchBox ref={v=>this.searchBox=v}
            className="w-100"
            onSearch={this.onSearch}
            onFocus={this.onSearchFocus}
            placeholder="用户全名/手机号/邮箱"
             />;
        let content:any;
        if (this.user === null) {
        }
        else if (this.user === undefined) {
            content = <div className="text-info p-3">没有找到用户</div>;
        }
        else {
            let {name, nick, icon} = this.user;
            let divUser:any;
            if (nick) {
                divUser = <><div><b>{nick}</b></div><div>{name}</div></>;
            }
            else {
                divUser = <div><b>{name}</b></div>;
            }
            content = <div>
                <div className="m-3 p-3 d-flex bg-white">
                    <Image src={icon} />
                    <div className="ml-3">{divUser}</div>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success text-center" onClick={this.onAddUser}>增加用户</button>
                </div>
            </div>;
        }
        /*
        let divUserAdded:any;
        if (this.addedUser) {
            divUserAdded = <div className="p-3">
                <div>
                    新增用户: {this.addedUser.name} &nbsp; &nbsp; 
                    <button className="btn btn-success" 
                        onClick={()=>this.controller.onUserEditApps()}>
                        为用户添加App
                    </button>
                </div>
            </div>
        }
        */
        return <Page header={searchBox}>
            {content}
        </Page>;
    })
    //{divUserAdded}

    private onSearch = async (key:string) => {
        this.user = await mainApi.userFromKey(key);
    }

    private onAddUser = async () => {
        await this.controller.addUser(this.user.id);
        this.controller.curUser = this.user;
        this.user = null;
        this.searchBox.clear();
        this.replacePage(this.addedPage);
    }

    private onSearchFocus = () => {
        this.user = null;
        //this.addedUser = null;
        if (this.searchBox) this.searchBox.clear();
    }

    private onAddApps = () => {
        this.closePage();
        this.controller.onUserEditApps();
    }

    private onContinueAddUser = () => {
        this.closePage();
        this.controller.onAddUser();
    }

    private addedPage = () => {
        return <Page header="添加成功">
            <div className="p-3 text-center">
                <div>
                    新增用户: {this.controller.curUser.name}
                </div>
                <div className="mt-3">
                    <button className="btn btn-success mr-3" 
                        onClick={this.onAddApps}>
                        为用户添加App
                    </button>
                    <button className="btn btn-outline-primary"
                        onClick={this.onContinueAddUser}>
                        继续添加新用户
                    </button>
                </div>
            </div>
        </Page>
    }
}
