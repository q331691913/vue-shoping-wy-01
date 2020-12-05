import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
//导入过滤器
import './components/filter/dateFormat.js'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
    //配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false


new Vue({
        router, //路由
        // store, //根实例状态存储,子组件通过 this.$store访问
        render: h => h(App) //App组件渲染,这里的H即是 vm.$createElement,创建虚拟的node
    }).$mount('#app') //mount本质上跟el没啥区别 但是限制 el 不能为 body、html 这类根节点