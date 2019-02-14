<template>
  <div id="configPlatform">
    <div class="platform_content">
      <P class="content-box-title">分配给我的活动</P>
      <!-- 选择默认模版，自定义模版 -->
      <div class="trench-btn-box">
        <div class="trench-btn">
          <button
            class="single-trench"
            :class="{ingleTrenchActive: isCheck}"
            @click="singCheck"
            v-for="(item,index) in childModel.flowList"
            :key="index"
            v-if="index==0"
          >{{item.flow_name}}</button>
          <button
            class="much-trench"
            :class="{muchTrenchActive: !isCheck}"
            @click="muchCheck"
            v-for="(item,index) in childModel.flowList"
            :key="index"
            v-if="index==1"
          >{{item.flow_name}}</button>
        </div>
      </div>
      <div class="platform_name">
        <span class="left_line"></span>
        <el-form ref="form" :model="platform" :rules="rules">
          <el-form-item class="select_resouce" label="兑换平台域名" prop="domain" label-width="110px">
            <div>{{platform.domain}}</div>
            <!-- <el-input type="text" v-model="platform.domain" placeholder="www.yuanhui.con"></el-input> -->
          </el-form-item>
        </el-form>
      </div>
      <defaultPlantform
        ref="defaultForm"
        v-if="isCheck && childModel.flowList.length>0"
        :config-model="childModel.flowList[0]"
        @getMessage="getVal"
      ></defaultPlantform>
      <customPlantform
        ref="customForm"
        v-if="!isCheck && childModel.flowList.length>1"
        :config-model="childModel.flowList[1]"
        @getMessage="getVal"
      ></customPlantform>
    </div>
    <!-- 上一步   下一步 -->
    <div class="step-btn">
      <button class="last-step" @click="prevPage">上一步</button>
      <el-button class="next-btn" @click="nextPage()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../../assets/js/http.js";
import page from "../../../../assets/js/page.js";
const defaultPlantform = () =>
  import(/* webpackChunkName:"defaultPlantform" */ "./defaultPlantform");
const customPlantform = () =>
  import(/* webpackChunkName:"customPlantform" */ "./customPlantform");
export default {
  name: "configPlatform",
  props: {
    stepModel: null
  },
  components: {
    defaultPlantform,
    customPlantform
  },
  data() {
    return {
      isCheck: true,
      platform: {
        domain: ""
      },
      page: page,
      dataList: [],
      application: {}, //这个是这个项目所有配置的资源
      no_notic: {
        judge: true,
        name: ""
      }, //识别有没有中奖文案没有配置的
      rules: {
        domain: [
          {
            required: true,
            message: "请输入兑换平台域名",
            trigger: ["blur"]
          },
          {
            pattern: /([a-z0-9][a-z0-9\-]*?\.(?:com|cn|net|org|gov|info|la|cc|co)(?:\.(?:cn|jp))?)$/,
            message: "*请输入正确的平台域名",
            trigger: ["blur"]
          }
        ]
      },
      chindVal: -1, //接收子组件传过来的值，是选取中奖页面1，首页0；
      dataModel: {
        isshow: false,
        step: 1, //进入到兑奖平台的下一个步骤
        shownum: 1,
        homeShow: false, //首页要隐藏
        template_id: "",
        app_id: ""
      },
      childModel: {
        flow_id: "",
        flowList: []
      } //子组件数据
    };
  },
  mounted() {
    this.dataModel.template_id = this.$getsessionStorage("template_id");
    this.dataModel.app_id = this.$getsessionStorage("appid");
    this.page.pageIndex = 1;
    this.page.pageSize = 100;

    apiSetting.getFlowList.page = this.page; //api接口分页赋值
    apiSetting.getFlowList.dataList = this.dataList; //api分页数据赋值
    this.getAppTemplateinfo();
    this.getlist();
  },
  methods: {
    getVal(msg) {
      //msg就是传过来的数据了  这只是个形参  名字可以随意
      this.chindVal = msg; //然后将数据赋值给chindVal
    },
    getlist() {
      return new Promise((resolve, reject) => {
        httpServer(apiSetting.getMidMaterialAllotNoticePrizes, {
          template_id: this.$getsessionStorage("template_id")
        })
          .then(response => {
            this.application = response;
            for (var i = 0; i <= this.application.length - 1; i++) {
              // console.log(this.application[i]);
              //   只有平台码才可以
              if (this.application[i].grant_type == 1) {
                if (
                  this.application[i].prize_title == null ||
                  this.application[i].prize_explain == null
                ) {
                  this.no_notic.judge = false;
                  this.no_notic.name = this.application[i].material_name;
                  break;
                } else {
                  this.no_notic.judge = true;
                }
                console.log(
                  "一进来获取的资源列表",
                  this.application[i].prize_title
                );
              }
            }
            resolve("请求成功后异步写法");
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      });
    },
    prevPage() {
      switch (this.$getsessionStorage("chooseName")) {
        case "directpurchase":
          // this.$router.push({ name: "directBuyResouce" });
          this.$router.push({ name: "newConfigResouce" });

          break;
        case "exchange":
          this.$router.push({ name: "configResouce" });
          break;
      }
      this.dataModel.shownum = 2;
      this.dataModel.step = 3; //步骤第四部
      this.$emit("changeStep", this.dataModel);
    },
    nextPage() {
      this.getlist().then(response => {
        //   此处判断资源没有配置中奖文案说明
        if (this.no_notic.judge == false) {
          //   调用 子组件defaultForm点击中奖页面的方法
          if (
            this.isCheck &&
            this.childModel.flowList.length > 0 &&
            this.chindVal != 1
          ) {
            this.$refs.defaultForm.changeTab(1); //调用子页面的点击中奖页面的方法
            console.log("子组件传过来的--默认", this.childModel.flowList);
          }
          //   调用 子组件customForm点击中奖页面的方法
          if (
            !this.isCheck &&
            this.childModel.flowList.length > 1 &&
            this.chindVal != 1
          ) {
            this.$refs.customForm.changeTab(1); //调用子页面的点击中奖页面的方法
            console.log("子组件传过来的--自定义", this.childModel.flowList);
          }
          this.$message({
            message: `请编辑${this.no_notic.name}的中奖文案`,
            duration: 2000
          });
          return false;
        }
        if (!this.isCheck) {
          let res = this.$refs.customForm.next();
          console.log("res:" + res);
          if (res == false) return false;
        }
        if (this.isCheck) {
          let res = this.$refs.defaultForm.next();
          console.log("res:" + res);
          if (res == false) return false;
        }
        this.$router.push({
          name: "preview",
          query: { tabName: "configPlatform" }
        });
      });
    },
    // 默认模版 按钮
    singCheck() {
      this.isCheck = true;
      this.chindVal = -1; //重置存起来的值
    },
    // 自定义模版 按钮
    muchCheck() {
      this.isCheck = false;
      this.chindVal = -1; //重置存起来的值
    },
    // 修改域名
    blurDomain(e) {
      console.log(e);
    },
    // 获取项目信息填充域名
    getAppTemplateinfo() {
      // 根据id获取基本信息
      httpServer(apiSetting.getAppTemplate, {
        id: this.dataModel.template_id
      })
        .then(response => {
          this.platform.domain = response.domainurl;
          this.childModel.flow_id = response.flow_id;
          this.getFlowList();
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    getFlowList() {
      // 根据id获取基本信息
      httpServer(apiSetting.getFlowList, {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
        .then(response => {
          this.dataList = apiSetting.getFlowList.dataList;
          this.dataList.forEach(x => {
            if (x.flow_remark == "兑换平台流程") {
              this.childModel.flowList.push(x);
            }
          });
          if (this.childModel.flowList.length > 0) {
            if (
              this.childModel.flowList[0].id == this.childModel.flow_id &&
              this.childModel.flowList[0].flow_name.indexOf("默认") > -1
            ) {
              this.isCheck = true;
            } else {
              this.isCheck = false;
            }
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    }
  }
};
</script>
<style lang="less" scoped>
#configPlatform {
  .platform_content {
    padding: 20px 0px;
    width: 900px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    margin-bottom: 20px;
    .content-box-title {
      padding: 0px 20px;
    }
    .trench-btn-box {
      width: 100%;
      border-bottom: 2px #ecedef solid;
      padding: 30px 0px;
      .trench-btn {
        margin: 0 auto;
        width: 350px;
        height: 32px;
        position: relative;
        button {
          outline: none;
          position: absolute;
          width: 180px;
          height: 32px;
          background-color: #e4e4e4;
          border-radius: 6px;
        }
        .single-trench {
          left: 0;
          top: 0;
        }
        .much-trench {
          right: 0;
          top: 0;
        }
        .ingleTrenchActive {
          z-index: 2;
          color: #fff;
          background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
          box-shadow: 3px 0px 5px 0px rgba(126, 67, 224, 0.37);
        }
        .muchTrenchActive {
          z-index: 2;
          color: #fff;
          background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
          box-shadow: -3px 0px 5px 0px rgba(126, 67, 224, 0.37);
        }
      }
    }
    .platform_name {
      margin-top: 20px;
      .el-input {
        width: 200px;
      }
      .left_line {
        display: block;
        width: 4px;
        height: 16px;
        line-height: 40px;
        background-color: #4a00e0;
        float: left;
        margin-top: 13px;
        margin-left: 20px;
      }
    }
  }
}
</style>
<style lang="less">
#configPlatform {
  .select_resouce {
    .el-form-item__content {
      margin-left: 135px !important;
      width: 750px;
      div {
        word-break: break-all;
      }
    }
  }
}
</style>
