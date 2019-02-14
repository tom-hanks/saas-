//heade.js
export default {
    state: {
        notific: {},
        count: 0,
        show: false,
        arr: [{ id: 1, name: 'iissoftware', score: 80 },
        { id: 2, name: 'steven', score: 59 },
        { id: 3, name: 'jerry', score: 90 }]

    },
    mutations: {
        notification(state, n) {
            state.notific = n;
        }
    },
    actions: {
        Acount(context) {
            console.log('actions打印', context)
            context.commit('Count', 2)
        },
        Acountnum(context, n) {
            console.log('actions打印', n)
            context.commit('Count', n)
        }
    },
    getters: {
        countAnother: function (state) {
            return !state.show;
        },
        arrList: function (state) {
            return state.arr.map(function (item) {
                return item.score >= 60 ? '及格' : '不及格'
            })
        }
    },
}