(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{123:function(e,t,n){"use strict";n.r(t);var i=n(0),a=n(14),s=n(55);n(89);const r={_:{a:"d"}},o={_:{a:"d"}},c=n(90),l=i.createElement("div",{className:"d-flex align-items-center"},i.createElement("img",{className:"App-logo h-3c position-absolute",src:c}),i.createElement("div",{className:"h3 flex-fill text-center"},i.createElement("span",{className:"text-primary mr-3"},"\u540c"),i.createElement("span",{className:"text-danger"},"\u82b1"))),u=[{type:"mobile",caption:"\u624b\u673a\u53f7",regex:/^[0-9]*$/},{type:"email",caption:"\u90ae\u7bb1",regex:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/}];function m(e){return u.find(t=>!0===t.regex.test(e))}var h=n(46),d=n(3),p=function(e,t,n,i){return new(n||(n=Promise))(function(a,s){function r(e){try{c(i.next(e))}catch(t){s(t)}}function o(e){try{c(i.throw(e))}catch(t){s(t)}}function c(e){e.done?a(e.value):new n(function(t){t(e.value)}).then(r,o)}c((i=i.apply(e,t||[])).next())})};(function(e,t,n,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,n,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(r=(s<3?a(r):s>3?a(t,n,r):a(t,n))||r);s>3&&r&&Object.defineProperty(t,n,r)})([d.l],class extends h.a{constructor(){super(...arguments),this.buttonDisabled=!0,this.onClick=(()=>{let{onButtonClick:e}=this.context.form.props;void 0!==e&&e(this.name,this.context)})}onChange(e){this.buttonDisabled=0===e.target.value.trim().length}render(){return i.createElement(i.Fragment,null,i.createElement("div",{className:"input-group"},i.createElement("input",{ref:e=>this.input=e,className:"form-control",type:this.inputType,defaultValue:this.value,onChange:e=>this.onChange(e),placeholder:"\u624b\u673a\u53f7/\u90ae\u7bb1",readOnly:this.readOnly,disabled:this.disabled,onKeyDown:this.onKeyDown,onFocus:e=>this.onFocus(e),onBlur:e=>this.onBlur(e),maxLength:this.itemSchema.maxLength}),i.createElement("div",{className:"input-group-append"},i.createElement("button",{className:"btn btn-sm btn-outline-primary",type:"button",disabled:this.buttonDisabled,onClick:this.onClick},i.createElement("small",null,"\u53d1\u9001\u9a8c\u8bc1\u7801")))),this.renderErrors())}}.prototype,"buttonDisabled",void 0);class g extends a.Controller{constructor(){super(...arguments),this.accountPageCaption="\u8d26\u53f7\u5bc6\u7801",this.accountLabel="\u6ce8\u518c\u8d26\u53f7",this.accountSubmitCaption="\u6ce8\u518c\u65b0\u8d26\u53f7",this.passwordPageCaption="\u8d26\u53f7\u5bc6\u7801",this.passwordSubmitCaption="\u6ce8\u518c\u65b0\u8d26\u53f7",this.successText="\u6ce8\u518c\u6210\u529f"}internalStart(){return p(this,void 0,void 0,function*(){this.openVPage(y)})}toVerify(e){this.account=e,this.openVPage(v)}toPassword(){this.openVPage(f)}toSuccess(){this.openVPage(w)}login(){s.a.login({user:this.account,pwd:this.password,guest:a.nav.guest}).then(e=>p(this,void 0,void 0,function*(){void 0!==e?yield a.nav.logined(e):alert("something wrong!")}))}regReturn(e){let t;switch(e){default:throw"unknown return";case 0:return;case 1:t="\u7528\u6237\u540d "+this.account;break;case 2:t="\u624b\u673a\u53f7 +"+this.account;break;case 3:t="\u90ae\u7bb1 "+this.account}return t+" \u5df2\u7ecf\u88ab\u6ce8\u518c\u8fc7\u4e86"}checkAccount(){return p(this,void 0,void 0,function*(){let e=yield s.a.isExists(this.account),t=this.accountError(e);if(void 0!==t)return t;e=yield s.a.setVerify(this.account,this.type),this.toVerify(this.account)})}accountError(e){if(e>0)return"\u5df2\u7ecf\u88ab\u6ce8\u518c\u4f7f\u7528\u4e86"}execute(){return p(this,void 0,void 0,function*(){let e={nick:void 0,user:this.account,pwd:this.password,country:void 0,mobile:void 0,email:void 0,verify:this.verify};switch(this.type){case"mobile":e.mobile=this.account;break;case"email":e.email=this.account}let t=yield s.a.register(e);return 0===t?(a.nav.clear(),void this.toSuccess()):this.regReturn(t)})}}class b extends g{constructor(){super(...arguments),this.accountPageCaption="\u5bc6\u7801\u627e\u56de",this.accountLabel="\u8d26\u53f7",this.accountSubmitCaption="\u6ce8\u518c\u65b0\u8d26\u53f7",this.passwordPageCaption="\u91cd\u7f6e\u5bc6\u7801",this.passwordSubmitCaption="\u63d0\u4ea4",this.successText="\u6210\u529f\u4fee\u6539\u5bc6\u7801"}execute(){return p(this,void 0,void 0,function*(){yield s.a.resetPassword(this.account,this.password,this.verify,this.type);a.nav.clear(),this.toSuccess()})}accountError(e){if(0===e)return"\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8d26\u53f7"}}class y extends a.VPage{constructor(){super(...arguments),this.schema=[{name:"user",type:"string",required:!0,maxLength:100},{name:"verify",type:"submit"}],this.res=Object(a.resLang)(o),this.page=(()=>i.createElement(a.Page,{header:this.controller.accountPageCaption},i.createElement("div",{className:"w-max-20c my-5 py-5",style:{marginLeft:"auto",marginRight:"auto"}},l,i.createElement("div",{className:"h-3c"}),i.createElement(a.Form,{schema:this.schema,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,requiredFlag:!1})))),this.onSubmit=((e,t)=>p(this,void 0,void 0,function*(){t.clearContextErrors();let e=t.getValue("user"),n=m(e);if(void 0===n)return void t.setError("user","\u5fc5\u987b\u662f\u624b\u673a\u53f7\u6216\u90ae\u7bb1");let i=n.type;if("mobile"===i&&(11!==e.length||"1"!==e[0]))return void t.setError("user","\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7");this.controller.account=e,this.controller.type=i;let a=yield this.controller.checkAccount();void 0!==a&&t.setError("user",a)}))}open(){return p(this,void 0,void 0,function*(){this.uiSchema={items:{user:{widget:"text",label:this.controller.accountLabel,placeholder:"\u624b\u673a\u53f7\u6216\u90ae\u7bb1"},verify:{widget:"button",className:"btn btn-primary btn-block mt-3",label:"\u53d1\u9001\u9a8c\u8bc1\u7801"}}},this.openPage(this.page)})}}class v extends a.VPage{constructor(){super(...arguments),this.schema=[{name:"verify",type:"number",required:!0,maxLength:6},{name:"submit",type:"submit"}],this.onVerifyChanged=((e,t,n)=>{e.setDisabled("submit",!t||6!=t.length)}),this.uiSchema={items:{verify:{widget:"text",label:"\u9a8c\u8bc1\u7801",placeholder:"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",onChanged:this.onVerifyChanged},submit:{widget:"button",className:"btn btn-primary btn-block mt-3",label:"\u4e0b\u4e00\u6b65 >",disabled:!0}}},this.onSubmit=((e,t)=>p(this,void 0,void 0,function*(){let e=this.controller.verify=t.getValue("verify");0!==(yield s.a.checkVerify(this.controller.account,e))?this.controller.toPassword():t.setError("verify","\u9a8c\u8bc1\u7801\u9519\u8bef")})),this.page=(()=>{let e,t;switch(this.controller.type){case"mobile":e="\u624b\u673a\u53f7";break;case"email":e="\u90ae\u7bb1",t=i.createElement(i.Fragment,null,i.createElement("span",{className:"text-danger"},"\u6ce8\u610f"),": \u6709\u53ef\u80fd\u8bef\u4e3a\u5783\u573e\u90ae\u4ef6\uff0c\u8bf7\u68c0\u67e5",i.createElement("br",null))}return i.createElement(a.Page,{header:"\u9a8c\u8bc1\u7801"},i.createElement("div",{className:"w-max-20c my-5 py-5",style:{marginLeft:"auto",marginRight:"auto"}},"\u9a8c\u8bc1\u7801\u5df2\u7ecf\u53d1\u9001\u5230",e,i.createElement("br",null),i.createElement("div",{className:"py-2 px-3 my-2 text-primary bg-light"},i.createElement("b",null,this.controller.account)),t,i.createElement("div",{className:"h-1c"}),i.createElement(a.Form,{schema:this.schema,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,requiredFlag:!1})))})}open(){return p(this,void 0,void 0,function*(){this.openPage(this.page)})}}class f extends a.VPage{constructor(){super(...arguments),this.schema=[{name:"pwd",type:"string",required:!0,maxLength:100},{name:"rePwd",type:"string",required:!0,maxLength:100},{name:"submit",type:"submit"}],this.onSubmit=((e,t)=>p(this,void 0,void 0,function*(){let e=t.form.data,{pwd:n,rePwd:i}=e;return n&&n===i?(this.controller.password=n,yield this.controller.execute()):(t.setValue("pwd",""),t.setValue("rePwd",""),"\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u5bc6\u7801\uff01")})),this.page=(()=>i.createElement(a.Page,{header:this.controller.passwordPageCaption},i.createElement("div",{className:"w-max-20c my-5 py-5",style:{marginLeft:"auto",marginRight:"auto"}},"\u6ce8\u518c\u8d26\u53f7",i.createElement("br",null),i.createElement("div",{className:"py-2 px-3 my-2 text-primary bg-light"},i.createElement("b",null,this.controller.account)),i.createElement("div",{className:"h-1c"}),i.createElement(a.Form,{schema:this.schema,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,requiredFlag:!1}))))}open(){return p(this,void 0,void 0,function*(){this.uiSchema={items:{pwd:{widget:"password",placeholder:"\u5bc6\u7801",label:"\u5bc6\u7801"},rePwd:{widget:"password",placeholder:"\u91cd\u590d\u5bc6\u7801",label:"\u91cd\u590d\u5bc6\u7801"},submit:{widget:"button",className:"btn btn-primary btn-block mt-3",label:this.controller.passwordSubmitCaption}}},this.openPage(this.page)})}}class w extends a.VPage{constructor(){super(...arguments),this.page=(()=>{const{account:e,successText:t}=this.controller;return i.createElement(a.Page,{header:!1},i.createElement("div",{className:"container w-max-30c"},i.createElement("form",{className:"my-5"},i.createElement("div",{className:"py-5"},"\u8d26\u53f7 ",i.createElement("strong",{className:"text-primary"},e," ")," ",t,"\uff01"),i.createElement("button",{className:"btn btn-success btn-block",onClick:()=>this.controller.login()},"\u76f4\u63a5\u767b\u5f55"))))})}open(){return p(this,void 0,void 0,function*(){this.openPage(this.page)})}}n.d(t,"default",function(){return k});var E=function(e,t,n,i){return new(n||(n=Promise))(function(a,s){function r(e){try{c(i.next(e))}catch(t){s(t)}}function o(e){try{c(i.throw(e))}catch(t){s(t)}}function c(e){e.done?a(e.value):new n(function(t){t(e.value)}).then(r,o)}c((i=i.apply(e,t||[])).next())})};const x=[{name:"username",type:"string",required:!0,maxLength:100},{name:"password",type:"string",required:!0,maxLength:100},{name:"login",type:"submit"}];class k extends i.Component{constructor(){super(...arguments),this.res=Object(a.resLang)(r),this.uiSchema={items:{username:{placeholder:"\u624b\u673a/\u90ae\u7bb1/\u7528\u6237\u540d",label:"\u767b\u5f55\u8d26\u53f7"},password:{widget:"password",placeholder:"\u5bc6\u7801",label:"\u5bc6\u7801"},login:{widget:"button",className:"btn btn-primary btn-block mt-3",label:"\u767b\u5f55"}}},this.onSubmit=((e,t)=>E(this,void 0,void 0,function*(){let e=t.form.data,n=e.username,i=e.password;if(void 0===i)return"something wrong, pwd is undefined";let r=yield s.a.login({user:n,pwd:i,guest:a.nav.guest});if(void 0===r){let e=m(n);return(void 0!==e?e.caption:"\u7528\u6237\u540d")+"\u6216\u5bc6\u7801\u9519\uff01"}console.log("onLoginSubmit: user=%s pwd:%s",r.name,r.token),yield a.nav.logined(r,this.props.callback)})),this.clickReg=(()=>{new g(void 0).start()}),this.clickForget=(()=>{new b(void 0).start()})}render(){let e,t=i.createElement("div",{className:"text-center"},i.createElement("button",{className:"btn btn-link",color:"link",style:{margin:"0px auto"},onClick:this.clickReg},"\u6ce8\u518c\u8d26\u53f7")),n=!1;return!0===this.props.withBack?(n="\u767b\u5f55",e=i.createElement(i.Fragment,null,"\u767b\u5f55\u8d26\u53f7")):e=l,i.createElement(a.Page,{header:n,footer:t},i.createElement("div",{className:"w-max-20c my-5 py-5",style:{marginLeft:"auto",marginRight:"auto"}},e,i.createElement("div",{className:"h-3c"}),i.createElement(a.Form,{schema:x,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,requiredFlag:!1}),i.createElement("button",{className:"btn btn-link btn-block",onClick:()=>this.clickForget()},"\u5fd8\u8bb0\u5bc6\u7801")))}}}}]);
//# sourceMappingURL=1.464831ac.chunk.js.map