//分页
Vue.component('yh-saas-dialog', {
    template: `<div class="page-warp">
                    这是一个弹框
                </div>`,
    data: function () {
        return {
           
        }
    },
    props: {
        totalCount: 0,
        modelName: {
            type: String,
            default: 'queryModel'
        },
        query: null
    },
    methods: {
        handleSizeChange(val) {
            this.$root[this.modelName]["PageSize"] = val;
            this.query();
            window.scrollTo(0, 0);
        },
        handleCurrentChange(val) {
            this.$root[this.modelName]["PageIndex"] = val;
            this.query(this.totalCount);
            window.scrollTo(0, 0);
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$root[this.modelName]["PageIndex"] = this.PageIndex;
            this.$root[this.modelName]["PageSize"] = this.PageSize;
        });
    }
});