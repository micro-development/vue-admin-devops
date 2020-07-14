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
    import * as projectApi from '../../service/project.js'

    export default {
        name: 'ci-project',
        components: {
            FormEdit
        },
        data () {
            return {
                detail: null,
                addSearch: {
                    leftAfterText: '空间'
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
                            label: '项目名称',
                            prop: 'name'
                        },
                        {
                            label: '描述',
                            prop: 'description'
                        },
                        {
                            label: '背景',
                            prop: 'color',
                            html: true,
                            formatter ({ dataItem }) {
                                return `<span style="background-color: ${dataItem.color}">${dataItem.color}</span>`
                            }
                        },
                        {
                            label: '状态',
                            prop: 'status',
                            formatter ({ dataItem }) {
                                return dataItem.status === 1 ? '启用' : '禁用'
                            }
                        },
                        {
                            label: '权限',
                            prop: 'permission',
                            formatter ({ dataItem }) {
                                const itemMap = {
                                    1: '公开',
                                    2: '私有',
                                    3: '团队内公开'
                                }
                                return itemMap[dataItem.permission]
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
                const { list } = await this.$http.fetch(projectApi.list({}))
                if (list) {
                    this.listTable.dataList = list || []
                }
                // this.$log.echo(list, 'ci project/index.vue getList list', 'log')
            },
            async getDetail (uuid) {
                const { detail } = await this.$http.fetch(projectApi.detail({
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
                this.$confirm('删除空间将会删除下面所有数据，是否继续', '删除空间', {
                    type: 'warning'
                }).then(async () => {
                    const data = await this.$http.fetch(projectApi.remove({
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
