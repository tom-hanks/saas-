<template>
  <div id="select_active">
    <div class="content-box">
      <P class="content-box-title">分配给我的活动</P>
      <ul class="tab-list clearfix">
        <!-- <li :class="{activeTab:typeid==0}" @click="isclickshow?getList(0):''">全部</li> -->
        <li
          :class="{activeTab:typeid==item.id}"
          v-for="(item,index) in dataTypeList"
          :key="index"
          @click="isclickshow?getList(item.id,item.type_name,item.type_ename):''"
        >
          {{item.type_name}}
          <i
            v-for="(item_state_arry,index_increaseName) in notification"
            :key="index_increaseName+'f'"
            class="num_tip"
            v-if="item_state_arry.page_code == 'activehome'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == item.id"
          >{{item_state_arry.num<100?item_state_arry.num:'...'}}</i>
        </li>
      </ul>
      <div class="activity-list" v-loading="loading">
        <ul>
          <transition-group style="display:block" :name="'list'" tag="div">
            <li class="activity-item list-item" v-for="(item,index) in itemList" :key="index+1">
              <!-- new 活动还未配置的标识 -->
              <div class="new_card" v-if="item.app_status_code == 40"></div>
              <!-- 活动标签 -->
              <img
                v-if="item.type_name=='上传小票'"
                class="StatusOne"
                src="../../../assets/images/images/upPiao.png"
                alt="订单状态"
              >
              <img
                v-if="item.type_name=='一物一码'"
                class="StatusOne"
                src="../../../assets/images/images/oneThings.png"
                alt="订单状态"
              >
              <img
                v-if="item.type_name=='兑换平台'"
                class="StatusOne"
                src="../../../assets/images/images/change.png"
                alt="订单状态"
              >
              <img
                v-if="item.type_name=='直采'"
                class="StatusOne"
                src="../../../assets/images/images/zhicai.png"
                alt="订单状态"
              >
              <!-- <img v-if='item.type_name=="PDQ"' class="StatusOne" src="../../../assets/images/images/PDQ.png" alt="订单状态"> -->
              <dl>
                <dt>
                  <span>{{item.app_brand_name}}</span>
                  <p>{{item.app_num}}</p>
                </dt>
                <dd :title="item.app_name">{{item.app_name}}</dd>
              </dl>
              <div class="activity-msg">
                <div class="residue-time">
                  <div class="annular-chart" v-bind:id="'chart_'+index" :ref="'cvs'+index"></div>
                  <div class="residue-days">剩
                    <br>
                    <span>{{item.balance}}</span>天
                  </div>
                  <p>距上线时间</p>
                </div>
                <div class="time-axle">
                  <p
                    class="time-axle-year onlyOne"
                    v-if="item.start_year==item.end_year"
                  >{{item.start_year}}年</p>
                  <p class="time-axle-year" v-if="item.start_year!=item.end_year">
                    <span>{{item.start_year}}年</span>
                    <span class="time-axle-year-end">{{item.end_year}}年</span>
                  </p>
                  <div class="time-axle-line">
                    <div
                      v-if="item.online_balance != 0 && item.online_did!= 0"
                      :style="'width:'+(item.online_did/(item.online_balance+item.online_did))*100+'%'"
                    ></div>
                    <div
                      v-if="item.online_balance == 0 && item.online_did== 0"
                      :style="'width:'+100+'%'"
                    ></div>
                  </div>
                  <div class="time-axle-day">
                    <span>{{item.start_time | timeago}}</span>
                    <span class="time-axle-day-end">{{item.end_time | timeago}}</span>
                  </div>
                  <div class="activity-authorization">
                    <div class="activity-authorization-num">
                      授权资源数：{{item.app_material_infos.length}}
                      <span
                        class="looknum"
                        @click="lookResouce(index)"
                        v-if="item.app_material_infos.length>0"
                      >
                        <i class="el-icon-view"></i>查看
                      </span>
                    </div>
                    <div class="activity-priority" v-if="item.exigence==0">
                      <i class="normal"></i>优先级：正常
                    </div>
                    <div class="activity-priority" v-if="item.exigence==1">
                      <i class="normal urgent"></i>优先级：
                      <span style="color:red;">紧急</span>
                    </div>
                  </div>
                  <button
                    class="select-btn"
                    v-if="item.type_name=='上传小票'"
                    v-on:click="choose(item.id)"
                  >选择</button>
                  <button
                    class="select-btn"
                    v-if="item.type_ename=='exchange'"
                    v-on:click="chooseExchange(item.id,item.app_num,item.app_name,item.app_external_name,item.login_time,item.logout_time)"
                  >选择</button>
                  <button
                    class="select-btn"
                    v-if="item.type_ename=='directpurchase'"
                    v-on:click="choosedirectpurchase(item.id)"
                  >选择</button>
                </div>
              </div>
            </li>
          </transition-group>
        </ul>
        <div class="no_img" v-if="no_data">
          <img src="../../../assets/images/images/nodata.png" alt>
          <p style="text-align:center;color: #aaaeb3;">空空如也</p>
        </div>
      </div>
    </div>
    <!-- 查看资源的弹框 -->
    <el-dialog title="授权资源" :visible.sync="showResouceDialog" :lock-scroll="false">
      <div class="resourceList">
        <ul>
          <li
            v-for="(resouce,Rindex) in itemList[lookindex]?itemList[lookindex].app_material_infos:''"
            :key="Rindex"
            :title="resouce.material_name"
          >
            <span class="resouce_num">{{Rindex+1}}.</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="resouce.icon" alt="资源图片">
              </div>
              <span>{{resouce.material_name}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-pagination
      v-on:size-change="page.changeSize"
      :class="itemListloading?'el-paginationshow':'el-paginationhide'"
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
// import apiSetting from "../../../assets/js/apiSetting.js";
export default {
  name: "selectActive",
  components: {},
  data() {
    return {
      orderState: "2", // 1:上传小票  2抽奖  3一物一码
      // 是否加急
      isUrgent: true,
      dataList: [], //列表数据绑定
      dataTypeList: [], //类型数据绑定
      page: page, //分页
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      typeid: 0, //项目类型：上传小票、抽奖、一物一码
      loading: false, //是否内容区域加载，v-loading='loading' 绑定，在请求前设为true，请求完成或失败后设为false
      showResouceDialog: false, //查看资源弹窗
      lookindex: 0, //资源弹窗用
      stepModel: {
        step: 1, //下一步
        appid: 0, //项目ID
        flowid: 0, //流程ID
        pageid: 0, //页面ID
        typename: "", //存点击是那个导航 步骤进度里就显示是哪个的名字
        type_ename: "", //导航的英文名字
        numname: "", //项目编号
        app_name: "", //项目名称
        app_external_name: "", //活动名称
        login_time: "",
        logout_time: "",
        real_name: "",
        homeShow: true, //首页的列表显示
        selectActive: {
          isshow: false, //上传小票的控制父级的显示隐藏
          shownum: 1
        },
        exchange_stepModel: {
          isshow: false,
          shownum: 1
        }
      },
      typeClick: {
        typename: "" //存点击是那个导航 步骤进度里就显示是哪个的名字
      },
      itemList: [], //空数组为了渲染缓动,因为transition-group只对响应式生效
      time_echart: null,
      no_data: false, //没有数据的时候控制无数据提示
      isclickshow: false, //点击切换的节流阀，避免点击过快
      timerk: null
    };
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    }
  },
  created() {
    clearInterval(this.timerk);
    clearTimeout(this.time_echart);
  },
  filters: {
    //过滤器
    timeago(val) {
      //去掉秒
      // console.log(val.substr(0, 11));
      let time_str = val.substr(0, 11);
      return time_str;
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.$setsessionStorage("appid", "");
    this.$setsessionStorage("template_id", "");
    if (this.$getsessionStorage("personal")) {
      this.stepModel.real_name = this.$getsessionStorage("personal").real_name;
    }

    // ===============分页配置
    let $emit = this;
    $emit.page.pageSize = 24; //修改每页显示数
    $emit.page.pageSizeList = [24, 48, 72]; //修改可以下拉框选择的每页显示数
    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getList($emit.typeid);
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.getAppList.page = this.page; //api接口分页赋值
    apiSetting.getAppList.dataList = this.dataList; //api分页数据赋值
    $emit.getType(); //获取项目类型
    // $emit.getList(0); //获取活动项目列表
    // ===============分页配置
  },
  methods: {
    drawLine(index, totalNum, totalBalance) {
      // 这个判断防止点击过快获取不到节点 报getAttribute错误
      if (!index) {
        return false;
      }
      let $eimr = this;
      //  let time_echar;
      this.time_echart = setTimeout(function() {
        // 绘制图表
        $eimr.$echarts.init(index).setOption({
          series: [
            {
              name: "据上线时间",
              type: "pie",
              width: "58",
              height: "58",
              radius: ["90%", "100%"],
              avoidLabelOverlap: false,
              legendHoverLink: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              color: ["#1DE9B6", "#ECEDEF"],
              data: [
                { value: totalBalance, name: "剩余时间" },
                { value: totalNum, name: "过去的时间" }
              ]
            }
          ]
        });
        clearTimeout(this.time_echart);
      }, 800);
    },
    getType() {
      //   let $emit = this;
      this.loading = true; //loading层打开
      httpServer(apiSetting.getAppTypeList)
        .then(response => {
          // console.log("我是分类");
          // console.log(response);
          this.dataTypeList = response;
          console.log("我是首页导航");
          console.log(response.length);
          if (response.length > 0) {
            this.getList(
              response[0].id,
              response[0].type_name,
              response[0].type_ename
            );
          }

          // this.loading = false; //loading层关闭
        })
        .catch(error => {
          this.loading = false; //loading层关闭
        });
    },
    getList(typeid, typename, type_ename) {
      //   console.log("问题", this.notification);

      // console.log(typename);
      this.itemListloading = false;

      this.stepModel.typename = typename;
      this.stepModel.type_ename = type_ename;
      console.log("我和change一样");
      console.log(type_ename);
      if (type_ename == "directpurchase") {
        this.stepModel.type_ename = "exchange";
      }
      this.$emit("changeStep", this.stepModel);
      clearInterval(this.timerk);
      this.isclickshow = false;
      let $emit = this;
      let timer = null; //声明定时器
      this.itemList = [];
      if (this.typeid != typeid) {
        this.typeid = typeid;
        this.page.pageIndex = 1;
      }
      this.loading = true; //loading层打开
      httpServer(apiSetting.getAppList, {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        AppStatusCode: this.$customState.app_status_code_12000, //状态 待配置的特殊码 dwt
        ProductClass: typeid
      })
        .then(response => {
          this.isclickshow = true;
          this.loading = false; //loading层关闭
          this.dataList = apiSetting.getAppList.dataList;
          console.log("大萨达所");
          console.log(this.dataList);
          let item = apiSetting.getAppList.dataList; //你的接口数据
          this.itemListloading = true;

          let index = 0;
          if (item.length > 0) {
            //但数据大于0的时候可以执行渲染
            this.no_data = false;
            // clearInterval(timer);
            this.timerk = setInterval(() => {
              if (index == item.length - 1) {
                //接口数据已经全部放入渲染列表中，清除定时器
                clearInterval(this.timerk);
              }
              this.itemList.push(item[index]); //将你的接口数据push到你需要渲染的列表里
              this.$nextTick(function() {
                // console.log(item[index-1].balance);
                this.dataList.forEach((value, i) => {
                  let totalDays = item[index - 1].balance + item[index - 1].did;
                  if (
                    item[index - 1].did == 0 &&
                    item[index - 1].balance == 0
                  ) {
                    this.drawLine(
                      document.getElementById(`chart_${index - 1}`),
                      -3,
                      item[index - 1].balance
                    ); //节点，已经过去的时间，剩余天数
                  } else {
                    this.drawLine(
                      document.getElementById(`chart_${index - 1}`),
                      item[index - 1].did,
                      item[index - 1].balance
                    ); //节点，已经过去的时间，剩余天数
                  }
                });
              });
              index++;
            }, 120);
            this.$getMid_notify("activehome");
            this.notification.forEach(element => {
              if (
                element.page_code == "activehome" &&
                element.public_id == typeid
              ) {
                //   alert("删除");
                this.$deleteMid_notify(element, "activehome");
              }
            });
          } else {
            this.no_data = true;
            this.isclickshow = true;
            console.log("没有数据");
          }
        })
        .catch(error => {
          this.loading = false; //loading层关闭
          this.isclickshow = true;
        });
    },
    choosedirectpurchase(id) {
      // this.stepModel.step = 2; //第二步
      // this.stepModel.appid = id; //项目ID
      // this.stepModel.selectActive.isshow = true;
      // this.stepModel.selectActive.shownum = 1;
      // this.stepModel.homeShow = false;

      // this.$emit("changeStep", this.stepModel); //传给父页面 home.vue 的changeStep方法
      this.$setsessionStorage("appid", id); //存id
      this.$setsessionStorage("chooseName", "directpurchase"); //存id

      this.$router.push({
        name: "exchange"
      });
    },
    choose(id) {
      this.stepModel.step = 2; //第二步
      this.stepModel.appid = id; //项目ID
      this.stepModel.selectActive.isshow = true;
      this.stepModel.selectActive.shownum = 1;
      this.stepModel.homeShow = false;
      this.$emit("changeStep", this.stepModel); //传给父页面 home.vue 的changeStep方法
    },
    chooseExchange(
      id,
      numname,
      app_name,
      app_external_name,
      login_time,
      logout_time
    ) {
      this.$setsessionStorage("appid", id); //存id
      this.$router.push({ name: "exchange" });
      this.$setsessionStorage("chooseName", "exchange"); //存id

      //id是项目id，numname：编号
      //兑奖平台
      this.stepModel.step = 2; //第二步
      this.stepModel.appid = id; //项目ID
      this.stepModel.numname = numname; //编号
      this.stepModel.app_name = app_name;
      this.stepModel.app_external_name = app_external_name; //活动名称
      this.stepModel.exchange_stepModel.isshow = true;
      this.stepModel.exchange_stepModel.shownum = 1;
      this.stepModel.homeShow = false;
      this.stepModel.login_time = login_time;
      this.stepModel.logout_time = logout_time;
      this.stepModel.real_name = this.$getsessionStorage("personal").real_name;
      this.$emit("changeStep", this.stepModel);
    },
    lookResouce(index) {
      //资源数量弹窗
      this.showResouceDialog = true;
      this.lookindex = index;
    }
  },
  destroyed: function() {
    //离开页面钩子，清除定时器
    console.log("我离开了");
    clearInterval(this.timerk);
    clearTimeout(this.time_echart);
  }
};
</script>
<style>
.el-pagination__sizes .el-input__inner {
  width: 108px;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.35s;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<style scoped lang='less'>
#select_active .new_card {
  position: absolute;
  top: 0;
  left: -4px;
  width: 40px;
  height: 16px;
  background: url(../../../assets/images/images/new.png) no-repeat left top;
  background-size: 100% 100%;
}
#select_active .looknum {
  color: #ffb735;
}
#select_active .looknum:hover {
  color: #393c40;
}
#select_active .looknum:hover .el-icon-view {
  color: #393c40;
}

.resourceList {
  ul {
    overflow: hidden;
    li {
      float: left;
      width: 175px;
      padding-right: 5px;
      margin-bottom: 15px;
      overflow: hidden;
      line-height: 30px;
      .resouce_num,
      .resouce_name {
        float: left;
      }
      .resouce_num {
        text-align: center;
        display: block;
        width: 30px;
      }
      .resouce_name {
        overflow: hidden;
        .resouce_img_f {
          width: 30px;
          height: 30px;
          float: left;
          margin-right: 5px;
          img {
            display: block;
            max-width: 100%;
            max-height: 100%;
            position: relative;
            top: 50%;
            left: 50%;
            -webkit-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
          }
        }
        span {
          display: block;
          line-height: 30px;
          color: #393c40;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img,
        span {
          float: left;
        }
      }
    }
  }
}
#select_active .el-paginationshow {
  visibility: visible;
}
#select_active .el-paginationhide {
  visibility: hidden;
  // display: none;
}
#select_active .looknum .el-icon-view {
  color: #ffb735;
  padding-left: 5px;
}
#select_active .el-pagination__sizes .el-input__inner {
  width: 108px;
}
#select_active .tab-list {
  //   overflow: hidden;
  border-bottom: 1px #eaeaea solid;
  padding-left: 20px;
}
#select_active .tab-list li {
  float: left;
  margin-right: 35px;
  line-height: 50px;
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  color: #aaaeb3;
  cursor: pointer;
  padding: 0px 3px;
  position: relative;
}
#select_active .tab-list .activeTab {
  font-size: 14px;
  height: 12px;
  line-height: 12px;
  padding-bottom: 8px;
  color: #393c40;
  border-bottom: 3px #4900e0 solid;
}
#select_active .activity-list {
  padding-top: 18px;
  padding-left: 20px;
  min-height: 520px;
  overflow: hidden;
  position: relative;
}
#select_active .activity-list .activity-item {
  width: 277px;
  height: 240px;
  margin-right: 14px;
  margin-bottom: 20px;
  position: relative;
  float: left;
  cursor: pointer;
  box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
  /* transition: box-shadow .5s; */
  /* -moz-transition: box-shadow .5s;
  -webkit-transition: box-shadow .5s;
  -o-transition: box-shadow .5s; */
}
#select_active .activity-list .activity-item:hover {
  webkit-box-shadow: 0 11px 21px #bfb2b2;
  box-shadow: 0 11px 21px #bfb2b2;
  transition: all 0.5s;
}
#select_active .activity-list .activity-item .StatusOne {
  display: block;
  height: 52px;
  width: 52px;
  position: absolute;
  right: 0px;
  top: 0;
}
#select_active .activity-list .activity-item dl {
  height: 70px;
  border-bottom: 1px #d7d7d7 solid;
  padding-top: 20px;
  box-sizing: border-box;
  padding-left: 14px;
}
#select_active .activity-list .activity-item dd {
  font-size: 12px;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#select_active .activity-list .activity-item dl dt {
  margin-bottom: 5px;
  overflow: hidden;
}
#select_active .activity-list .activity-item dl dt span,
#select_active .activity-list .activity-item dl dt p {
  display: block;
  float: left;
}
#select_active .activity-list .activity-item dl dt span {
  padding: 2px 12px;
  font-size: 10px;
  text-size-adjust: none;
  max-width: 72px;
  overflow: hidden;
  height: 17px;
  line-height: 17px;
  background-color: #ebebeb;
  border-radius: 6px;
  margin-right: 5px;
}
#select_active .activity-list .activity-item .activity-msg {
  padding: 10px 11px;
  padding-left: 17px;
  overflow: hidden;
}
#select_active .activity-list .activity-item .activity-msg .residue-time {
  position: relative;
  float: left;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .residue-time
  .annular-chart {
  width: 58px;
  height: 58px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .residue-time
  .residue-days {
  width: 58px;
  height: 58px;
  position: absolute;
  text-indent: 5px;
  font-size: 10px;
  color: #acb0b5;
  top: 8px;
  left: 0;
  text-align: center;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .residue-time
  .residue-days
  span {
  font-size: 16px;
  line-height: 30px;
  color: #393c40;
}
#select_active .activity-list .activity-item .activity-msg .residue-time p {
  width: 58px;
  text-align: center;
  font-size: 10px;
  margin-top: 4.6px;
  color: #aaaeb3;
}
#select_active .activity-list .activity-item .activity-msg .time-axle {
  margin-left: 18px;
  float: left;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-year {
  color: #acb0b5;
  font-size: 10px;
  overflow: hidden;
  margin-bottom: 5px;
  /* margin-top: 10px; */
}
.onlyOne {
  text-align: center;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-year
  .time-axle-year-end {
  float: right;
  margin-bottom: 5px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-line {
  width: 170px;
  height: 5px;
  background: #d7d7d7;
  border-radius: 3px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-line
  div {
  width: 6px;
  height: 5px;
  background-color: #5ac1ff;
  border-radius: 3px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-day {
  margin-top: 10px;
  font-size: 10px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .time-axle-day
  .time-axle-day-end {
  float: right;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .activity-authorization {
  margin-top: 12px;
  overflow: hidden;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .activity-authorization
  .activity-authorization-num {
  font-size: 12px;
  padding-left: 25px;
  margin-bottom: 8px;
  background: url(../../../assets/images/images/resourse.png) no-repeat left
    center;
  background-size: 12px 12px;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .activity-authorization
  .activity-priority {
  font-size: 12px;
  color: #393c40;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .activity-authorization
  .activity-priority
  .normal {
  display: inline-block;
  border-radius: 50%;
  margin-right: 15px;
  width: 8px;
  height: 8px;
  background-color: #5ff333;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .activity-authorization
  .activity-priority
  .urgent {
  background: red;
}
#select_active
  .activity-list
  .activity-item
  .activity-msg
  .time-axle
  .select-btn {
  width: 70px;
  height: 30px;
  background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  margin-left: 8px;
  margin-top: 16px;
  cursor: pointer;
}
.no_img {
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* @media screen and (min-width: 1400px) {
  #select_active .activity-list .activity-item{
    margin-right: 40px;
  }
} */
</style>
