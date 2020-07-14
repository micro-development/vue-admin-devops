<template>
    <component-container
        @onAdd="onAdd"
        @onSelect="onSelect"
        @onDelete="onDelete"
        @onListBtn='onListBtn'
        :add-search="addSearch"
        :hide-config="hideConfig"
        :list-table='listTable'
        ref="componentContainer">
        <build-result
            v-if="detail"
            :detail='detail'
            :task-detail="taskDetail"
            @onBack="onBack"
            slot='content'
            ref="buildResult"></build-result>
    </component-container>
</template>

<script>
    import BuildResult from './build-result'
    import { list, detail, add, remove } from '../../service/build'

    export default {
        name: 'ci-build',
        components: {
            BuildResult
        },
        data () {
            return {
                ci_task_uuid: '',
                detail: null,
                taskDetail: null,
                addSearch: {
                    leftText: '新增执行构建'
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
                            label: '编号',
                            prop: 'id',
                            formatter ({ dataItem }) {
                                return `#${dataItem.id}`
                            }
                        },
                        {
                            label: '创建时间',
                            prop: 'create_time'
                        },
                        {
                            label: '运行状态',
                            prop: 'run_status',
                            formatter ({ dataItem }) {
                                const itemMap = {
                                    1: '成功',
                                    2: '失败',
                                    3: '运行中'
                                }
                                return itemMap[dataItem.run_status]
                            }
                        }
                    ],
                    btnList: [
                        {
                            name: '查看',
                            method: 'onSelect',
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
        computed: {
            query () {
                return {
                    ci_task_uuid: this.$route.query.ci_task_uuid
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
            async test () {
                if (this.listTable.dataList.length) {
                    this.getDetail(this.listTable.dataList[0].uuid)
                }
            },
            async getList () {
                if (!this.query.ci_task_uuid) {
                    return
                }
                const data = await this.$http.fetch(list(this.query))
                if (data) {
                    this.listTable.dataList = data.list || []
                    // this.test()
                }
                // this.$log.echo(list, 'ci project/index.vue getList list', 'log')
            },
            async getDetail (uuid) {
                this.detail = null
                this.taskDetail = null
                const data = await this.$http.fetch(detail({
                    uuid
                }))
                if (data) {
                    this.detail = data.detail
                    this.taskDetail = data.taskDetail
                }
                this.$log.echo(data, 'ci build/index.vue getDetail detail', 'log')
            },
            onListBtn (opts) {
                this.$log.echo(opts, 'project/index.vue onListBtn opts', 'log')
            },
            async onAdd () {
                const result = await this.$http.fetch(add({
                    ci_task_uuid: this.query.ci_task_uuid,
                    content: ''
                }))
                this.$log.echo(result, 'build.vue onAdd result', 'log')
                if (result) {
                    this.init()
                }
            },
            async onSelect ({ dataItem }) {
                this.getDetail(dataItem.uuid)
            },
            onDelete ({ dataItem }) {
                // this.$message.info('onDelete')
                this.$confirm('删除将停止本次构建，是否继续', '删除构建', {
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
            onBack () {
                this.detail = null
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
