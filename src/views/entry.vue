<template>
    <component-container ref="componentContainer">
        <el-row class="entry-content" slot="content">
            <el-col :span="20" :offset="2">
                <el-tabs v-model="tabModel" @tab-click="toggleTabActive">
                    <el-tab-pane label="概览" name="dashboard">
                        <dashboard></dashboard>
                    </el-tab-pane>
                    <el-tab-pane label="任务" name="task">
                        <task></task>
                    </el-tab-pane>
                    <el-tab-pane label="构建" name="build">
                        <build></build>
                    </el-tab-pane>
                    <el-tab-pane label="环境" name="env">
                        <env></env>
                    </el-tab-pane>
                    <el-tab-pane label="绑定Git" name="git">
                        <git></git>
                    </el-tab-pane>
                    <el-tab-pane label="设置" name="setting">
                        <setting></setting>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <project-form @onSaveFinished="getList" ref="projectForm"></project-form>
        </el-row>
    </component-container>
</template>

<script>
    import Dashboard from './dashboard'
    import Task from './task'
    import Build from './build'
    import Env from './env'
    import Git from './git'
    import Setting from './setting'
    import * as projectApi from '../service/project'
    import ProjectForm from './project-form'

    export default {
        name: 'entry',
        components: {
            Dashboard,
            Task,
            Build,
            Env,
            Git,
            Setting,
            ProjectForm
        },
        data () {
            return {
                tabModel: '',
                dataList: []
            }
        },
        watch: {
            $route () {
                this.setTabActive()
            }
        },
        mounted () {
            // this.onAdd()
            this.init()
        },
        methods: {
            async init () {
                this.setTabActive()
                // await this.getList()
            },
            setTabActive () {
                const route = this.$route
                const path = route.path
                const pathArr = path.split('/')
                if (pathArr.length === 4) {
                    this.tabModel = pathArr[pathArr.length - 1]
                }
                // this.$log.echo(route, 'toggleTabActive route', 'log')
            },
            toggleTabActive (tab) {
                this.$router.push({
                    path: `/devops/${this.$route.params.project_uuid}/${tab.name}`
                })
                // this.$log.echo(tab, 'toggleTabActive tab', 'log')
            },
            async getList () {
                const { list } = await this.$http.fetch(projectApi.list({}))
                if (list) {
                    this.dataList = list
                    // this.$log.echo(list, 'devops project.vue getList list', 'log')
                }
            },
            async getDetail (uuid) {
                const { detail } = await this.$http.fetch(projectApi.detail({
                    uuid
                }))
                if (detail) {
                    // this.$log.echo(detail, 'devops project.vue getDetail detail', 'log')
                }
            },
            async onOpenForm () {
                this.$refs.projectForm.onOpenDialog()
            }
        }
    }
</script>

<style lang="less">
    .project-item-col{
        padding: 5px;
    }
    .project-desc{
        line-height: 32px;
        height: 72px;
    }
    .card-footer{
        /*border-top: 1px solid #EBEEF5;*/
        padding-top: 10px;
    }
    .box-card{
        cursor: pointer;
    }
    .project-type{
        &.p-mg{
            margin-top: 20px;
        }
    }
    .entry-content{
        height: calc(100%);
        > div {
            height: 100%;
        }
        .el-tabs{
            height: 100%;
            .el-tab-pane,
            .el-tabs__content{
                height: calc(100% - 30px);
            }
        }
    }
</style>
