<template>
    <component-container
            @onAdd="onAdd"
            @onUpdate='onUpdate'
            @onDelete='onDelete'
            @onCheckStatus="onCheckStatus"
            :hide-config="hideConfig"
            :add-search="addSearch"
            :list-table="listTable"
            ref="componentContainer">
        <env-form-edit
                @onSaveFinished="onSaveFinished"
                :detail="detail"
                slot="dialog"
                ref="formEdit"></env-form-edit>
    </component-container>
</template>

<script>
    import * as api from '../service/env.js'
    import EnvFormEdit from './env/form-edit'

    export default {
        name: 'env',
        components: {
            EnvFormEdit
        },
        data () {
            return {
                hideConfig: {
                    catalog: true
                },
                addSearch: {
                    leftAfterText: '节点/环境'
                },
                detail: null,
                listTable: {
                    dataList: [],
                    fieldList: [
                        {
                            prop: 'name',
                            label: '环境名称'
                        },
                        {
                            prop: 'remote_host',
                            label: '主机'
                        },
                        {
                            prop: 'remote_user',
                            label: '用户'
                        },
                        {
                            prop: 'remote_port',
                            label: '端口'
                        }
                    ],
                    btnList: [
                        {
                            name: '检测',
                            method: 'onCheckStatus',
                            condition () {
                                return true
                            }
                        },
                        {
                            name: '修改',
                            method: 'onUpdate',
                            condition () {
                                return true
                            }
                        },
                        {
                            name: '删除',
                            method: 'onDelete',
                            condition () {
                                return true
                            }
                        }
                    ]
                }
            }
        },
        watch: {},
        mounted () {
            this.init()
        },
        methods: {
            /**
             * 初始化
             * @returns {Promise<void>}
             */
            async init () {
                await this.getList()
            },

            /**
             * 获取当前空间下的环境列表
             * @returns {Promise<void>}
             */
            async getList () {
                const { list } = await this.$http.fetch(api.list({
                    ci_project_uuid: this.$route.params.project_uuid
                }))
                if (list) {
                    this.listTable.dataList = list || []
                }
                // this.$log.echo(list, 'ci project/index.vue getList list', 'log')
            },

            /**
             * 获取环境详情
             * @param uuid  当前环境的UUID
             * @returns {Promise<void>}
             */
            async getDetail (uuid) {
                this.detail = null
                const { detail } = await this.$http.fetch(api.detail({
                    uuid
                }))
                if (detail) {
                    this.detail = detail
                    this.$refs.formEdit.onOpenDialog()
                }
                // this.$log.echo(detail, 'ci project/index.vue getDetail detail', 'log')
            },

            /**
             * 添加打开弹框
             */
            onAdd () {
                this.detail = null
                this.$refs.formEdit.onOpenDialog()
            },

            /**
             * 列表中的修改按钮
             * @param dataItem  当前行的数据对象
             * @returns {Promise<void>}
             */
            async onUpdate ({ dataItem }) {
                await this.getDetail(dataItem.uuid)
            },

            /**
             * 列表中的删除按钮
             * @param dataItem  当前行的数据对象
             */
            onDelete ({ dataItem }) {
                // this.$message.info('onDelete')
                this.$confirm(`删除环境将会删除关联所有数据，是否继续删除环境 【${dataItem.name}】？`, '删除环境', {
                    type: 'warning'
                }).then(async () => {
                    const data = await this.$http.fetch(api.remove({
                        uuid: dataItem.uuid
                    }))
                    if (data) {
                        this.$message.success('删除成功')
                        this.init()
                    }
                })
            },

            /**
             * 列表中的检测按钮，检测是否能连通
             * @param dataItem  当前行的数据对象
             */
            onCheckStatus ({ dataItem }) {
                this.$log.echo(dataItem, 'onCheckStatus dataItem', 'log')
            },

            /**
             * 表单弹框成功时派发出来的事件
             */
            onSaveFinished () {
                this.init()
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
