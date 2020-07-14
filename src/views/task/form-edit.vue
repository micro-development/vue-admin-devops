<template>
    <el-form :model="formData" status-icon :rules="ruleData" ref="formData" label-width="100px" class="task-form-edit">
        <el-form-item :label="labelConfig.ci_project_uuid" prop="ci_project_uuid">
            <el-select
                @change="onChangeProject"
                :placeholder="placeholder.ci_project_uuid"
                v-model="formData.ci_project_uuid">
                <el-option
                    v-for="item in projectList"
                    :key="item.uuid"
                    :label="item.name"
                    :value="item.uuid">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="labelConfig.name" prop="name">
            <el-input
                :placeholder="placeholder.name"
                v-model="formData.name"
                auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="labelConfig.git_url" prop="git_url">
            <el-input
                :placeholder="placeholder.git_url"
                v-model="formData.git_url"
                auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="labelConfig.branch" prop="branch">
            <el-input
                :placeholder="placeholder.branch"
                v-model="formData.branch"
                auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="labelConfig.step_list" prop="step_list" class="step-list">
            <template v-for="(stepItem, stepIndex) in formData.step_list">
                <div :key="stepIndex + 1">
                    <el-select
                        v-model="stepItem.skip_error">
                        <el-option label="出错继续" :value="1"></el-option>
                        <el-option label="出错终止" :value="2"></el-option>
                    </el-select>
                    <el-select
                        class="step-item-mg"
                        v-model="stepItem.type">
                        <el-option label="ssh" value="ssh"></el-option>
                        <el-option label="local" value="local"></el-option>
                    </el-select>
                    <el-select
                        v-if="stepItem.type === 'ssh'"
                        :placeholder="placeholder.step_env"
                        v-model="stepItem.ci_env_uuid">
                        <el-option
                            v-for="item in envList"
                            :key="item.uuid"
                            :label="item.name"
                            :value="item.uuid">
                        </el-option>
                    </el-select>
                    <el-button
                        class="step-item-add"
                        type="primary"
                        :size="$store.state.layoutSize"
                        icon="el-icon-plus"
                        @click="onAddStep(stepIndex)"
                        circle></el-button>
                    <el-button
                        class="step-item-add"
                        type="danger"
                        :size="$store.state.layoutSize"
                        icon="el-icon-minus"
                        @click="onRemoveStep(stepIndex)"
                        v-if="stepIndex > 0"
                        circle></el-button>
                </div>
                <div class="step-item-command" :key="stepIndex + 100">
<!--                    <el-input type="textarea" :placeholder="placeholder.step_command" v-model="stepItem.command"></el-input>-->
                    <codemirror
                        class='codemirror-item'
                        :options='options'
                        v-model='stepItem.command'></codemirror>
                </div>
            </template>
        </el-form-item>
        <el-form-item align="center">
            <el-button @click="onSure" type="primary">保 存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import { add, update, detail } from '../../service/task'
    import { list as pList } from '../../service/project'
    import { list as envList } from '../../service/env'
    import {
        codemirror
    } from 'vue-codemirror-lite'
    require('codemirror/mode/shell/shell')
    require('codemirror/theme/material-darker.css')

    const stepItem = () => {
        return {
            type: 'ssh',
            command: 'ls',
            skip_error: 1,
            ci_env_uuid: ''
        }
    }
    const modelData = () => {
        return {
            uuid: '',
            ci_project_uuid: '',
            name: 'test',
            git_url: 'git@gitea.ittlr.com',
            branch: 'master',
            step_list: [
                {
                    ...stepItem()
                }
            ]
        }
    }

    export default {
        name: 'ci-task-form-edit',
        components: {
            codemirror
        },
        data () {
            return {
                options: {
                    mode: 'shell',
                    theme: 'material-darker',
                    lineNumbers: true,
                    lineWrapping: true
                },
                projectList: [],
                envList: [],
                placeholder: {
                    ci_project_uuid: '请选择项目',
                    name: '例如：xxx测试环境',
                    git_url: '例如：git@gitea.ittlr.com',
                    branch: '例如：master',
                    step_env: '请选择环境',
                    step_command: '请输入命令'
                },
                labelConfig: {
                    ci_project_uuid: '所属项目',
                    name: '任务名称',
                    git_url: '仓库地址',
                    branch: '仓库分支',
                    step_list: '构建步骤'
                },
                ruleData: {},
                formData: modelData()
            }
        },
        created () {
            this.getDetail()
        },
        mounted () {
            this.getProjectList()
            this.getEnvList()
        },
        methods: {
            async getDetail () {
                const uuid = this.$route.query.uuid
                if (uuid) {
                    const data = await this.$http.fetch(detail({
                        uuid
                    }))
                    this.$log.echo(data, 'ci task/form-edit.vue getDetail data', 'log')
                    if (data) {
                        Object.keys(modelData()).forEach((key) => {
                            this.formData[key] = data.detail[key]
                        })
                        this.getEnvList()
                    }
                }
            },
            async getProjectList () {
                const data = await this.$http.fetch(pList())
                if (data) {
                    this.projectList = data.list
                }
            },
            async getEnvList () {
                const data = await this.$http.fetch(envList({
                    ci_project_uuid: this.formData.ci_project_uuid
                }))
                if (data) {
                    this.envList = data.list
                }
            },
            async onSure () {
                // this.$message.info('点击确定关闭弹框')
                this.$log.echo(this.formData, 'ci-task form-edit onSure this.formData', 'log')
                await this.onSave()
                // this.$refs.itDialogContainer.hide()
            },
            async onSave () {
                const formData = this.formData.uuid ? update(this.formData) : add(this.formData)
                const data = await this.$http.fetch(formData)
                if (data) {
                    this.$message.success('操作成功')
                    this.$router.push('/ci/task/list')
                }
            },
            onChangeProject (val) {
                this.$log.echo(val, 'ci form-edit.vue onChangeProject val', 'log')
                this.getEnvList()
            },
            onAddStep (stepIndex) {
                // this.formData.step_list.push(stepItem())
                this.formData.step_list.splice(stepIndex + 1, 0, stepItem())
                // if (stepIndex === this.formData.step_list.length - 1) {
                //     this.formData.step_list.push(stepItem())
                // } else {
                //     this.formData.step_list.splice(stepIndex + 1, 0, stepItem())
                // }
            },
            onRemoveStep (stepIndex) {
                this.formData.step_list.splice(stepIndex, 1)
            }
        }
    }
</script>

<style lang="less">
    .task-form-edit{
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 20px 200px 0 100px;
        .step-item-mg{
            margin: 0 10px;
        }
        .step-item-add{
            float: right;
            margin-left: 10px;
        }
        .step-item-command{
            margin-top: 6px;
            margin-bottom: 26px;
        }
        .step-list{
            .el-form-item__content{
                line-height: 26px;
            }
        }
        .code-mirr-item{
            border: 1px solid #ddd;
            height: 100px;
        }
        .vue-codemirror-wrap,
        .cm-s-material-darker.CodeMirror{
            height: 160px;
        }
    }
</style>
