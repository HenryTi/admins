/*
import * as React from 'react';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button} from 'reactstra p';
import {Page} from '../page';
import {ValidForm1} from './validForm';
import {FormSchema} from './formSchema';

export interface MenuItem {
    caption: string;
    action: () => void;
}

export interface FormPageProps {
    back?: 'back' | 'close' | 'none';
    header?: boolean | string | JSX.Element;
    rightMenu?: MenuItem[];
    footer?: JSX.Element;
    formSchema: FormSchema;
}

export interface FormPageState {
    dropdownOpen: boolean;
}

export class FormPage1 extends React.Component<FormPageProps, FormPageState> {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    
    renderMenu(menuItems: MenuItem[]) {
        if (menuItems === undefined) return null;
        return <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret={true} size='sm'>+</DropdownToggle>
            <DropdownMenu right={true}>
                {menuItems.map((v,index) => {
                    return <DropdownItem key={index} onClick={v.action}>{v.caption}</DropdownItem>
                })}
            </DropdownMenu>
        </ButtonDropdown>
    }
    render() {
        let {back, header, rightMenu, footer, formSchema, children} = this.props;
        return <Page header={header} back={back} right={this.renderMenu(rightMenu)} footer={footer}>
            <ValidForm1 formSchema={formSchema} children={children} />
        </Page>;
    }
}
*/