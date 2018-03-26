import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

// 列表组价
const docList = resolve => require(['../components/docList/doc-list.vue'], resolve)
const docContainer = resolve => require(['../components/docContainer.vue'], resolve)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/',
            name: 'mainPage',
            component: docList
        },
        {
            path: '/view/:id',
            name: 'viewPage',
            component: docContainer,
            props: true
        }
    ]
})

export default router