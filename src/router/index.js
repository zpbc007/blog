import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

// 列表组价
const docList = resolve => require(['../components/docList/doc-list.vue'], resolve)
const docContainer = resolve => require(['../components/docContainer.vue'], resolve)
const editPage = resolve => require(['../components/editPage.vue'], resolve)

const router = new VueRouter({
    base: '/',
    routes: [
        // 首页
        {
            path: '/',
            name: 'mainPage',
            component: docList,
            meta: {
                title: '主页'
            }
        },
        // 查看页
        {
            path: '/view/:title/:id',
            name: 'viewPage',
            component: docContainer,
            props: true
        },
        // 编辑页
        {
            path: '/config',
            name: 'editPage',
            component: editPage
        }
    ]
})

router.beforeEach((to, from, next) => {
    let title = ''
    if (to.meta.title) {
        title = to.meta.title
    }
    if (to.params.title) {
        title = to.params.title
    }
    document.title = title
    next()
})

export default router