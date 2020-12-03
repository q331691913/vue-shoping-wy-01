import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Paramas from '../components/goods/Paramas.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'




import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'

Vue.use(VueRouter)

const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                children: [
                    { path: '/home', redirect: '/welcome' },
                    { path: '/welcome', component: Welcome },
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Paramas },
                    { path: '/goods', component: List },
                    { path: '/goods/add', component: Add }



                ]
            },


        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to将要访问的路径
    //from代表从那个路径跳转而来
    //next 是一个函数 表示放行
    if (to.path === '/login') return next()
        //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router