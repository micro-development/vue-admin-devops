<template>
    <it-dialog-container
        :native='dialogInfo'
        ref="itDialogContainer">
        <el-form :model="formData" status-icon :rules="ruleData" ref="formData" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="labelConfig.ci_project_uuid" prop="ci_project_uuid">
                <el-select
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
            <el-form-item :label="labelConfig.remote_host" prop="remote_host">
                <el-input
                    :placeholder="placeholder.remote_host"
                    v-model="formData.remote_host"
                    auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="labelConfig.remote_port" prop="remote_port">
                <el-input
                    :placeholder="placeholder.remote_port"
                    v-model="formData.remote_port"
                    auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="labelConfig.remote_user" prop="remote_user">
                <el-input
                    v-model="formData.remote_user"
                    auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="labelConfig.remote_passwd" prop="remote_passwd">
                <el-input
                    v-model="formData.remote_passwd"
                    auto-complete="off"
                    type="password"></el-input>
            </el-form-item>
        </el-form>
        <it-dialog-footer
            slot="it-dialog-footer"
            :btn-list="btnList"
            @onCancel="onCancel"
            @onSure="onSure"></it-dialog-footer>
    </it-dialog-container>
</template>

<script>
    import { add, update } from '../../service/env'
    import { list as pList } from '../../service/project'
    const modelField = ['uuid', 'ci_project_uuid', 'name', 'remote_host', 'remote_port', 'remote_user', 'remote_passwd']
    const modelData = () => {
        return {
            uuid: '',
            ci_project_uuid: '',
            name: '',
            remote_host: '192.168.1.1',
            remote_port: '22',
            remote_user: 'test',
            remote_passwd: 'aaaaaa'
        }
    }

    export default {
        name: 'form-edit',
        data () {
            return {
                dialogInfo: {
                    title: '新增环境'
                },
                projectList: [],
                placeholder: {
                    ci_project_uuid: '请选择项目',
                    name: '例如：测试环境/生产环境',
                    remote_host: '例如：192.168.1.11',
                    remote_port: '例如：22',
                    remote_user: '例如：www',
                    remote_passwd: '例如：123456'
                },
                labelConfig: {
                    ci_project_uuid: '所属项目',
                    name: '环境名称',
                    remote_host: '主机名',
                    remote_port: '主机端口',
                    remote_user: '主机用户',
                    remote_passwd: '主机密码'
                },
                ruleData: {},
                formData: modelData(),
                btnList: [
                    {
                        name: '保存',
                        type: 'primary',
                        method: 'onSure'
                    },
                    {
                        name: '取消',
                        event: 'close',
                        method: 'onCancel'
                    }
                ]
            }
        },
        props: {
            detail: {}
        },
        mounted () {
            this.getProjectList()
        },
        methods: {
            async getProjectList () {
                const data = await this.$http.fetch(pList())
                if (data) {
                    this.projectList = data.list
                }
            },
            onOpenDialog () {
                this.$log.echo(this.detail, 'project/form-edit.vue onOpenDialog model', 'log')
                this.formData = modelData()
                this.formData.ci_project_uuid = this.$route.params.project_uuid
                this.$nextTick(() => {
                    if (this.detail) {
                        modelField.forEach((key) => {
                            this.formData[key] = this.detail[key]
                        })
                    }
                })
                this.$refs.itDialogContainer.show()
            },
            async onSure () {
                // this.$message.info('点击确定关闭弹框')
                this.$log.echo(this.formData, 'ci-project form-edit onSure this.formData', 'log')
                await this.onSave()
                // this.$refs.itDialogContainer.hide()
            },
            async onSave () {
                const formData = this.formData.uuid ? update(this.formData) : add(this.formData)
                const data = await this.$http.fetch(formData)
                if (data) {
                    this.$message.success('操作成功')
                    this.formData = modelData()
                    this.$refs.itDialogContainer.hide()
                    this.$emit('onSaveFinished')
                }
            },
            onCancel () {
                // this.$message.info('点击取消按钮')
                this.$refs.itDialogContainer.hide()
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
