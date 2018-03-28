webpackJsonp([0], { 233: function (e, n, t) {
        "use strict";
        Object.defineProperty(n, "__esModule", { value: !0 });
        var r = t(6), i = (t.n(r), t(30)), o = t(43), a = t(238), s = t(241), l = t(236), c = t(3), m = this && this.__awaiter || function (e, n, t, r) { return new (t || (t = Promise))(function (i, o) { function a(e) { try {
            l(r.next(e));
        }
        catch (e) {
            o(e);
        } } function s(e) { try {
            l(r.throw(e));
        }
        catch (e) {
            o(e);
        } } function l(e) { e.done ? i(e.value) : new t(function (n) { n(e.value); }).then(a, s); } l((r = r.apply(e, n || [])).next()); }); };
        const d = t(71);
        n.default = class extends r.Component {
            constructor() { super(...arguments), this.schema = new o.a({ fields: [{ type: "string", name: "username", placeholder: "\u7528\u6237\u540d", rules: ["required", "maxlength:100"] }, { type: "password", name: "password", placeholder: "\u5bc6\u7801", rules: ["required", "maxlength:100"] }], onSumit: this.onLoginSubmit.bind(this) }); }
            onLoginSubmit(e) { return m(this, void 0, void 0, function* () { let n = yield l.a.login({ user: e.username, pwd: e.password }); void 0 === n ? (this.schema.clear(), this.schema.errors.push("\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\uff01")) : yield o.e.logined(n); }); }
            click() { o.e.replace(r.createElement(a.a, null)); }
            render() { let e = r.createElement("div", { className: "text-center" }, r.createElement(i.a, { color: "link", style: { margin: "0px auto" }, onClick: () => o.e.push(r.createElement(a.a, null)) }, "\u5982\u679c\u6ca1\u6709\u8d26\u53f7\uff0c\u8bf7\u6ce8\u518c")); return r.createElement(o.c, { header: !1, footer: e }, r.createElement("div", { style: { maxWidth: "400px", margin: "20px auto", padding: "0 30px" } }, r.createElement("div", { className: "container", style: { display: "flex", position: "relative" } }, r.createElement("img", { className: "App-logo", src: d, style: { height: "60px", position: "absolute" } }), r.createElement("span", { style: { flex: 1, fontSize: "x-large", alignSelf: "center", textAlign: "center", margin: "10px" } }, "\u540c\u82b1")), r.createElement("div", { style: { height: "20px" } }), r.createElement(c.g, { formSchema: this.schema })), r.createElement("div", { className: "constainer" }, r.createElement(i.a, { color: "link", block: !0, onClick: () => o.e.push(r.createElement(s.a, null)) }, "\u5fd8\u8bb0\u5bc6\u7801"))); }
        };
    }, 236: function (e, n, t) {
        "use strict";
        var r = t(31), i = t(72);
        const o = new class extends r.a {
            login(e) { return this.get("login", e).then(e => { if (void 0 !== e)
                return Object(i.a)(e); }); }
            register(e) { return this.post("register", e); }
        }("tv/user/");
        n.a = o;
    }, 237: function (e, n, t) { var r = t(240); "string" === typeof r && (r = [[e.i, r, ""]]); var i = { hmr: !1, transform: void 0 }; t(235)(r, i); r.locals && (e.exports = r.locals); }, 238: function (e, n, t) {
        "use strict";
        var r = t(6), i = (t.n(r), t(43)), o = t(233), a = t(236), s = t(239), l = t(237), c = (t.n(l), this && this.__awaiter || function (e, n, t, r) { return new (t || (t = Promise))(function (i, o) { function a(e) { try {
            l(r.next(e));
        }
        catch (e) {
            o(e);
        } } function s(e) { try {
            l(r.throw(e));
        }
        catch (e) {
            o(e);
        } } function l(e) { e.done ? i(e.value) : new t(function (n) { n(e.value); }).then(a, s); } l((r = r.apply(e, n || [])).next()); }); });
        const m = t(71);
        n.a = class extends r.Component {
            constructor() { super(...arguments), this.schema = new i.a({ fields: [{ type: "string", name: "user", placeholder: "\u7528\u6237\u540d", rules: ["required", "maxlength:100"] }, { type: "password", name: "pwd", placeholder: "\u5bc6\u7801", rules: ["required", "maxlength:100"] }, { type: "password", name: "rePwd", placeholder: "\u91cd\u590d\u5bc6\u7801", rules: ["required", "maxlength:100"] }], submitText: "\u6ce8\u518c\u65b0\u7528\u6237", onSumit: this.onLoginSubmit.bind(this) }); }
            onLoginSubmit(e) { return c(this, void 0, void 0, function* () { let n, { user: t, pwd: o, rePwd: l, country: c, mobile: m, email: d } = e; if (o !== l)
                return this.schema.errors.push("\u5bc6\u7801\u4e0d\u5bf9\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u5bc6\u7801\uff01"), this.schema.inputs.pwd.clear(), void this.schema.inputs.rePwd.clear(); switch (yield a.a.register({ nick: void 0, user: t, pwd: o, country: void 0, mobile: void 0, email: void 0 })) {
                default: throw "unknown return";
                case 0: return i.e.clear(), void i.e.show(r.createElement(s.a, { user: t, pwd: o }));
                case 1:
                    n = "\u7528\u6237\u540d " + t;
                    break;
                case 2:
                    n = "\u624b\u673a\u53f7 +" + c + " " + m;
                    break;
                case 3: n = "\u7535\u5b50\u90ae\u4ef6 " + d;
            } this.schema.errors.push(n + " \u5df2\u7ecf\u88ab\u6ce8\u518c\u8fc7\u4e86"); }); }
            click() { i.e.replace(r.createElement(o.default, null)); }
            render() { return r.createElement(i.c, { header: "\u6ce8\u518c" }, r.createElement("div", { style: { maxWidth: "400px", margin: "20px auto", padding: "0 30px" } }, r.createElement("div", { className: "container", style: { display: "flex", position: "relative" } }, r.createElement("img", { className: "App-logo", src: m, style: { height: "60px", position: "absolute" } }), r.createElement("span", { style: { flex: 1, fontSize: "x-large", alignSelf: "center", textAlign: "center", margin: "10px" } }, "\u540c\u82b1")), r.createElement("div", { style: { height: "20px" } }), r.createElement(i.d, { formSchema: this.schema }))); }
        };
    }, 239: function (e, n, t) {
        "use strict";
        var r = t(6), i = (t.n(r), t(30)), o = t(43), a = t(236), s = t(237), l = (t.n(s), this && this.__awaiter || function (e, n, t, r) { return new (t || (t = Promise))(function (i, o) { function a(e) { try {
            l(r.next(e));
        }
        catch (e) {
            o(e);
        } } function s(e) { try {
            l(r.throw(e));
        }
        catch (e) {
            o(e);
        } } function l(e) { e.done ? i(e.value) : new t(function (n) { n(e.value); }).then(a, s); } l((r = r.apply(e, n || [])).next()); }); });
        n.a = class extends r.Component {
            failed() { }
            login() { const { user: e, pwd: n } = this.props; a.a.login({ user: e, pwd: n }).then(e => l(this, void 0, void 0, function* () { void 0 !== e ? yield o.e.logined(e) : this.failed(); })); }
            render() { const { user: e, pwd: n } = this.props; return r.createElement(o.c, { header: !1 }, r.createElement(i.d, { className: "entry-form" }, r.createElement(i.h, null, r.createElement("span", { className: "info" }, "\u7528\u6237 ", r.createElement("strong", null, e, " "), " \u6ce8\u518c\u6210\u529f\uff01"), r.createElement(i.a, { color: "success", block: !0, onClick: () => this.login() }, "\u76f4\u63a5\u767b\u5f55")))); }
        };
    }, 240: function (e, n, t) { (e.exports = t(234)(!0)).push([e.i, "div.entry-form{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;max-width:400px;margin:20px auto;padding:0 30px}div.entry-form>form{margin-top:50px}div.entry-form>form>button,div.entry-form>form>div,div.entry-form>form>input,div.entry-form>form>span{margin-top:20px}div.entry-form>form>span{display:block;color:red;padding:1px 15px}div.entry-form>form>span.info{color:green}div.entry-form>form>header{display:-ms-flexbox;display:flex;margin:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:relative}div.entry-form>form>header>img{position:absolute;left:0}div.entry-form>form>header>span{font-size:x-large;display:inline-block;margin-left:20px}", "", { version: 3, sources: ["C:/Users/Henry/Projects/tonva-ui/tonva-tools/dist/css/va-form.css"], names: [], mappings: "AACA,eACC,oBAAqB,AACrB,aAAc,AACd,0BAA2B,AACvB,sBAAuB,AAC3B,gBAAiB,AACjB,iBAAkB,AAClB,cAAgB,CAChB,AACD,oBACC,eAAiB,CACjB,AACD,sGAIC,eAAiB,CACjB,AACD,yBACC,cAAe,AACf,UAAW,AACX,gBAAkB,CAClB,AACD,8BACC,WAAa,CACb,AACD,2BACC,oBAAqB,AACrB,aAAc,AACd,SAAU,AACV,sBAAuB,AACnB,mBAAoB,AACxB,qBAAsB,AAClB,uBAAwB,AAC5B,iBAAmB,CACnB,AACD,+BACC,kBAAmB,AACnB,MAAQ,CACR,AACD,gCACC,kBAAmB,AACnB,qBAAsB,AACtB,gBAAkB,CAClB", file: "va-form.css", sourcesContent: ["\r\ndiv.entry-form {\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-ms-flex-direction: column;\r\n\t    flex-direction: column;\r\n\tmax-width: 400px;\r\n\tmargin: 20px auto;\r\n\tpadding: 0 30px;\r\n}\r\ndiv.entry-form>form {\r\n\tmargin-top: 50px;\r\n}\r\ndiv.entry-form>form>input, \r\ndiv.entry-form>form>button,\r\ndiv.entry-form>form>span,\r\ndiv.entry-form>form>div {\r\n\tmargin-top: 20px;\r\n}\r\ndiv.entry-form>form>span {\r\n\tdisplay: block;\r\n\tcolor: red;\r\n\tpadding: 1px 15px;\r\n}\r\ndiv.entry-form>form>span.info {\r\n\tcolor: green;\r\n}\r\ndiv.entry-form>form>header {\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\tmargin: 0;\r\n\t-ms-flex-align: center;\r\n\t    align-items: center;\r\n\t-ms-flex-pack: center;\r\n\t    justify-content: center;\r\n\tposition: relative;\r\n}\r\ndiv.entry-form>form>header>img {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n}\r\ndiv.entry-form>form>header>span {\r\n\tfont-size: x-large;\r\n\tdisplay: inline-block;\r\n\tmargin-left: 20px;\r\n}\r\n"], sourceRoot: "" }]); }, 241: function (e, n, t) {
        "use strict";
        var r = t(6), i = (t.n(r), t(43));
        n.a = class extends r.Component {
            render() { return r.createElement(i.c, { header: "\u5fd8\u8bb0\u5bc6\u7801" }, "\u6b63\u5728\u8bbe\u8ba1\u4e2d..."); }
        };
    } });
//# sourceMappingURL=0.af8e3ed3.chunk.js.map 
//# sourceMappingURL=0.af8e3ed3.chunk.js.map