<template>
  <div id="home_child3">
    <div class="content-box">
      <P class="content-box-title">页面配置</P>
      <!-- 选择单渠道，多渠道 -->
      <div class="trench-btn-box">
        <div class="trench-btn">
          <button class="single-trench" :class="{ingleTrenchActive: isCheck}" @click="singCheck">单渠道</button>
          <button class="much-trench" :class="{muchTrenchActive: !isCheck}" @click="muchCheck">多渠道</button>
        </div>
      </div>
      <!-- 添加渠道，域名，时间 -->
      <div class="trench-news-box">
        <div class="trench-select" v-if="!isCheck">
          <select name id>
            <option value>沃尔玛</option>
            <option value>家乐福</option>
            <option value>沃尔玛</option>
            <option value>家乐福</option>
          </select>
          <span class="add-btn">添加</span>
        </div>
        <div class="trench-list" v-if="!isCheck">
          <div class="trench-list-open">
            {{openList}}
            <i :class="{openIcon:isOpen}"></i>
          </div>
          <ul>
            <li
              :class="{trenchItemActive: selectTrenchId == index}"
              v-for="(item,index) in trenchList"
              :key="index"
              @click="selectTrench(index)"
            >
              {{item}}
              <span class="delete-btn"></span>
            </li>
          </ul>
        </div>
        <div class="trench-msg">
          <div class="trench-msg-address">
            <div class="address_box">
              <span class="single-trench-name" v-if="isCheck">沃尔玛</span>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
                <el-form-item
                  label="域名"
                  label-width="40px"
                  prop="domainName"
                  class="domainName_input"
                >
                  <el-input v-model="ruleForm.domainName" type="text" placeholder="请输入域名"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" class="active_time">
                  <el-date-picker
                    v-model="ruleForm.timeArray"
                    type="datetimerange"
                    :clearable="false"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="setDateTime"
                    :unlink-panels="unlinkpanels"
                  ></el-date-picker>
                  <br>
                  <span class="overTime">
                    <i>*</i>项目上下线时间为2017-05-04至2018-03-23
                  </span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="setHomePage">
        <ul class="home-tab-list">
          <li
            :class="{homeTabListAvtive: selectTabId == index}"
            v-for="(TabItem,index) in tabList"
            :key="index"
            @click="selectTab(index)"
          >{{TabItem}}</li>
        </ul>
        <!-- <index-home></index-home> -->
        <!-- <phoneNum></phoneNum> -->
        <draw></draw>
      </div>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button @click="prev">上一步</button>
      <button class="next-btn">下一步</button>
    </div>
  </div>
</template>
<script>
const indexHome = () =>
  import(/* webpackChunkName:"indexHome" */ "./setPage/indexhome");
const phoneNum = () =>
  import(/* webpackChunkName:"phoneNum" */ "./setPage/phoneNum");
const draw = () => import(/* webpackChunkName:"draw" */ "./setPage/draw");
export default {
  name: "home-child3",
  props: {
    stepModel: null
  },
  components: {
    indexHome, // 页面配置的第一步    配置首页
    phoneNum, // 页面配置的第二步   手机号上传
    draw // 页面配置的第三步   抽奖
  },
  data() {
    return {
      tabList: ["首页", "手机号＋上传", "抽奖", "其他设置"],
      selectTabId: 0,
      unlinkpanels: true, //关闭时间选择的下拉框的联动
      isCheck: true,
      trenchList: [
        "1.家乐福",
        "2.家乐福",
        "3.家乐福",
        "1.家乐福",
        "2.家乐福",
        "3.家乐福",
        "1.家乐福",
        "2.家乐福",
        "3.家乐福",
        "1.家乐福",
        "2.家乐福",
        "3.家乐福"
      ],
      selectTrenchId: 0,
      openList: "展开",
      isOpen: false,
      value1: "",
      value2: "",
      dataModel: {
        appid: 0,
        flowid: 0,
        step: 3,
        pageid: 0, //页面ID
        typename: "", //存点击是那个导航 步骤进度里就显示是哪个的名字
        numname: "",
        app_name: "", //项目名称
        app_external_name: "", //活动名称
        real_name: "",
        selectActive: {
          isshow: false, //上传小票的控制父级的显示隐藏
          shownum: 1
        },
        exchange_stepModel: {
          isshow: false
        }
      },
      // 单渠道的  域名和有效时间  的表单验证
      ruleForm: {
        domainName: "",
        timeArray: []
      },
      rules: {}
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    this.dataModel.typename = this.stepModel.typename;
  },
  methods: {
    // 页面配置tab切换
    selectTab: function(index) {
      this.selectTabId = index;
    },
    // 单渠道 按钮
    singCheck: function() {
      this.isCheck = true;
    },
    // 多渠道 按钮
    muchCheck: function() {
      this.isCheck = false;
    },
    // 选则具体渠道
    selectTrench: function(index) {
      this.selectTrenchId = index;
    },
    prev() {
      this.dataModel.step = 2;
      this.dataModel.selectActive.shownum = 1;
      this.dataModel.selectActive.isshow = true;
      this.$emit("changeStep", this.dataModel); //传给父页面 home.vue 的changeStep方法
    },
    // 设置活动时间
    setDateTime() {
      // 时间选择器回调
      console.log(this.timeArray);
    }
  }
};
</script>

<style scoped lang='less'>
@import "../../../assets/css/setPage.css"; /*引入公共样式*/
#home_child3 {
  .el-form {
    float: left;
    overflow: hidden;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .active_time {
    float: left;
    .el-date-editor {
      width: 320px;
      .el-range-input {
        background: #f0f0f0;
      }
    }
    .el-range-editor.el-input__inner {
      padding: 0px 10px;
    }
  }
  .domainName_input {
    float: left;
    .el-form-item__content {
      .el-input {
        width: 280px;
      }
    }
  }
}
</style>
<style lang='less'>
#home_child3 {
  .active_time {
    .el-date-editor {
      .el-range-input {
        background: #f0f0f0;
        width: 130px;
      }
      .el-range__close-icon {
        display: none;
      }
    }
  }
}
</style>
