export default {
    state: {
        personalisLoad: ''
    },
    //mutations对象是函数，默认传值是state，也就是上面的state，所以可以直接操作state.count怎么用呢，很简单，比如页面有一个按钮，点击改变state的count:<a href="javascript:;" @click="$store.commit('Count ')">click</a>
    mutations: {
        Count(state, n) {
            state.personalisLoad = n;
        }
    },
    //actions和mutations的写法一样，都是函数，但是actions的默认参数是context，context.commit('Count ')的意思是触发mutations下的Count函数,html:<a href="javascript:;" @click="$store.dispatch('Acount')">click</a>dispatch方法是官方固定触发actions下函数的方法官方推荐 , 将异步操作放在 action 中
    actions: {
        Acount(context, a) {
            context.commit('Count', a)
        }
    },
    getters: {
        // ...
        doneTodosCount: (state, getters) => { //接收上一个流程 并且return出去 让其他所有组件 都有资格取
            return state.personalisLoad;
        }
    }

}