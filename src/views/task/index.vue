<template>
    <component-container
        @onAdd="onAdd"
        @onBuild="onBuild"
        @onSelect="onSelect"
        @onUpdate='onUpdate'
        @onDelete='onDelete'
        @onListBtn='onListBtn'
        :add-search="addSearch"
        :hide-config="hideConfig"
        :list-table='listTable'
        ref="componentContainer">
    </component-container>
</template>

<script>
    import { list, detail, remove } from '../../service/task'
    import * as buildApi from '../../service/build'

    export default {
        name: 'ci-task',
        components: {},
        data () {
            return {
                detail: null,
                addSearch: {
                    leftAfterText: '任务'
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
                            label: '任务名称',
                            prop: 'name'
                        },
                        {
                            label: '仓库地址',
                            prop: 'git_url'
                        },
                        {
                            label: '分支',
                            prop: 'branch'
                        },
                        {
                            label: '状态',
                            prop: 'status'
                        }
                    ],
                    btnList: [
                        {
                            name: '构建',
                            method: 'onBuild',
                            condition () {
                                return true
                            }
                        },
                        {
                            name: '查看',
                            method: 'onSelect',
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
                        }
                        // {
                        //     name: '删除',
                        //     method: 'onDelete',
                        //     condition () {
                        //         return true
                        //     }
                        // }
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
                const data = await this.$http.fetch(list({}))
                if (data) {
                    this.listTable.dataList = data.list || []
                }
                // this.$log.echo(list, 'ci project/index.vue getList list', 'log')
            },
            async getDetail (uuid) {
                const data = await this.$http.fetch(detail({
                    uuid
                }))
                if (data) {
                    this.detail = data.detail
                    this.detail.step_list = JSON.parse(this.detail.step_list)
                    this.onExecStep()
                }
                this.$log.echo(detail, 'ci task/index.vue getDetail detail', 'log')
            },
            async onExecStep () {
                const data = await this.$http.fetch({
                    method: 'post',
                    data: {
                        uuid: this.detail.uuid,
                        ci_project_uuid: this.detail.ci_project_uuid,
                        git_url: this.detail.git_url,
                        branch: this.detail.branch,
                        step_list: this.detail.step_list
                    }
                }, {
                    url: '/execApi/brociapi/ci/tasks?key=3EOv6kHMu5XNEDLt1s'
                })
                this.$log.echo(data, 'ci task/index.vue onExecStep data', 'log')
            },
            onListBtn (opts) {
                this.$log.echo(opts, 'project/index.vue onListBtn opts', 'log')
            },
            onAdd () {
                this.detail = null
                this.$nextTick(() => {
                    // this.$refs.formEdit.onOpenDialog()
                })
                this.$router.push('/ci/task/edit')
            },
            async onSelect ({ dataItem }) {
                this.getDetail(dataItem.uuid)
            },
            onUpdate ({ dataItem }) {
                // this.getDetail(dataItem.uuid)
                this.$router.push({
                    path: '/ci/task/edit',
                    query: {
                        uuid: dataItem.uuid
                    }
                })
            },
            async onBuild ({ dataItem }) {
                // this.getDetail(dataItem.uuid)
                // this.$router.push({
                //     path: '/ci/task/build',
                //     query: {
                //         ci_task_uuid: dataItem.uuid
                //     }
                // })
                const result = await this.$http.fetch(buildApi.add({
                    ci_task_uuid: dataItem.uuid,
                    content: ''
                }))
                if (result) {
                    this.$router.push({
                        path: '/ci/task/build',
                        query: {
                            ci_task_uuid: dataItem.uuid
                        }
                    })
                }
            },
            onDelete ({ dataItem }) {
                // this.$message.info('onDelete')
                this.$confirm('删除环境将会删除关联所有数据，是否继续', '删除环境', {
                    type: 'warning'
                }).then(async () => {
                    const data = await this.$http.fetch(remove({
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
