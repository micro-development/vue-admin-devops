<template>
    <el-row>
        <el-alert
                title="令牌说明"
                description="您填写的令牌至少要有读取仓库的权限，如果想提交代码自动触发，需要也给开启webhook权限"
                type="warning"
                :closable="false"
                show-icon>
        </el-alert>
        <br>
        <el-tabs tab-position="left" v-model="tabActive">
            <el-tab-pane name="github" label="GitHub">
                <el-form label-width="100px" v-model="modelData.github">
                    <el-form-item label="API地址">
                        <el-alert
                                title="默认为官方提供：https://github.com/api/v4"
                                type="info"
                                :closable="false"
                                show-icon>
                        </el-alert>
                    </el-form-item>
                    <el-form-item label="API令牌">
                        <el-input v-model="modelData.github.auth_token"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onConnectGithub">连接GitHub</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="gitlab" label="Gitlab">
                <el-form label-width="100px" v-model="modelData.gitlab">
                    <el-form-item label="API地址">
                        <el-alert
                                title="默认为官方提供：https://gitlab.com/api/v4"
                                type="info"
                                :closable="false"
                                show-icon>
                        </el-alert>
                    </el-form-item>
                    <el-form-item label="自建API地址">
                        <el-input placeholder="地址为访问您Gitlab的根地址" v-model="modelData.gitlab.api_custom_url"></el-input>
                    </el-form-item>
                    <el-form-item label="API令牌">
                        <el-input v-model="modelData.gitlab.auth_token"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onConnectGitlab">连接Gitlab</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="gitee" label="Gitee">
                <el-form label-width="100px" v-model="modelData.gitee">
                    <el-form-item label="API地址">
                        <el-alert
                                title="默认为官方提供：https://gitee.com/api/v5"
                                type="info"
                                :closable="false"
                                show-icon>
                        </el-alert>
                    </el-form-item>
                    <el-form-item label="gitee用户名">
                        <el-input v-model="modelData.gitee.username"></el-input>
                    </el-form-item>
                    <el-form-item label="API令牌">
                        <el-input v-model="modelData.gitee.auth_token"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onConnectGitee">连接gitee</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="gitea" label="Gitea">
                <el-form label-width="100px" v-model="modelData.gitea">
                    <el-form-item label="API地址">
                        <el-alert
                                title="默认为官方提供：https://gitea.com/api/v1"
                                type="info"
                                :closable="false"
                                show-icon>
                        </el-alert>
                    </el-form-item>
                    <el-form-item label="自建API地址">
                        <el-input placeholder="地址为访问您gitea的根地址" v-model="modelData.gitea.api_custom_url"></el-input>
                    </el-form-item>
                    <el-form-item label="API令牌">
                        <el-input v-model="modelData.gitea.auth_token"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onConnectGitea">连接gitea</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script>
    import * as gitApi from '../service/git'
    export default {
        name: 'git',
        components: {},
        data () {
            return {
                modelData: {
                    github: {
                        auth_token: ''
                    },
                    gitlab: {
                        api_custom_url: '',
                        auth_token: ''
                    },
                    gitee: {
                        // ittlr
                        username: 'ittlr',
                        auth_token: '4b7f568ff86f2f0f3761e4113bfb0e78'
                    },
                    gitea: {
                        api_custom_url: 'https://gitea.ittlr.com/api/v1',
                        // custom 5247c04c22d9e06f8d07dcb5fbe98a81a8215813
                        auth_token: '5247c04c22d9e06f8d07dcb5fbe98a81a8215813'
                    }
                },
                tabActive: 'gitea'
            }
        },
        watch: {},
        methods: {
            async onConnectGithub () {
                const data = this.modelData.github
                if (!data.auth_token) {
                    this.$message.error('请输入GitHub访问令牌')
                    return
                }
                const result = await this.$http.fetch(gitApi.github(data))
                if (result) {
                    this.$message.success('绑定GitHub成功')
                }
            },
            async onConnectGitlab () {
                const data = this.modelData.gitlab
                if (!data.auth_token) {
                    this.$message.error('请输入Gitlab访问令牌')
                    return
                }
                const result = await this.$http.fetch(gitApi.gitlab(data))
                if (result) {
                    this.$message.success('绑定Gitlab成功')
                }
            },
            async onConnectGitee () {
                const data = this.modelData.gitee
                if (!data.auth_token) {
                    this.$message.error('请输入gitee访问令牌')
                    return
                }
                const result = await this.$http.fetch(gitApi.gitee(data))
                if (result) {
                    this.$message.success('绑定Gitee成功')
                }
            },
            async onConnectGitea () {
                const data = this.modelData.gitea
                if (!data.auth_token) {
                    this.$message.error('请输入gitea访问令牌')
                    return
                }
                const result = await this.$http.fetch(gitApi.gitea(data))
                if (result) {
                    this.$message.success('绑定Gitea成功')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
