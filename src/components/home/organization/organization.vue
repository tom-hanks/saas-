<template>
  <div id="organization">
    <p class="content-title">
      <span>组织管理</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">组织架构</span>
    </p>
    <!-- 配置流程 -->
    <div v-if="stepModel.isadd" class="config-flow clearfix">
      <div class="config-step">
        <div class="currentStep">1</div>
        <p>{{stepModel.title}}</p>
      </div>
      <div
        class="step-line"
        :class="{ stepLineActive:stepModel.step == 2 || stepModel.step ==3 || stepModel.step ==4 }"
      ></div>
      <div class="config-step config-step-two">
        <div
          :class="{currentStep:stepModel.step == 2 || stepModel.step ==3 || stepModel.step ==4 }"
        >2</div>
        <p>角色配置</p>
      </div>
    </div>
    <div v-if="stepModel.isshow" class="organization_btn">
      <button
        class="member_btn"
        :class="{'member_btn_active':isOrganization ==index}"
        v-for="(item,index) in organization_btn"
        :key="index"
        @click="selectBtn(index)"
      >{{item}}</button>
    </div>
    <div v-if="stepModel.isshow" class="organization_content" v-loading="noShow">
      <!-- <transition name="el-zoom-in-center"> -->
      <framework v-if="step==0" :stepModel="stepModel"></framework>
      <memberlist v-if="step==1" :stepModel="stepModel" @changeStep="changeStep"></memberlist>
      <!-- </transition> -->
    </div>
    <!-- 这里是带进度条的部分 为了白色背景所以必须要加class=organization_content -->
    <div v-if="!stepModel.isshow">
      <addlist v-if="!stepModel.roleSetshow" :stepModel="stepModel" @changeStep="changeStepaddlist"></addlist>
      <roleSet v-if="stepModel.roleSetshow" :stepModel="stepModel" @changeStep="changeStep"></roleSet>
    </div>
  </div>
</template>
<script>
const framework = () =>
  import(/* webpackChunkName:"framework" */ "./framework");
const memberlist = () =>
  import(/* webpackChunkName:"memberlist" */ "./memberlist");
const addlist = () => import(/* webpackChunkName:"addlist" */ "./addlist");
const roleSet = () => import(/* webpackChunkName:"roleSet" */ "./roleSet");
import { httpServer, apiSetting } from "../../../assets/js/http.js";

export default {
  name: "organization",
  components: {
    framework,
    memberlist,
    addlist,
    roleSet
  },

  data() {
    return {
      organization_btn: ["组织架构", "成员列表"],
      noShow: false,
      isOrganization: 0,
      step: 0, //切换tab
      stepModel: {
        isshow: true, //公共按钮显示控制
        isadd: false, //成员列表添加时候的进度
        step: 1, //控制第几及几部显示
        roleSetshow: false, //角色配置开关
        title: "",
        formLabelAlign: "",
        buttonPower: null,
        organizationbutton: null
      }
    };
  },
  mounted() {
    console.log("kiven");
    console.log(this.$route.path);

    //获得菜单按钮权限列表，并解析出组织架构的按钮权限
    httpServer(apiSetting.getMenus)
      .then(response => {
        console.log("权限？");
        console.log(response.menu_node_models);
        response.menu_node_models.forEach(v => {
          if (v.item.menu_name == "组织管理") {
            v.children_node.forEach(x => {
              if (
                x.item.menu_name == "组织架构" &&
                x.item.menu_url == "/organization"
              ) {
                this.stepModel.buttonPower = x.children_node;
              }
            });
          }
        });
        // console.log("response:" + JSON.stringify(response));
      })
      .catch(error => {
        // alert(error)

        console.log(error); //loading层关闭
      });
    //  获取按钮权限列表请求，接口已经删除，不再使用
    // httpServer(apiSetting.buttonPower,{
    //     menuUrl:this.$route.path
    // })
    //   .then(response => {
    //       console.log('kiven==')
    //       this.stepModel.buttonPower=response;
    //     console.log(this.stepModel)
    //   })
    //   .catch(error => {
    //     console.log(error); //loading层关闭
    //   });
  },
  methods: {
    selectBtn(index) {
      this.isOrganization = index;
      this.step = index;
    },
    changeStep(stepModel) {
      //    console.log('-----')
      //   console.log(stepModel)
      this.stepModel.isshow = stepModel.isshow; //配置步骤
      this.stepModel.isadd = stepModel.isadd; //配置步骤
      this.stepModel.roleSetshow = stepModel.roleSetshow; //新增用户的第二个步骤 角色配置 的显示隐藏
      this.stepModel.userid = stepModel.userid;
      // this.stepModel.formLabelAlign=stepModel.formLabelAlign;
      // this.stepModel = stepModel.title; //点击编辑进来的 和 点击修改 进来的不一样的文案，在步骤进度那里
      this.stepModel.formLabelAlign = stepModel.formLabelAlign;
      //  console.log('--我是总组件-最后--')
      //   console.log(this.stepModel)
      Object.assign(this.stepModel, stepModel);
    },
    changeStepaddlist(stepModel) {
      //  console.log(stepModel)
      this.stepModel.isshow = stepModel.isshow; //配置步骤
      this.stepModel.isadd = stepModel.isadd; //配置步骤
      this.stepModel.roleSetshow = stepModel.roleSetshow; //新增用户的第二个步骤 角色配置 的显示隐藏
      // this.stepModel.real_name = stepModel.real_name;
      this.stepModel.formLabelAlign = stepModel.formLabelAlign;
      //  console.log('--我是总组件---')
      //   console.log(this.stepModel)
    }
  }
};
</script>
<style scoped lang="less">
body .content .config-flow {
  width: 560px;
  margin: 0 auto;
  .config-step {
    margin-right: 0px;
  }
  .config-step-two {
    float: right;
  }
}
body .content .config-flow .step-line {
  width: 308px;
  left: 125px;
}
.organization_btn {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  button {
    width: 136px;
    height: 36px;
    background-color: #fff;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    color: #393c40;
    font-size: 14px;
    cursor: pointer;
  }
  .member_btn {
    margin-right: 30px;
  }
  .member_btn_active {
    background-image: linear-gradient(42deg, #4a00e0 0%, #8d2de2 100%);
    box-shadow: 0px 2px 15px 0px rgba(74, 0, 224, 0.35);
    color: #fff;
  }
}
</style>

