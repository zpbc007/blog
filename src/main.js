// The Vue build version to load with the `import` command
import root from './components/root-comp.vue'
// import './assets/css/base.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Vue from 'vue'
// import router from './router/index'
// import store from './vuex/store'

Vue.use(iView)
const app = new Vue({
    el: '#app',
    // router,
    // store,
    data: function () {
        return { username: 'demo用户' }
    },
    components: { 
        'root-comp': root
    }
}).$mount('#app')

app.$Message.config({
    top: 120,
    duration: 3
})
