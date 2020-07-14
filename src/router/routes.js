import { moduleInfo } from 'common/src/output'

export default [
    {
        path: '/devops',
        name: 'DevOps',
        redirect: '/devops/project',
        meta: {
            hideMenu: true
        },
        component: moduleInfo.layout['root-layout'],
        children: [
            {
                path: 'project',
                name: '项目管理',
                meta: {
                    iconClass: 'el-icon-s-platform'
                },
                component: () => {
                    return import('../views/project.vue')
                }
            },
            {
                path: ':project_uuid',
                name: '项目中心',
                meta: {
                    iconClass: 'el-icon-s-platform'
                },
                component: moduleInfo.layout['two-layout'],
                children: [
                    {
                        path: 'dashboard',
                        name: '概览',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    },
                    {
                        path: 'task',
                        name: '任务',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    },
                    {
                        path: 'build',
                        name: '构建',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    },
                    {
                        path: 'env',
                        name: '环境',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    },
                    {
                        path: 'git',
                        name: '绑定Git',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    },
                    {
                        path: 'setting',
                        name: '设置',
                        meta: {
                            iconClass: 'el-icon-s-platform'
                        },
                        component: () => {
                            return import('../views/entry.vue')
                        }
                    }
                ]
            }
        ]
    }
]
