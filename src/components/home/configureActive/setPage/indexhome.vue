<template>
  <div id="index">
    <div>
      <!-- 左侧手机预览 -->
      <div class="phoneImg">
        <h3>玛氏冲击波</h3>
        <div class="block-phone-img">
          <div class="phone-header">
            <p>{{indexHomeForm.actName}}</p>
          </div>
          <!-- 首页 -->
          <div class="phone-box" v-if="selectTabId==0">
            <div v-if="indexHomeForm.kefuValue" class="kefu"></div>
            <!-- banner -->
            <div class="banner"></div>
            <div v-if="indexHomeForm.textValue" class="textarea">{{indexHomeForm.actTaxt}}</div>
            <div class="activeBtnBox">
              <button
                class="go-active-btn"
                :class="[{sumberBtn:isSummer},{NewYearBtn:isNewYear}]"
              >参与活动</button>
              <button
                class="active-rules"
                :class="[{sumberRuls:isSummer},{NewYearRuls:isNewYear}]"
              >活动细则</button>
            </div>
          </div>
        </div>
        <div class="tab-btn">
          <button class="pre-btn"></button>
          <span></span>
          <button class="next-btn"></button>
        </div>
      </div>
      <!-- 右侧信息配置 -->
      <div class="home-msg">
        <!-- 首页 -->
        <div class="home-configuration" v-if="selectTabId==0">
          <el-form
            :model="indexHomeForm"
            :rules="indexHomeRules"
            ref="indexHomeForm"
            class="indexHomeForm"
          >
            <el-form-item>
              <p class="img-title">
                背景图上传
                <span>
                  （
                  <i>*</i>点击上传图片，图片尺寸为750*1206）
                </span>
              </p>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleSuccess"
                :data="uploadParam"
              >
                <img v-if="iconUrl" :src="iconUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <p class="img-title">主题风格：</p>
              <ul class="style-list">
                <li
                  :class="{checkedStyle: selectStyleId == index}"
                  v-for="(Sitem,index) in styleList"
                  :key="index"
                  @click="selectStyle(index)"
                >
                  {{Sitem}}
                  <i></i>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="活动名称：" class="actName" prop="actName">
              <el-input
                v-model="indexHomeForm.actName"
                maxlength="10"
                type="text"
                placeholder="填写活动名称，建议不超过10字"
              ></el-input>
            </el-form-item>
            <el-form-item label="活动文案：" prop="actTaxt">
              <el-switch
                v-model="indexHomeForm.textValue"
                active-color="#13ce66"
                inactive-color="#AAAAAA"
              ></el-switch>
              <el-input
                v-if="indexHomeForm.textValue"
                v-model="indexHomeForm.actTaxt"
                maxlength="100"
                type="textarea"
                placeholder="请填写活动文案，不能超过100词"
              ></el-input>
            </el-form-item>
            <el-form-item label="活动细则：" prop="detailedRule">
              <i class="el-icon-view">预览</i>
              <el-input
                v-model="indexHomeForm.detailedRule"
                maxlength="1000"
                type="textarea"
                placeholder="请填写活动相关细则，不能超过1000词"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="open-kefu">
                <p class="img-title">活动客服：</p>
                <el-switch
                  v-model="indexHomeForm.kefuValue"
                  active-color="#13ce66"
                  inactive-color="#AAAAAA"
                ></el-switch>
              </div>
            </el-form-item>
            <el-form-item label="客服链接：" prop="link" class="actName" v-if="indexHomeForm.kefuValue">
              <el-input v-model="indexHomeForm.link" maxlength="50" type="text" placeholder="填写链接"></el-input>
            </el-form-item>
          </el-form>
          <div class="set-next-page">配置下一项</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  props: {},
  data() {
    return {
      selectTabId: 0,
      value1: "",
      value2: "",
      // 首页自定义的表单
      indexHomeForm: {
        // 活动名称
        actName: "",
        // 活动文案
        actTaxt: "",
        // 活动细则
        detailedRule: "",
        // 客服链接
        link: "",
        textValue: true,
        kefuValue: true
      },
      // 首页自定义的表单  验证
      indexHomeRules: {
        actName: [
          {
            required: true,
            message: "请填写活动名称",
            trigger: "change"
          }
        ]
      },
      // 风格列表
      styleList: ["默认", "缤纷夏日", "新春快乐", "萌萌大作战"],
      // 选择风格
      isSummer: false,
      isNewYear: false,
      app: {
        app_name: "",
        app_domain_test: "",
        login_time: new Date(2000, 10, 10, 10, 10),
        logout_time: new Date(2000, 10, 10, 10, 10)
      }, //活动项目
      channelList: [], //渠道列表
      appTemplateList: [], //模板列表
      flowRuleList: [], //流程列表
      appThemeList: [], //主题风格列表
      appElementList: [], //页面元素列表
      midTemplate: {
        //模板实体
        id: 0,
        app_id: "",
        flow_id: "",
        theme_id: "",
        channel_type: 0,
        channelid: "",
        channel: "",
        offlinetime: "",
        onlinetime: "",
        domainurl: "",
        cur_pageno: "",
        styles_id: "",
        midPageElementInfos: []
      },
      //shop项目上下线时间
      offlinetime: new Date(2000, 10, 10, 10, 10),
      onlinetime: new Date(2000, 10, 10, 10, 10),
      midPageElementInfo: {
        //页面数据
        id: 0,
        app_id: "",
        template_id: "",
        page_id: "",
        element_id: "",
        elementvalue: "",
        remarks: ""
      },
      childList: [],
      thisChannel: {},
      isDialog: false,
      isCheck: true,
      selectTrenchId: 0,
      openList: "展开",
      isOpen: false,
      uploadUrl: "http://www.baidu.com/",
      uploadParam: {},
      iconUrl: "",
      // 风格列表
      selectStyleId: 0
    };
  },
  mounted() {},
  methods: {
    // 选择风格
    selectStyle: function(index) {
      this.selectStyleId = index;
      if (index == 1) {
        this.isSummer = true;
        this.isNewYear = false;
      } else if (index == 2) {
        this.isNewYear = true;
        this.isSummer = false;
      } else {
        this.isNewYear = false;
        this.isSummer = false;
      }
    },
    //  展开列表
    trenchOpen: function() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.openList = "收起";
      } else {
        this.openList = "展开";
      }
    },
    // 上传成功
    handleSuccess: function() {}
  }
};
</script>
<style scoped lang="less">
@import "../../../../assets/css/setPage.css"; /*引入公共样式*/
#index {
  .activeBtnBox {
    position: absolute;
    bottom: 20px;
    width: 100%;
  }
  .indexHomeForm {
    .el-form-item {
      margin-bottom: 10px;
      .el-icon-view {
        color: #f4a13e;
        cursor: pointer;
      }
    }
    .actName {
      margin-top: 10px;
      // margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less">
#index {
  .indexHomeForm {
    .actName {
      .el-input__inner {
        background: #fff;
        border: 1px #dcdfe6 solid;
        text-indent: 0px;
      }
      .el-input__inner:focus {
        border-color: #996aec;
      }
    }
    .el-textarea__inner:focus {
      border-color: #996aec;
    }
  }
}
</style>