import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
        router, //路由
        // store, //根实例状态存储,子组件通过 this.$store访问
        render: h => h(App) //App组件渲染,这里的H即是 vm.$createElement,创建虚拟的node
    }).$mount('#app') //mount本质上跟el没啥区别 但是限制 el 不能为 body、html 这类根节点