<template>
    <div
        class="build-result">
        <div class="build-topbar">
            <el-button icon="el-icon-arrow-left" @click="onBack">返回</el-button>
        </div>
        <div class="task-info">
            任务名称：<span>{{ taskDetail.name }}</span>
            <el-divider></el-divider>
        </div>
        <codemirror
            class='codemirror-item'
            :value="detail.content"
            :options='options'></codemirror>
    </div>
</template>

<script>
    import {
        codemirror
    } from 'vue-codemirror-lite'
    import 'codemirror/mode/shell/shell'
    import 'codemirror/theme/material-darker.css'

    export default {
        name: 'ci-build-result',
        components: {
            codemirror
        },
        computed: {},
        data () {
            return {
                options: {
                    mode: 'shell',
                    theme: 'material-darker',
                    lineNumbers: true,
                    lineWrapping: true
                },
                ruleData: {}
            }
        },
        props: {
            detail: {},
            taskDetail: {}
        },
        mounted () {
            // this.connectWs()
        },
        methods: {
            async onExecStep () {
                this.taskDetail.step_list = JSON.parse(this.taskDetail.step_list)
                this.taskDetail.step_list.forEach((step, index) => {
                    this.taskDetail.step_list[index].command_list = step.command.split('\n')
                })
                this.$log.echo(this.taskDetail.step_list, 'ci task/build-result.vue onExecStep this.taskDetail.step_list', 'log')
                const data = await this.$http.fetch({
                    method: 'post',
                    data: {
                        uuid: this.detail.uuid,
                        ci_project_uuid: this.taskDetail.ci_project_uuid,
                        git_url: this.taskDetail.git_url,
                        branch: this.taskDetail.branch,
                        step_list: this.taskDetail.step_list
                    }
                }, {
                    url: '/execApi/brociapi/ci/tasks?key=3EOv6kHMu5XNEDLt1s'
                })
                this.$log.echo(data, 'ci task/index.vue onExecStep data', 'log')
            },
            async connectWs () {
                // this.onExecStep()
                const ws = new WebSocket(`wss://gitea.ittlr.com/brociapi/wss/ws/?ci_project_uuid=${this.taskDetail.ci_project_uuid}&uuid=${this.detail.uuid}`)
                console.log('ws', ws)
                ws.onopen = () => {
                    console.log('onopen')
                    this.onExecStep()
                }
                ws.onmessage = (evt) => {
                    console.log('onmessage', JSON.parse(evt.data))
                    const msgData = JSON.parse(evt.data)
                    const msgList = msgData.message.step_list
                    let allMsg = msgList[msgList.length - 1].output
                    console.log('allMsg', allMsg)
                    this.detail.content = allMsg.join('\n')
                }
                ws.onclose = () => {
                    console.log('onclose')
                }
            },
            onBack () {
                this.$emit('onBack')
            }
        }
    }
</script>

<style lang="less">
    .build-result{
        width: 100%;
        height: 100%;
        padding: 20px 100px;
        overflow: auto;
        .vue-codemirror-wrap,
        .cm-s-material-darker.CodeMirror{
            min-height: 500px;
        }
        .build-topbar{
            margin-bottom: 10px;
        }
        .task-info{
            margin: 20px 0;
        }
    }
</style>
