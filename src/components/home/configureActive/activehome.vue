<template>
  <div id="home">
    <!-- 右边的内容区域 -->
    <div class="content1">
      <!-- 面包屑 -->
      <!-- <content-title></content-title> -->
      <p class="content-title">
        <span>{{oneTitletext}}</span>
        <i class="el-icon-arrow-right content-title-jiantou"></i>
        <span class="content-last-title">{{nextTitletext}}</span>
      </p>
      <!-- 配置流程 -->
      <div class="config-flow" v-if="tipTitle">
        <div class="config-step">
          <div class="currentStep">1</div>
          <p
            v-if="stepModel.typename"
          >{{stepModel.type_ename == 'exchange'?'选择活动('+stepModel.typename+')':'选择活动('+stepModel.typename+')'}}</p>
          <p v-if="!stepModel.typename">选择活动</p>
        </div>
        <div
          class="step-line line_one"
          :class="{ stepLineActive:stepModel.step == 2 || stepModel.step ==3 || stepModel.step ==4 }"
        ></div>
        <div class="config-step">
          <div
            :class="{currentStep:stepModel.step == 2 || stepModel.step ==3 || stepModel.step ==4 }"
          >2</div>
          <p
            v-if="stepModel.typename"
          >{{stepModel.type_ename === 'exchange'?'项目配置('+stepModel.typename+')':'流程设置('+stepModel.typename+')'}}</p>
          <p v-if="!stepModel.typename">流程设置</p>
        </div>
        <div
          class="step-line line_two"
          :class="{ stepLineActive: stepModel.step ==3 || stepModel.step ==4 }"
        ></div>
        <div class="config-step">
          <div :class="{currentStep:stepModel.step == 3 || stepModel.step == 4}">3</div>
          <p
            v-if="stepModel.typename"
          >{{stepModel.type_ename == 'exchange'?'资源配置('+stepModel.typename+')':'页面配置('+stepModel.typename+')'}}</p>
          <p v-if="!stepModel.typename">页面配置</p>
        </div>
        <div class="step-line line_three" :class="{ stepLineActive: stepModel.step ==4 }"></div>
        <div class="config-step last_step">
          <div :class="{currentStep:stepModel.step == 4}">4</div>
          <p
            v-if="stepModel.typename"
          >{{stepModel.type_ename == 'exchange'?'平台配置('+stepModel.typename+')':'活动预览('+stepModel.typename+')'}}</p>
          <p v-if="!stepModel.typename">活动预览</p>
        </div>
      </div>

      <router-view></router-view>

      <!-- 首页列表 -->
      <selectActive v-if="stepModel.homeShow" @changeStep="changeStep"></selectActive>

      <!-- 选择活动上传小票=====步骤 -->
      <div v-if="stepModel.selectActive.isshow">
        <flow
          v-if="stepModel.selectActive.shownum == 1"
          @changeStep="changeStep"
          :step-model="stepModel"
        ></flow>
        <setPage
          v-if="stepModel.selectActive.shownum == 2"
          @changeStep="changeStep"
          :step-model="stepModel"
        ></setPage>
      </div>
      <!-- 兑换平台的 =====步骤-->
      <!-- <div v-if="stepModel.exchange_stepModel.isshow">
                <exchange v-if="stepModel.exchange_stepModel.shownum == 1" @changeStep="exchange_changeStep" :step-model="stepModel"></exchange>
                <configResouce v-if="stepModel.exchange_stepModel.shownum == 2" @changeStep="configResouce_changeStep" :step-model="stepModel"></configResouce>
                <configPlatform v-if="stepModel.exchange_stepModel.shownum == 3" @changeStep="configPlatform_changeStep" :step-model="stepModel"></configPlatform>

      </div>-->
    </div>
  </div>
</template>

<script>
// import homeChild1 from './home-child1'
// import homeChild2 from './home-child2'
// import homeChild3 from './home-child3'
const selectActive = () =>
  import(/* webpackChunkName:"selectActive" */ "./selectActive");
const flow = () => import(/* webpackChunkName:"flow" */ "./flow");
const setPage = () => import(/* webpackChunkName:"setPage" */ "./setPage");
const exchange = () =>
  import(/* webpackChunkName:"exchange" */ "./exchange/exchange");
const configResouce = () =>
  import(/* webpackChunkName:"configResouce" */ "./exchange/configResouce");
const configPlatform = () =>
  import(/* webpackChunkName:"configPlatform" */ "./exchange/configPlatform");
export default {
  name: "activehome",
  props: {
    oneTitle: {
      type: String,
      default: "我的活动"
    },
    nextTitle: {
      type: String,
      default: "待配置活动"
    }
  },
  components: {
    selectActive,
    flow,
    setPage,
    exchange,
    configResouce,
    configPlatform
  },
  data() {
    return {
      oneTitletext: "我的活动",
      nextTitletext: "待配置活动",
      stepModel: {
        step: 1, //下一步
        appid: 0, //项目ID
        flowid: 0, //流程ID
        pageid: 0, //页面ID
        typename: "", //存点击是那个导航 步骤进度里就显示是哪个的名字
        type_ename: "", //导航的英文名字
        numname: "", //编号
        app_name: "", //项目名称
        app_external_name: "", //活动名称
        real_name: "", //运营负责人
        login_time: "",
        logout_time: "",
        homeShow: true, //首页的列表显示
        parameter: "", //其它页面带过来的参数
        selectActive: {
          isshow: false, //上传小票的控制父级的显示隐藏
          shownum: 1
        },
        exchange_stepModel: {
          template_id: 0,
          isshow: false, //兑奖平台的控制父级的显示隐藏
          shownum: 1
        }
      },
      tipTitle: true
    };
  },
  beforeCreate() {},
  beforeRouteEnter(to, from, next) {
    console.log("我是导航守卫");
    console.log(to);
    console.log(from);

    if (from.name == "activeAudit") {
      next(vm => {
        vm.oneTitletext = "审核管理";
        vm.nextTitletext = "活动审核";
      });
    } else {
      next(vm => {
        vm.oneTitletext = "我的活动";
        vm.nextTitletext = "待配置活动";
      });
    }
    if (from.name == "activeManage") {
      next(vm => {
        // 这里是活动管理里面没有通过过来修改的判断
        switch (vm.$getsessionStorage("chooseName")) {
          case "directpurchase":
            vm.stepModel.typename = "直采";
            break;
          case "exchange":
            vm.stepModel.typename = "兑换平台";
            break;
        }
      });
    }
    next();
  },
  created() {
    console.log("wosho");
    console.log(this.$route.query.tabName);
    // if (this.$route.query.tabName == "审核管理") {
    //     this.oneTitletext = this.$route.query.tabName;
    // } else {
    //     this.oneTitletext = "我的活动";
    // }
    switch (this.$route.name) {
      case "activehome":
        this.stepModel.step = 1; //第二步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = true;
        this.tipTitle = true;
        break;
      case "exchange":
        this.stepModel.step = 2; //第二步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = false;
        this.tipTitle = true;
        this.stepModel.typename = "兑换平台";
        break;
      case "configResouce":
        this.stepModel.step = 3; //第三步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = false;
        this.stepModel.typename = "兑换平台";

        this.tipTitle = true;

        break;
      case "directBuyResouce":
        this.stepModel.step = 3; //第三步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = false;
        this.stepModel.typename = "直采";
        this.tipTitle = true;
        break;
      case "newConfigResouce":
        this.stepModel.step = 3; // 新的资源配置  第三步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = false;
        this.stepModel.typename = "直采";
        this.tipTitle = true;
        break;
      case "configPlatform":
        this.stepModel.step = 4; //第四步
        this.stepModel.type_ename = "exchange";
        this.stepModel.homeShow = false;
        this.stepModel.typename = "兑换平台";
        this.tipTitle = true;

        break;
      case "preview":
        this.stepModel.homeShow = false;
        this.tipTitle = false;
        break;
    }
    if (this.$route.params.appId) {
      this.stepModel.step = 2; //第二步
      this.stepModel.exchange_stepModel.isshow = true;
      this.stepModel.exchange_stepModel.shownum = 1;
      this.stepModel.homeShow = false;
      // 下面是路由传过来的值
      this.stepModel.parameter = this.$route.params.appId; //传过来的值 如果有进行赋值
      this.stepModel.type_ename = this.$route.params.exchange; //传过来的值 步骤括号里的字
      this.stepModel.typename = this.$route.params.typename; //传过来的值 typename
    }
  },
  watch: {
    stepModel: {
      handler(newValue, oldValue) {
        console.log("我是监听");
        console.log(newValue);
      },
      deep: true
    },
    $route(to, from) {
      console.log("我是watch监听==================");
      console.log(to, from);
      console.log(to.query.choosename);
      this.oneTitletext = "我的活动";
      this.nextTitletext = "待配置活动";
      let changeName = "兑换平台";
      // if (to.query.choosename == "directpurchase") {
      //     changeName = "直采";
      // }
      if (this.$getsessionStorage("chooseName") == "directpurchase") {
        changeName = "直采";
      }
      switch (this.$getsessionStorage("chooseName")) {
        case "directpurchase":
          changeName = "直采";
          break;
        case "exchange":
          changeName = "兑换平台";
          break;
      }
      switch (to.name) {
        case "activehome":
          this.stepModel.step = 1; //第一步
          this.stepModel.type_ename = "exchange";
          this.stepModel.typename = changeName;

          this.stepModel.homeShow = true;
          this.tipTitle = true;
          break;
        case "exchange":
          this.stepModel.step = 2; //第二步
          this.stepModel.type_ename = "exchange";
          this.stepModel.typename = changeName;

          this.stepModel.homeShow = false;
          this.tipTitle = true;

          break;
        case "directBuyResouce":
          this.stepModel.step = 3; //第三步---直采资源配置
          break;
        case "newConfigResouce":
          this.stepModel.step = 3; //第三步---直采资源配置
          break;
        case "configResouce":
          this.stepModel.step = 3; //第三步
          this.stepModel.type_ename = "exchange";
          this.stepModel.typename = changeName;

          this.stepModel.homeShow = false;
          this.tipTitle = true;

          break;
        case "configPlatform":
          this.stepModel.step = 4; //第四步
          this.stepModel.type_ename = "exchange";
          this.stepModel.typename = changeName;

          this.stepModel.homeShow = false;
          this.tipTitle = true;

          break;
        case "preview":
          this.stepModel.homeShow = false;
          this.tipTitle = false;
          break;
      }
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
    }
  },
  mounted() {
    window.scrollTo(0, 0);

    //  console.log(this.stepModel.step)
  },
  methods: {
    changeStep(stepModel) {
      this.stepModel.step = stepModel.step; //配置步骤
      this.stepModel.appid = stepModel.appid; //项目ID
      this.stepModel.flowid = stepModel.flowid; //流程ID
      this.stepModel.pageid = stepModel.pageid; //页面ID
      this.stepModel.homeShow = stepModel.homeShow; //首页列表显示隐藏
      this.stepModel.selectActive.isshow = stepModel.selectActive.isshow;
      this.stepModel.selectActive.shownum = stepModel.selectActive.shownum;
      this.stepModel.typename = stepModel.typename; //存点击是那个导航 步骤进度里就显示是哪个的名字
      this.stepModel.type_ename = stepModel.type_ename; //英文名字
      this.stepModel.exchange_stepModel = stepModel.exchange_stepModel; //这是兑奖平台的判断
      // console.log("我是试试===");
      // console.log(stepModel);
      // this.stepModel.numname = stepModel.numname; //编号
      // this.stepModel.app_name = stepModel.app_name; //项目名称
      // this.stepModel.app_external_name = stepModel.app_external_name; //活动名称
      // this.stepModel.real_name = stepModel.real_name; //运营负责人
      // this.stepModel.login_time = stepModel.login_time;
      // this.stepModel.logout_time = stepModel.logout_time;
      // console.log("看看那");
      // console.log(this.stepModel);
    },
    exchange_changeStep(stepModel) {
      this.stepModel.exchange_stepModel.isshow = stepModel.isshow;
      this.stepModel.exchange_stepModel.shownum = stepModel.shownum;
      this.stepModel.exchange_stepModel.template_id = stepModel.template_id;
      this.stepModel.step = stepModel.step; //配置步骤
      this.stepModel.appid = stepModel.appid; //项目ID
      this.stepModel.typename = stepModel.typename; //存点击是那个导航 步骤进度里就显示是哪个的名字
      // alert(stepModel.typename);

      this.stepModel.homeShow = stepModel.homeShow;
      // console.log("主");
      // console.log(this.stepModel);
      // console.log("主");
    },
    configResouce_changeStep(stepModel) {
      this.stepModel.exchange_stepModel.isshow = stepModel.isshow;
      this.stepModel.exchange_stepModel.shownum = stepModel.shownum;
      this.stepModel.step = stepModel.step; //配置步骤
    },
    configPlatform_changeStep(stepModel) {
      this.stepModel.exchange_stepModel.shownum = stepModel.shownum;
      this.stepModel.step = stepModel.step; //配置步骤
    }
  }
};
</script>

<style scoped>
</style>
