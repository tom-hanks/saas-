import Vue from 'vue'
import vuex from 'vuex'
// import state from './state'

Vue.use(vuex);
import HeadeStore from './heade';//引入刚才的heade.js
import ContentStore from './content';//引入刚才的heade.js

// import PersonalStore from './personal'; //引入personal.js，把它抽离出来，以免项目变大的时候分文件管理状态

// export default new vuex.Store({
//     modules: {
//         Personal: PersonalStore
//     }
// })
export default new vuex.Store({
    modules: {
        Heade: HeadeStore,
        Content: ContentStore
    }
})