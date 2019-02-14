<template>
  <div id="versionList" v-loading="loading">
    <p class="content-title">
      <span>版本信息</span>
    </p>
    <div class="versionList_content">
      <div class="versionList_title">
        <span></span>SaaS平台版本更迭详情
      </div>
      <div class="version">
        <el-collapse accordion @change="changeItem">
          <el-collapse-item :name="index" v-for="(veritem,index) in versionList" :key="index">
            <template slot="title">
              <p>{{veritem.title}}</p>
              <div class="version_time">{{veritem.date}}</div>
              <span class="isShow" v-if="openItem==index && openItem !=''">收起详情</span>
              <span class="isShow" v-if="openItem !=index || openItem==''">展开详情</span>
            </template>
            <div v-html="veritem.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- itemListloading判断是为了阻止分页点击过快做成的bug,注意下面还有样式 -->
    <el-pagination
      :key="Math.random()"
      :style="!no_data?'visibility:visible':'visibility:hidden'"
      :class="itemListloading?'el-paginationshow':'el-paginationhide'"
      v-on:size-change="page.changeSize"
      v-on:current-change="page.gotoPage"
      :current-page="page.pageIndex"
      :page-sizes="page.pageSizeList"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import page from "../../../assets/js/page.js";
export default {
  name: "versionList",
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      openItem: -1,
      showOpenItem: false,
      versionList: {},
      no_data: false,
      itemListloading: true,
      page: page
    };
  },
  created() {
    this.page.pageIndex = 1;
  },
  mounted() {
    let $emit = this;
    $emit.page.pageSize = 5; //修改每页显示数
    $emit.page.pageSizeList = [5, 10, 15, 20]; //修改可以下拉框选择的每页显示数
    this.getVersionList();

    //分页调用的获取列表方法
    $emit.page.query = function() {
      $emit.getVersionList();
    };
    apiSetting.getMilestones.page = this.page; //api接口分页赋值
    apiSetting.getMilestones.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    changeItem(val) {
      console.log(val);
      this.openItem = val;
    },
    getVersionList() {
      httpServer(apiSetting.getMilestones, {
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize
      })
        .then(response => {
          console.log(response.collection);
          this.versionList = apiSetting.getMilestones.dataList;
          if ((this.versionList, length < 0)) {
            this.no_data = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  destroyed() {
    let $emit = this;
    $emit.page.pageIndex = 1;
    $emit.page.pageSize = 5; //修改每页显示数
    $emit.page.pageSizeList = [5, 10, 15, 20]; //修改可以下拉框选择的每页显示数
  }
};
</script>
<style lang="less" scope>
#versionList {
  .versionList_content {
    width: 900px;
    min-height: 480px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);

    .versionList_title {
      line-height: 55px;
      border-bottom: 1px solid #ecedef;
      padding: 0px 20px;
      font-weight: bold;
      span {
        display: block;
        float: left;
        width: 4px;
        height: 14px;
        background-color: #5a0ae0;
        margin-top: 20px;
        margin-right: 10px;
      }
    }
  }
}
</style>
<style>
#versionList .version .el-collapse .el-collapse-item__header {
  line-height: normal;
  padding: 15px 20px;
  height: 50px;
  display: block;
  position: relative;
}
#versionList .version .el-collapse .el-collapse-item__header .version_time {
  width: 120px;
  height: 20px;
  background-color: #d7d7d7;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  line-height: 20px;
  margin-top: 10px;
  font-size: 12px;
}
#versionList .version .el-collapse .el-collapse-item__header .isShow {
  position: absolute;
  right: 50px;
  top: 28px;
}
#versionList
  .version
  .el-collapse
  .el-collapse-item__header
  .el-icon-arrow-right {
  position: absolute;
  right: 20px;
  top: 32px;
}
#versionList .version .el-collapse .el-collapse-item__wrap {
  padding-left: 20px;
}
</style>
