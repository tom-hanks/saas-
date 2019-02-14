// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import axios from "axios";
import router from './router';
import echarts from 'echarts'
import $ from 'jquery'
require('!style-loader!css-loader!less-loader!./assets/css/sprite-base.less');
require('vue2-animate/dist/vue2-animate.min.css');
import 'babel-polyfill'
import './assets/css/common2.css'
// import './assets/css/common.css'
import regexp from './assets/js/regexp.js'
import './assets/js/page.js'
import './assets/js/dateformat.js'
import common from './assets/js/common.js'
import customState from './assets/js/customState.js' //统一管理状态
import store from './store/index' //vuex的入口管理
//增加公共过滤 filter
import vueFilter from './assets/js/filter.js'
for (let key in vueFilter) {
    Vue.filter(key, vueFilter[key])
}
//公共函数或者方法
Vue.use(common)

//传值
Vue.prototype.$eventBus = new Vue();

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.prototype.$axios = axios;
// Vue.prototype.$customState = customState;
// Vue.prototype.$echarts = echarts;
// Vue.prototype.$regexp = regexp;//注册公共正则

// 注册组件的方法
Object.assign(Vue.prototype,
    {
        $axios: axios,
        $customState: customState,
        $echarts: echarts,
        $regexp: regexp //注册公共正则
    }
)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //加入store对象 vuex
    components: { App },
    template: '<App/>'
})