import React from 'react';
import _ from 'lodash';
export default {
    x: {
        no: '编号',
        team: '部门',
        staff: '员工',
        noStaff: '无员工',
        post: '职位',
        noPost: '无职位',
        a: 'aaa',
        b: {
            s: 'sss',
            d: () => React.createElement("span", { className: "text-success" }, "ddd"),
        },
        c: () => React.createElement("span", { className: "text-danger" }, "ccc"),
    },
    usq: '$UNITX',
    tuid: '基础档案',
    map: '对照表',
    sheet: '单据',
    pending: '待处理',
    book: '帐',
    action: '操作',
    tuidNullCaption: '选择',
    submit: '提交',
    arrNew: '新增',
    arrEdit: '保存',
    entity: {
        message: {
            label: '消息-message',
            arrNew: '新增消息',
            arrEdit: '保存消息',
            fields: {
                fromUser: '发送人',
                fromUnit: '发送部门',
                type: '类型',
                date: '日期',
                subject: '主题',
                discription: '描述',
                content: '内容'
            },
        },
        getMessage: {
            label: '获取Message',
            submit: '获取消息',
            fields: {
                msg: '消息'
            }
        },
        newMessage: {
            label: '新建消息',
            fields: {
                type: '类型',
                subject: '主题',
            },
            arrs: {
                to: {
                    label: '发送',
                    newSubmit: '新增to',
                    editSumbit: '保存to',
                },
                cc: {
                    label: '抄送',
                    newSubmit: '新增cc',
                    editSumbit: '保存cc',
                }
            }
        },
        sectionTeam: {
            label: '大部团队对照表',
        },
        teamPerson: {
            label: '员工岗位对照表',
            fields: {},
            confirmDelete: _.template('真的要删除${label}吗'),
        },
        teamOrganization: {
            label: '团队机构对照表',
        },
        teamPosts: {
            label: '团队岗位对照表',
        },
        person: {
            label: '员工',
            fields: {
                name: '姓名',
                nick: '别名',
                given: '名字',
                sur: '姓',
                gender: '性别',
                user: '用户',
            }
        },
        organization: {
            label: '机构',
            arrs: {
                post: {
                    label: '岗位',
                }
            }
        },
        user: {
            label: '用户'
        },
        team: {
            label: '团队',
        },
        section: {
            label: '大部',
        }
    }
};
//# sourceMappingURL=CN.js.map