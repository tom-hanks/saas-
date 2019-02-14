<template>
  <div id="flow">
    <div class="content-box">
      <P class="content-box-title">流程设置</P>
      <div class="select-flow" v-for="(item,index) in dataList" :key="index">
        <div class="check-btn">
          <input
            type="checkbox"
            :class="{checkedType:dataModel.flowid==item.id || (dataModel.flowid==0 && index==0)}"
            :checked="{isCheck:dataModel.flowid==item.id || (dataModel.flowid==0 && index==0)}"
            @click="choose(item.id)"
          >
          <p>{{item.flow_name}}</p>
        </div>
        <div
          class="flow-box"
          :class="{flowBoxChecked:dataModel.flowid==item.id || (dataModel.flowid==0 && index==0)}"
          @click="choose(item.id)"
        >
          <div class="flow-step-box">
            <div class="flow-box-img" v-for="(page,pd) in item.mid_pages" :key="pd">
              <div class="imgAndTitle">
                <img src="../../../assets/images/images/home.png" :alt="'第'+pd+'步'" v-if="true">
                <!-- <img :src="'/images'+page.image" :alt="'第'+pd+'步'" > -->
                <p>
                  <span>0{{(pd+1)}}</span>
                  {{page.page_name}}
                </p>
              </div>
              <div class="flow-box-line" v-if="pd!=3"></div>
            </div>
          </div>
          <p class="bottom-line"></p>
        </div>
      </div>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button @click="prev">上一步</button>
      <button class="next-btn" @click="setPage">下一步</button>
    </div>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import page from "../../../assets/js/page.js";
export default {
  name: "flow",
  props: {
    stepModel: {
      //父组件home.vue传入
      step: 2, //下一步
      appid: 0, //项目ID
      flowid: 0, //流程ID
      pageid: 0 //页面ID
    }
  },
  components: {},
  data() {
    return {
      // 是否选中
      isCheck: false,
      dataModel: {
        appid: 0,
        flowid: 0,
        step: 3,
        pageid: 0, //页面ID
        typename: "", //存点击是那个导航 步骤进度里就显示是哪个的名字
        numname: "",
        app_name: "", //项目名称
        app_external_name: "", //活动名称
        homeShow: false, //首页的列表显示
        real_name: "",
        selectActive: {
          isshow: false, //上传小票的控制父级的显示隐藏
          shownum: 1
        },
        exchange_stepModel: {
          isshow: false
        }
      },
      dataList: [], //列表数据绑定
      page: page, //分页
      typeid: 0, //项目类型：上传小票、抽奖、一物一码
      loading: false //是否内容区域加载，v-loading='loading' 绑定，在请求前设为true，请求完成或失败后设为false
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.dataModel.appid = this.stepModel.appid;
    this.dataModel.typename = this.stepModel.typename;
    this.page.pageSize = 100; //修改每页显示数
    //分页调用的获取列表方法
    this.page.query = () => {
      this.getList();
    };
    apiSetting.getFlowList.page = this.page; //api接口分页赋值
    apiSetting.getFlowList.dataList = this.dataList; //api分页数据赋值
    this.getList(); //获取活动项目列表
  },
  methods: {
    getList() {
      this.loading = true; //loading层打开
      httpServer(apiSetting.getFlowList)
        .then(response => {
          this.loading = false; //loading层关闭
          this.dataList = apiSetting.getFlowList.dataList;
        })
        .catch(error => {
          this.loading = false; //loading层关闭
        });
    },
    choose(id) {
      //选择流程
      if (this.dataModel.flowid != id) {
        this.dataModel.flowid = id;
      }
    },
    setPage() {
      this.dataModel.step = 3;
      this.dataModel.selectActive.shownum = 2;
      //默认选择流程
      if (this.dataModel.flowid == 0) {
        if (this.dataList.length == 0) {
          this.$message.warning("请先选择流程，再进行下一步");
          return false;
        }
        this.dataModel.flowid = this.dataList[0].id;
      }
      this.dataModel.selectActive.isshow = true;
      this.$emit("changeStep", this.dataModel); //传给父页面 home.vue 的changeStep方法
    },
    prev() {
      this.dataModel.step = 1;
      this.dataModel.selectActive.shownum = 2;
      this.dataModel.homeShow = true;
      this.dataModel.selectActive.isshow = false;
      this.$emit("changeStep", this.dataModel); //传给父页面 home.vue 的changeStep方法
    }
  }
};
</script>

<style lang="less" scoped>
.select-flow {
  margin-bottom: 40px;
}
.select-flow .check-btn {
  width: 150px;
  height: 110px;
  float: left;
  text-align: center;
  padding-top: 40px;
}
.select-flow .check-btn input {
  outline: none;
  -webkit-appearance: none;
  display: inline-block;
  width: 36px;
  height: 36px;
  border: solid 2px #5b0ce0;
  border-radius: 50%;
}
.select-flow .check-btn .checkedType {
  background: url(../../../assets/images/images/checked.png) no-repeat;
  background-size: 100% 100%;
}
.select-flow .flow-box {
  width: 675px;
  margin-left: 150px;
  height: 125px;
  padding-top: 25px;
  padding-left: 35px;
  border: solid 3px #d7d7d7;
  box-shadow: 0px 2px 15px 0px #d7d7d7;
}
.select-flow .flow-box .flow-step-box {
  overflow: hidden;
}
.select-flow .flow-box .flow-step-box .flow-box-img {
  text-align: center;
  float: left;
  overflow: hidden;
}
.select-flow .flow-box .flow-step-box .flow-box-img .imgAndTitle {
  float: left;
}
.select-flow .flow-box .flow-step-box .flow-box-img .imgAndTitle img {
  width: 51px;
  height: 54px;
  display: inline-block;
}
.select-flow .flow-box .flow-step-box .flow-box-img .imgAndTitle p {
  padding-top: 20px;
  width: 110px;
  color: #4a4a4a;
}
.select-flow .flow-box .flow-step-box .flow-box-img .imgAndTitle p span {
  padding-right: 5px;
  color: #5c0ce0;
}
.select-flow .flow-box .flow-step-box .flow-box-img .flow-box-line {
  width: 50px;
  height: 50px;
  margin: 0 10px;
  float: left;
  background: url(../../../assets/images/images/nextStep2.png) no-repeat center;
  background-size: 33px 11px;
}
.select-flow .flow-box .bottom-line {
  width: 570px;
  height: 10px;
  margin-left: 40px;
  margin-top: 7px;
  background: url(../../../assets/images/images/blackLine.png) no-repeat center;
  background-size: 100% 100%;
}
.select-flow .flowBoxChecked {
  border: solid 3px #f5efff;
  background-color: #f5efff;
  box-shadow: 0px 2px 15px 0px rgba(73, 0, 221, 0.23);
}
</style>
