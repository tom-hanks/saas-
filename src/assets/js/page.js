let page = {
    dataList: [], //列表数据绑定
    pageSizeList: [10, 20, 30, 40, 50], //每页显示数
    pageSize: 10, //当前选择的每页显示数
    pageIndex: 1, //点击的页面
    pageTotal: 1, //总页面数
    total: 10, //总数
    csw: 0,
    // api:"",     //api接口网址
    query: function () {
        // let _this = this;
        // if (!_this.api) return;
    },
    changeSize: function (val) {
        // alert('sss')
        page.pageIndex = 1;
        page.pageSize = val;
        console.log('我是页码')
        console.log(val)
        page.query();
    },
    gotoPage: function (val) {
        let value = 1;
        if (!val) {
            value = page.pageIndex;
            return;
        } else {
            value = parseInt(val);
        }
        if (value > page.pageTotal) {
            value = page.pageTotal;
        }
        page.pageIndex = value;
        page.query();
    },
    gotoFirst: function () {
        if (page.pageIndex > 1) {
            page.pageIndex = 1;
            page.query();
        }
    },
    gotoPrev: function () {
        if (page.pageIndex > 1) {
            page.pageIndex--;
            page.query();
        }
    },
    gotoNext: function () {
        if (page.pageIndex < page.pageTotal) {
            page.pageIndex++;
            page.query();
        }
    },
    gotoLast: function () {
        if (page.pageIndex != page.pageTotal && page.pageTotal > 0) {
            page.pageIndex = page.pageTotal;
            page.query();
        }
    }
}
export default page;