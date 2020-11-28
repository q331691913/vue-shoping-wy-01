import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import axios from 'axios'
Vue.prototype.$http = axios
    //配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
        router, //路由
        // store, //根实例状态存储,子组件通过 this.$store访问
        render: h => h(App) //App组件渲染,这里的H即是 vm.$createElement,创建虚拟的node
    }).$mount('#app') //mount本质上跟el没啥区别 但是限制 el 不能为 body、html 这类根节点