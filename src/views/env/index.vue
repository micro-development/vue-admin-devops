<template>
    <component-container
        @onAdd="onAdd"
        @onUpdate='onUpdate'
        @onDelete='onDelete'
        @onListBtn='onListBtn'
        :add-search="addSearch"
        :hide-config="hideConfig"
        :list-table='listTable'
        ref="componentContainer">
        <form-edit
            @onSaveFinished='init'
            :detail='detail'
            slot='dialog'
            ref="formEdit"></form-edit>
    </component-container>
</template>

<script>
    import FormEdit from './form-edit'
    import * as api from '../../service/env.js'

    export default {
        name: 'ci-env',
        components: {
            FormEdit
        },
        data () {
            return {
                detail: null,
                addSearch: {
                    leftAfterText: '环境'
                },
                hideConfig: {
                    catalog: true
                },
                listTable: {
                    dataList: [
                        // {
                        //     name: '1',
                        //     description: 'test',
                        //     status: 2
                        // }
                    ],
                    fieldList: [
                        {
                            label: '环境名称',
                            prop: 'name'
                        },
                        {
                            label: '主机',
                            prop: 'remote_host'
                        },
                        {
                            label: '用户',
                            prop: 'remote_user'
                        },
                        {
                            label: '状态',
                            prop: 'status',
                            formatter ({ dataItem }) {
                                return dataItem.status === 1 ? '启用' : '禁用'
                            }
                        }
                    ],
                    btnList: [
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
        mounted () {
            // this.onAdd()
            this.init()
        },
        methods: {
            async init () {
                await this.getList()
            },
            async getList () {
                const { list } = await this.$http.fetch(api.list({}))
                if (list) {
                    this.listTable.dataList = list || []
                }
                // this.$log.echo(list, 'ci project/index.vue getList list', 'log')
            },
            async getDetail (uuid) {
                const { detail } = await this.$http.fetch(api.detail({
                    uuid
                }))
                if (detail) {
                    this.detail = detail
                    this.$nextTick(() => {
                        this.$refs.formEdit.onOpenDialog()
                    })
                }
                // this.$log.echo(detail, 'ci project/index.vue getDetail detail', 'log')
            },
            onListBtn (opts) {
                this.$log.echo(opts, 'project/index.vue onListBtn opts', 'log')
            },
            onAdd () {
                this.detail = null
                this.$nextTick(() => {
                    this.$refs.formEdit.onOpenDialog()
                })
            },
            onUpdate ({ dataItem }) {
                this.getDetail(dataItem.uuid)
            },
            onDelete ({ dataItem }) {
                // this.$message.info('onDelete')
                this.$confirm('删除环境将会删除关联所有数据，是否继续', '删除环境', {
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
            onSaveFinished () {
                this.init()
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
