/**
 * @author yaimeet
 * @date 2019/11/13
 * @Description
 */
const webpack = require('./src/base-resource/vue-admin-common#master/webpack')

// console.log('cloud module vue.config.js webpack', webpack)

module.exports = webpack.init({
    sgPage: {
        title: ' - DevOps'
    },
    port: 8009,
    alias: {
        common: '../vue-admin-common#master',
        basic: '../vue-admin-basic#master'
    }
}).setProxyApi('../../../proxyTarget.js').setProxyList().run()
