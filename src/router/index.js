import Vue from 'vue'
import Router from 'vue-router'
//我的活动路由
// import home1 from '../components/home/home1/home1'
const home = () =>
    import( /* webpackChunkName:"home" */ '@/components/home');
// 欢迎页
const helloWorld = () =>
    import( /* webpackChunkName:"helloWorld" */ '@/components/helloWorld');
const activehome = () =>
    import( /* webpackChunkName:"activehome" */ '@/components/home/configureActive/activehome');
// import home2 from '../components/home/home2'
const home2 = () =>
    import( /* webpackChunkName:"home2" */ '@/components/home/home2');
//版本列表
const versionList = () =>
    import( /* webpackChunkName:"versionList" */ '@/components/home/versionList/versionList');
// 组织架构
const organization = () =>
    import( /* webpackChunkName:"organization" */ '@/components/home/organization/organization');
// 活动分配
const activeAllot = () =>
    import( /* webpackChunkName:"activeAllot" */ '@/components/home/activeAllot/activeAllot');
// 管理人员的活动管理
const organActiveManage = () =>
    import( /* webpackChunkName:"organActiveManage" */ '@/components/home/activeAllot/organActiveManage');
// // 项目配置
// const exchange = () =>
// import ( /* webpackChunkName:"exchange" */ '@/components/home/configureActive/exchange/exchange');
//兑换平台   活动预览
const preview = () =>
    import( /* webpackChunkName:"preview" */ '@/components/home/configureActive/exchange/preview');
const exchange = () =>
    import( /* webpackChunkName:"exchange" */ '@/components/home/configureActive/exchange/exchange');
const selectActive = () =>
    import( /* webpackChunkName:"selectActive" */ '@/components/home/configureActive/selectActive');
const configResouce = () =>
    import( /* webpackChunkName:"configResouce" */ '@/components/home/configureActive/exchange/configResouce');
const configPlatform = () =>
    import( /* webpackChunkName:"configPlatform" */ '@/components/home/configureActive/exchange/configPlatform');
//审核管理   活动审核
const activeAudit = () =>
    import( /* webpackChunkName:"activeAudit" */ '@/components/home/activeAudit/activeAudit');
//我的活动    活动管理   
const activeManage = () =>
    import( /* webpackChunkName:"activeManage" */ '@/components/home/activeManage/activeManage');
// 直采项目  资源配置
const directBuyResouce = () =>
    import( /* webpackChunkName:"directBuyResouce" */ '@/components/home/configureActive/directBuy/directBuyResouce');
// 直采项目  资源配置
const newConfigResouce = () =>
    import( /* webpackChunkName:"newConfigResouce" */ '@/components/home/configureActive/directBuy/newConfigResouce');
const statistics = () =>
    import( /* webpackChunkName:"exchangData" */ '@/components/home/dataCount/statistics');
// 数据统计  兑换平台统计
const exchangData = () =>
    import( /* webpackChunkName:"exchangData" */ '@/components/home/dataCount/exchangData');
// 数据统计 数据总览
const dataPandect = () =>
    import( /* webpackChunkName:"dataPandect" */ '@/components/home/dataCount/dataPandect');
// 数据统计详情
const exchangDataDetail = () =>
    import( /* webpackChunkName:"exchangDataDetail" */ '@/components/home/dataCount/exchangDataDetail');
//订单统计  我的订单
const myOrder = () =>
    import( /* webpackChunkName:"myOrder" */ '@/components/home/order/myOrder');
//订单统计  订单总览
const orderPandect = () =>
    import( /* webpackChunkName:"orderPandect" */ '@/components/home/order/orderPandect');
//订单统计  订单详情
const orderDetail = () =>
    import( /* webpackChunkName:"orderDetail" */ '@/components/home/order/orderDetail');
//编辑个人信息
const editPersonal = () =>
    import( /* webpackChunkName:"editPersonal" */ '@/components/home/personal/editPersonal');
//活动管理  添加名单
const addNameList = () =>
    import( /* webpackChunkName:"addNameList" */ '@/components/home/activeManage/addNameList');
//登录
const login = () =>
    import( /* webpackChunkName:"login" */ '@/components/login');

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: "*",
            redirect: "/"
        },

        {
            path: '/',
            components: {
                default: home,
            },
            children: [
                {
                    path: '/',
                    name: 'helloWorld',
                    component: helloWorld
                },
                {
                    path: '/activehome',
                    name: 'activehome',
                    component: activehome,
                    children: [
                        { path: 'exchange', name: 'exchange', component: exchange }, //兑换平台 项目配置
                        { path: 'configResouce', name: 'configResouce', component: configResouce }, //兑换平台 项目配置
                        { path: 'configPlatform', name: 'configPlatform', component: configPlatform }, //兑换平台 项目配置
                        { path: 'preview', name: 'preview', component: preview }, //兑换平台   活动预览
                        { path: 'directBuyResouce', name: 'directBuyResouce', component: directBuyResouce }, // 资源配置
                        { path: 'newConfigResouce', name: 'newConfigResouce', component: newConfigResouce }, // 新的  资源配置
                    ]
                }, //不给的话就匹配不到子组件，就不渲染
                { path: '/home2', component: home2 },
                { path: '/organization', component: organization }, //组织架构
                { path: '/activeAllot', component: activeAllot }, //活动分配
                {
                    path: '/organActiveManage',
                    component: organActiveManage,
                    name: 'organActiveManage'
                }, //管理人员的活动管理
                // { path: '/configureActive/exchange', component: exchange }, //兑换平台 项目配置
                // { path: 'preview', name: 'preview', component: preview }, //兑换平台   活动预览
                { path: '/activeAudit', name: 'activeAudit', component: activeAudit }, //兑换平台   活动审核
                { path: '/activeManage', name: 'activeManage', component: activeManage }, // 直采项目   资源配置
                { path: '/addNameList', name: 'addNameList', component: addNameList }, // 直采项目   添加名单   用完就删
                {
                    path: '/statistics',
                    name: 'statistics',
                    component: statistics,
                    children: [{
                            path: 'exchangData',
                            name: 'exchangData',
                            component: exchangData,
                            meta: {
                                keepAlive: true
                            }
                        }, // 数据统计  兑换平台统计
                        {
                            path: 'dataPandect',
                            name: 'dataPandect',
                            component: dataPandect,
                            meta: {
                                keepAlive: true
                            }
                        }, // 数据统计  兑换平台统计
                        {
                            path: 'exchangDataDetail',
                            name: 'exchangDataDetail',
                            component: exchangDataDetail,
                            meta: {
                                keepAlive: false
                            }
                        }, // 数据统计详情
                    ]
                },

                // { path: '/exchangData', name: 'exchangData', component: exchangData }, // 数据统计  兑换平台统计
                // { path: '/exchangDataDetail', name: 'exchangDataDetail', component: exchangDataDetail }, // 数据统计详情
                { path: '/myOrder', name: 'myOrder', component: myOrder, meta: { keepAliveMain: false } }, // 订单统计   我的订单
                { path: '/orderPandect', name: 'orderPandect', component: orderPandect, meta: { keepAliveMain: false } }, // 订单统计   我的订单
                { path: '/orderDetail', name: 'orderDetail', component: orderDetail }, // 订单统计   我的订单
                { path: '/editPersonal', name: 'editPersonal', component: editPersonal }, // 编辑个人信息
                { path: '/versionList', name: 'versionList', component: versionList }, // 版本列表
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: login
        }
    ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
    // 未登录状态；当路由到route指定页时，跳转至login
    window.scrollTo(0, 0); //重置滚动条到底部
    $('.sliding-bar').css({ opacity: 0 });
    // 已登录状态；当路由到login时，跳转至home
    let isLogin = Vue.prototype.getCookie('Authorization'); // 是否登录
    // console.log(to.name)
    if (!isLogin && to.name != 'login') {
        Vue.prototype.delCookie('Authorization');
        next('/login');
    } else {
        next()
    }
});

export default router;