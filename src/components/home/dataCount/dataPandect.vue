<template>
  <div id="dataPandect">
    <p class="content-title">
      <span>数据统计</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">我的数据</span>
    </p>

    <div class="activeAllot_content">
      <div class="active_pandect">
        <div class="all_active_title clearfix">
          <i class="all_active_i"></i>
          <span>数据总览</span>
          <!-- <div class="change_tab">
                        <div class="change_tab_mouth activeTab">本月</div>
                        <div class="change_tab_year">今年</div>
          </div>-->
          <!-- 月 -->
          <!-- <div class="block">
                        <el-date-picker v-model="valueMonth" type="month" placeholder="选择月">
                        </el-date-picker>
          </div>-->
          <!-- 年 -->
          <!-- <p class="fr">ssss</p> -->
          <div class="activeAllot_box_search fr">
            <i class="el-icon-search"></i>
            <i class="el-icon-close" v-if="seachclick_close" @click="seachclick(0)"></i>
            <input
              @keyup.13="seachValue?seachclick():''"
              v-model="seachValue"
              type="text"
              placeholder="请输入项目编号或活动名称"
              @input="seachValue==''?seachclick_close=false:seachclick_close=true"
            >
            <span class="seach" @click="seachValue?seachclick():''">搜索</span>
          </div>
        </div>
        <div class="order_btn" v-show="activeType">
          <span
            v-for="(item,index) in activeType"
            :key="index"
            @click="isclickshow?typeTab(index,item.id,item.type_ename):''"
            :class="activeTypeIndex == index?'activeBtn':''"
          >
            {{item.type_name}}{{`(${item.count})`}}
            <i
              v-for="(item_state_arry,index_increaseName) in notification"
              :key="index_increaseName+'s'"
              v-if="item_state_arry.page_code == 'dataPandect'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == item.id"
              class="num_tip"
            >{{item_state_arry.num<100?item_state_arry.num:'...'}}</i>
          </span>
        </div>
        <div class="timeMain clearfix">
          <p class="fl changeTime_plese">请选择时间</p>
          <div class="block fl" style="margin-right:10px">
            <el-date-picker
              v-model="valueday"
              @change="changeday"
              :clearable="false"
              :picker-options="pickerOptions0"
              format="yyyy-M-d"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div class="block fl">
            <el-date-picker
              v-model="valueYear"
              type="year"
              :clearable="false"
              format="yyyy 年"
              :picker-options="pickerOptions0"
              @change="changeYear"
              style="width:100px"
              placeholder="选择年"
            ></el-date-picker>
          </div>

          <div class="fl change_moth">
            <i class="el-icon-date change_moth_icon"></i>
            <el-select
              v-model="valueMonth"
              class="elSelect"
              @change="changeSelect"
              style="width:100px"
              placeholder="选择月"
            >
              <!-- :disabled="item.value<=valuedayModel.monthNum?false:true" -->
              <el-option
                v-for="item in optionSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <!-- 新需求隐藏 start-->
        <!-- <ul class="data_list">
                    <li>活动总数(个)<b>{{app_count}}</b></li>
                    <li>原始码发放量(个)<b>{{origin_release_count}}</b></li>
                    <li>平台码发放量(个)<b>{{redeem_release_count}}</b></li>
                    <li>平台码兑换量(个)<b>{{redeem_exchange_count}}</b></li>
                </ul>
                <div id="eacharts" v-loading='canvasloading'></div>
                <div class="eachartsTitle" v-if="!canvasloading">
                    <p>原始码发放量</p>
                    <p>平台码发放量</p>
                    <p>平台码兑换量</p>
        </div>-->
        <!-- 新需求隐藏 end-->
        <div class="all_active_ban">
          <div class="total_Activity">
            <span>
              活动总数（个）
              <em>{{app_count}}</em>
            </span>
          </div>
          <div class="total_Activity total_ActivityTwo">
            <span>
              原始码发放量（个）
              <em>{{origin_release_count}}</em>
            </span>
            <span>
              平台码发放量（个）
              <em>{{redeem_release_count}}</em>
            </span>
            <span>
              平台码兑换量（个）
              <em>{{redeem_exchange_count}}</em>
            </span>
            <span>
              充值金额（元）
              <em>{{recharge_amount}}</em>
            </span>
          </div>
          <div class="all_active_left fl">
            <div class="active_item myActive">
              <div class="active_item_title">
                <i></i>
                <span>我的活动</span>
              </div>
              <div id="exchangeOrder"></div>
            </div>
          </div>
          <div class="all_active_right fr">
            <!-- <div class="active_item_title">
              <i></i><span>我的活动</span>
            </div>
            <div id="exchangeTick"></div>-->
            <div class="active_item myActive">
              <div class="active_item_title">
                <i></i>
                <span>充值金额</span>
              </div>
              <div id="child_exchangeTick"></div>
            </div>
          </div>
        </div>
        <!-- <div class="up_nodatecl" v-if="!up_nodate">暂无数据</div> -->
      </div>
      <div class="activeAllot_box" v-loading="loading">
        <!-- <div class="title_seacch_box">
          <p class="activeAllot_box_title"><i></i> 数据管理</p>
          <div class="activeAllot_box_search">
            <i class="el-icon-search"></i>
            <i
              class="el-icon-close"
              v-if="seachclick_close"
              @click='seachclick(0)'
            ></i>
            <input
              @keyup.13="seachValue?seachclick():''"
              v-model="seachValue"
              type="text"
              placeholder="请输入项目编号或活动名称"
              @input="seachValue==''?seachclick_close=false:seachclick_close=true"
            >
            <span
              class="seach"
              @click="seachValue?seachclick():''"
            >搜索</span>
          </div>
        </div>-->
        <div class="active_type_tab">
          <i class="all_active_i fl"></i>
          <span class="fl">详细数据</span>
          <!-- <ul>
            <li
              :class="{typeActive:activeTypeIndex == Tindex}"
              v-for="(type,Tindex) in activeType"
              :key="Tindex"
              @click="isclickshow?typeTab(Tindex,type.id,type.type_ename):''"
            >
              <div v-if="countNum">{{type.type_name}}
                <span v-if="type.count>0 && type.type_ename != 'exchange'">{{type.count}}</span>
              </div>
            </li>
          </ul>-->
        </div>
        <!-- 包一下 -->
        <div class="main">
          <!-- <div class="state_tab">
                        <p>状态：</p>
                        <ul>
                            <li :class="{stateActive:activeStateIndex == Sindex}" v-for="(state,Sindex) in activeState" :key="Sindex" @click="isstateTabshow?stateTab(Sindex):''">
                                <span>{{state}}</span>
                                <i></i>
                            </li>
                        </ul>
          </div>-->
          <div class="activeAllot_list">
            <ul class="activeAllot_list_ul">
              <transition-group style="display:block" :name="'list'" tag="div">
                <li class="activeAllot_list_li" v-for="(item,index) in itemList" :key="index+1">
                  <div class="activeAllot_state">
                    <img
                      v-if="item.type_ename == 'exchange'"
                      class="activeAllot_state_img"
                      src="../../../assets/images/images/change.png"
                      alt="兑奖平台"
                    >
                    <img
                      class="activeAllot_state_img"
                      v-if="item.type_ename == 'directpurchase'"
                      src="../../../assets/images/images/zhicai.png"
                      alt="直采"
                    >
                    <div class="brand_title">
                      <span>{{item.app_brand_name}}</span>
                      {{item.app_num}}
                    </div>
                    <p>
                      <span class="active_name">{{item.app_name}}</span>
                    </p>
                  </div>
                  <div class="list_all clearfix">
                    <ul>
                      <li class="all_orders">
                        <span>已发放平台码：</span>
                        <p>{{item.redeem_release_count}}</p>
                      </li>
                      <li class="sucess_orders">
                        <span>已发放原始码：</span>
                        <p>{{item.origin_release_count}}</p>
                      </li>
                      <li class="fail_orders">
                        <span>充值金额：</span>
                        <p>{{item.recharge_amount}}</p>
                      </li>
                    </ul>
                  </div>
                  <div class="activeAllot_msg">
                    <div class="activeAllot_msg_left">
                      <p class="time_year" v-if="item.start_year==item.end_year">
                        <span class="start_year onlyOne">{{item.start_year}}年</span>
                      </p>
                      <p class="time_year" v-if="item.start_year!=item.end_year">
                        <span class="start_year">{{item.start_year}}年</span>
                        <span class="end_tear">{{item.end_year}}年</span>
                      </p>
                      <!-- <p class="time_year onlyOne" v-if="item.start_year == item.end_year">{{item.start_year}}年</p> -->
                      <div class="time_line">
                        <div
                          v-if="item.online_balance != 0 && item.online_did!= 0"
                          :style="'width:'+(item.online_did/(item.online_balance+item.online_did))*100+'%'"
                        ></div>
                        <div
                          v-if="item.online_balance == 0 && item.online_did== 0"
                          :style="'width:'+100+'%'"
                        ></div>
                      </div>
                      <p class="time_day">
                        <span class="start_day">{{item.start_time}}</span>
                        <span class="end_day">{{item.end_time}}</span>
                      </p>
                      <!-- <div class="allot_resource">
                        <div class="resource_num">
                          <div class="authorization">授权资源数：{{item.app_material_infos.length}}</div>
                          <span
                            v-if="item.app_material_infos.length>0"
                            @click="lookResouce(index)"
                          >
                            <i class="el-icon-view"></i>查看</span>
                        </div>
                      </div>-->
                      <div class="turn_down">
                        <!-- <div class="yuanshi_code">已发放原始码:<b>{{item.origin_release_count}}</b></div>
                        <div class="pingtai_code">
                          <p>已发放平台码:<b>{{item.redeem_release_count}}</b></p>
                          <p>已兑换平台码:<b>{{item.redeem_exchange_count}}</b></p>
                        </div>-->
                      </div>
                    </div>
                    <div class="activeAllot_msg_right">
                      <!-- <img
                        :src="item.qrcode"
                        alt="二维码"
                      >-->
                      <p @click="lookrouter(item.id,item.template_id)">查看详细数据</p>
                    </div>
                  </div>
                </li>
              </transition-group>
            </ul>
            <div class="no_img" v-if="no_data">
              <img src="../../../assets/images/images/nodata.png" alt>
              <p>空空如也</p>
            </div>
            <div class="no_img" v-if="seacherno_data">
              <img src="../../../assets/images/images/nodata2.png" alt>
              <p>没有搜索到结果，可能飞火星去了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="授权资源"
      :visible.sync="showResouceDialog"
      class="resourceDialog"
      v-if="itemList.length>0"
    >
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>授权资源
        </p>
        <ul>
          <li
            v-for="(resouce,Rindex) in itemList[lookindex]?itemList[lookindex].app_material_infos:''"
            :key="Rindex"
            :title="resouce.material_name"
          >
            <span class="resouce_num">{{Rindex+1}}.</span>
            <div class="resouce_name">
              <img :src="resouce.icon" alt="资源图片">
              <span>{{resouce.material_name}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>使用资源
        </p>
        <ul>
          <li
            v-for="(resouce,Rindex) in itemList[lookindex]?itemList[lookindex].use_material_infos:''"
            :key="Rindex"
            :title="resouce.material_name"
          >
            <span class="resouce_num">{{Rindex+1}}.</span>
            <div class="resouce_name">
              <img :src="resouce.icon" alt="资源图片">
              <span>{{resouce.material_name}}</span>
            </div>
          </li>
          <p
            v-if="itemList[lookindex].use_material_infos.length<=0"
            style="text-align:center"
          >暂无使用资源</p>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- itemListloading判断是为了阻止分页点击过快做成的bug,注意下面还有样式 -->
    <el-pagination
      :style="!no_data&&itemListloading==true?'visibility:visible':'visibility:hidden'"
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
const saasDialog = () =>
  import(/* webpackChunkName:"dialog" */ "../../dialog/dialog");
export default {
  name: "dataPandect",
  props: {},
  components: {
    saasDialog
  },
  data() {
    return {
      loading: false, //是否内容区域加载，
      valueYear: "", //年的选择器
      valueMonth: "", //月选择器
      valueday: "", //天
      valuedayModel: {
        yearNum: "",
        monthNum: "",
        dayNume: ""
      },
      seachValue: "",
      activeType: [],
      countNum: false,
      dataList: [],
      itemList: [],
      inquire: {
        id: "",
        statue: 50
      },
      page: page,
      type_enameName: "",
      activeTypeIndex: 0,
      isclickshow: false, //tab事件控制
      lookindex: 0,
      no_data: false,
      seacherno_data: false,
      showResouceDialog: false,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      seachclick_close: false, //主页的搜索按钮叉号
      option: {},
      optionSelect: [
        {
          value: "1",
          label: "1月"
        },
        {
          value: "2",
          label: "2月"
        },
        {
          value: "3",
          label: "3月"
        },
        {
          value: "4",
          label: "4月"
        },
        {
          value: "5",
          label: "5月"
        },
        {
          value: "6",
          label: "6月"
        },
        {
          value: "7",
          label: "7月"
        },
        {
          value: "8",
          label: "8月"
        },
        {
          value: "9",
          label: "9月"
        },
        {
          value: "10",
          label: "10月"
        },
        {
          value: "11",
          label: "11月"
        },
        {
          value: "12",
          label: "12月"
        }
      ],
      echaers_data: [], //柱状图用的数组
      // valueSelect: "",
      app_count: "", //兑换活动个数
      redeem_exchange_count: "", //平台码兑换量
      redeem_release_count: "", //平台码发放量
      origin_release_count: "", //原始码发放量
      recharge_amount: "", //金额
      company: "", //单位
      canvasloading: true, //canvas的loading
      up_nodate: true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    }
  },
  created() {
    //获取当前时间
    var curDate = new Date();
    var preDate = new Date(curDate.getTime());
    var year = preDate.getFullYear();
    var month = preDate.getMonth() + 1;
    var day = preDate.getDate();
    // var nowDate = year + "-" + month;
    // console.log(this.dayNume);
    // this.valueSelect = "" + month;

    this.valuedayModel.yearNum = "" + year;
    this.valuedayModel.monthNum = "" + month;

    this.valuedayModel.dayNume = "" + day;
    this.valueday =
      this.valuedayModel.yearNum +
      "-" +
      this.valuedayModel.monthNum +
      "-" +
      this.valuedayModel.dayNume;
    // console.log(
    //     this.valueYear + "-" + this.valueMonth + "-" + this.dayNume
    // );
  },
  mounted() {
    this.$setsessionStorage("exchangDataParmis", "");
    this.summaryExchangeReport(0); //默认前一天的数据
    // this.getAppTypeList(0);
    this.page.pageIndex = 1;
    let $emit = this;
    $emit.page.pageSize = 24; //修改每页显示数
    $emit.page.pageSizeList = [24, 48, 72]; //修改可以下拉框选择的每页显示数
    // console.log("111111111111111111111111111");

    // //分页调用的获取列表方法
    // $emit.page.query = function() {
    //     if ($emit.itemListloading) {
    //         $emit.getList($emit.typeid);
    //         this.itemList = [];
    //         $emit.itemListloading = false; //以防分页点击过快的flag节流阀
    //     }
    // };
    apiSetting.reportGetAppList.page = this.page; //api接口分页赋值
    apiSetting.reportGetAppList.dataList = this.dataList; //api分页数据赋值
  },
  activated: function() {
    let $emit = this;
    // $emit.page.pageSize = 4; //修改每页显示数
    // $emit.page.pageSizeList = [4, 8, 12, 16, 20, 24]; //修改可以下拉框选择的每页显示数
    // console.log("111111111111111111111111111");
    // console.log(this.page);
    // console.log(this.$getsessionStorage("exchangDataParmis"));
    if (this.$getsessionStorage("exchangDataParmis")) {
      this.page.pageIndex = this.$getsessionStorage(
        "exchangDataParmis"
      ).pageIndex;
      this.page.pageSize = this.$getsessionStorage(
        "exchangDataParmis"
      ).pageSize;
      this.page.pageSizeList = this.$getsessionStorage(
        "exchangDataParmis"
      ).pageSizeList;
      this.page.pageTotal = this.$getsessionStorage(
        "exchangDataParmis"
      ).pageTotal;
      this.page.total = this.$getsessionStorage("exchangDataParmis").total;
    }

    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.getList($emit.typeid);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
  },
  methods: {
    drawMyTick() {
      var MyOrderChart = this.$echarts.init(
        document.getElementById("child_exchangeTick")
      );
      var echaers_datafor = [];
      for (var i = 0; i < this.echaers_data.length; i++) {
        echaers_datafor.push((i + 1).toString());
      }
      this.option = {
        title: {
          subtext: "单位：X轴（元） Y轴（" + this.company + "）",
          left: "center"
        },
        color: ["#ff8b7a"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          height: "80%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: echaers_datafor,
            axisLabel: {
              interval: this.echaers_data.length <= 12 ? 0 : 1 //设置是否间隔显示 0为强制全部显示，1为可以间隔显示;所以只有选择年的时候显示12个月是可以放得下的
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "充值金额",
            type: "bar",
            barWidth: "60%",
            data: this.echaers_data
          }
        ]
      };

      MyOrderChart.setOption(this.option);
    },
    //  我的订单 饼状图
    drawMyOrder(
      origin_release_count,
      redeem_release_count,
      redeem_exchange_count
    ) {
      var MyOrderChart = this.$echarts.init(
        document.getElementById("exchangeOrder")
      );
      this.option = {
        title: {
          text: "",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} ({d}%)"
        },
        formatter: function(val) {
          return val.split("-").join("\n");
        }, //此语句是让legend 中的文字进行换行</span>
        series: [
          {
            name: "",
            type: "pie",
            radius: "62%",
            center: ["50%", "50%"],
            data: [
              {
                value: redeem_exchange_count,
                name: "平台码兑换量:" + redeem_exchange_count,
                itemStyle: { color: "#3e6afd" }
              },
              {
                value: redeem_release_count,
                name: "平台码发放量:" + redeem_release_count,
                itemStyle: { color: "#39d2ff" }
              },
              {
                value: origin_release_count,
                name: "原始码发放量:" + origin_release_count,
                itemStyle: { color: "#ffc92f" }
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(":").join("\n");
                  }
                },
                labelLine: {
                  show: true
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      MyOrderChart.setOption(this.option);
      this.canvasloading = false;
    },
    // 查看资源
    lookResouce(index) {
      this.showResouceDialog = true;
      this.lookindex = index;
    },
    typeTab(index, id, type_ename) {
      this.summaryExchangeReport();
      this.activeTypeIndex = index;
      this.itemList = [];
      this.isclickshow = false;
      // this.isStauy = 0;审核状态
      this.lookindex = 0;
      this.seachValue = "";
      if (this.inquire.id != id) {
        this.page.pageIndex = 1;
        this.type_enameName = type_ename;
        this.inquire.id = id; //第一层tab的id
        this.activeStateIndex = 0; //重置默认值
      }
      //   this.getList();
    },
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      if (this.isclickshow) {
        this.getList("seach"); //搜索请求列表
      }
    },
    getList(flagName) {
      clearInterval(this.timerk2);
      this.isclickshow = false;
      let timer2 = null; //声明定时器
      this.itemList = [];
      this.itemListloading = false;
      this.loading = true; //loading层打开
      httpServer(apiSetting.reportGetAppList, {
        Name: this.seachValue, //搜索
        beginyear: this.valueday ? this.valuedayModel.yearNum : this.valueYear, //年
        beginmonth: this.valueday
          ? this.valuedayModel.monthNum
          : this.valueMonth, //月
        beginday: this.valueday ? this.valuedayModel.dayNume : "", //日,没有传默认
        ProductClass: this.inquire.id,
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize
      })
        .then(response => {
          this.isclickshow = true;
          this.loading = false; //loading层关闭

          this.dataList = apiSetting.reportGetAppList.dataList;
          this.itemListloading = true;
          let item = apiSetting.reportGetAppList.dataList;
          let index = 0;
          if (item.length > 0) {
            //但数据大于0的时候可以执行渲染
            this.no_data = false;
            this.seacherno_data = false;
            this.timerk2 = setInterval(() => {
              if (index == item.length - 1) {
                //接口数据已经全部放入渲染列表中，清除定时器
                clearInterval(this.timerk2);
              }
              this.itemList.push(item[index]); //将你的接口数据push到你需要渲染的列表里
              index++;
            }, 120);
            this.$getMid_notify("dataPandect");
            this.notification.forEach(element => {
              if (
                element.page_code == "dataPandect" &&
                element.public_id == this.inquire.id
              ) {
                //   alert("删除");
                this.$deleteMid_notify(element, "dataPandect");
              }
            });
          } else {
            this.isclickshow = true;
            if (flagName) {
              //表示搜索的时候没有数据
              this.no_data = false;
              this.seacherno_data = true;
            } else {
              this.seacherno_data = false;
              this.no_data = true;
            }
          }
          // console.log(response);
          this.isstateTabshow = true;
        })
        .catch(error => {
          this.loading = false;
          this.isclickshow = true;
          console.log(error); //loading层关闭
        });
    },
    summaryExchangeReport(num) {
      this.canvasloading = true;
      httpServer(apiSetting.summaryExchangeReport, {
        beginyear: this.valueday ? this.valuedayModel.yearNum : this.valueYear, //年
        beginmonth: this.valueday
          ? this.valuedayModel.monthNum
          : this.valueMonth, //月
        day: this.valueday ? this.valuedayModel.dayNume : "", //日,没有传默认
        app_id: "",
        material_id: ""
      })
        .then(response => {
          if (num == 0) {
            this.getAppTypeList(0); //默认一进来时候成功同时触发列表
          } else {
            this.getAppTypeList(); //切换日期成功同时触发列表
          }
          console.log("数据统计报表");

          this.canvasloading = false;

          this.app_count = response.app_count;
          this.recharge_amount = response.recharge_amount; //金额赋值
          this.echaers_data = [];
          if (response.recharge_amount_statistics) {
            this.company = response.recharge_amount_statistics.date_unit; //天
            this.echaers_data =
              response.recharge_amount_statistics.recharge_amount_minute_list;
          }
          this.redeem_exchange_count = response.redeem_exchange_count;
          this.redeem_release_count = response.redeem_release_count;
          this.origin_release_count = response.origin_release_count;
          this.$nextTick(function() {
            this.drawMyTick();
            this.drawMyOrder(
              this.origin_release_count,
              this.redeem_release_count,
              this.redeem_exchange_count
            );
          });
        })
        .catch(error => {
          // this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    changeYear(index) {
      this.page.pageIndex = 1;

      this.valueMonth = "";
      let date_Year = new Date(index);
      this.valueYear = "" + date_Year.getFullYear();
      this.valueday = "";
      this.dayNume = "";
      this.summaryExchangeReport();
    },
    changeSelect(index) {
      if (!this.valueYear) {
        this.valueday = "";
        this.dayNume = "";

        this.$message({
          message: "请先选择年",
          duration: 1000
        });
        return false;
      }
      this.page.pageIndex = 1;

      this.valueMonth = index;
      this.valuedayModel.yearNum = "";
      this.valuedayModel.monthNum = "";
      this.valuedayModel.dayNume = "";
      this.summaryExchangeReport();
      // console.log(index);
    },
    changeday(index) {
      this.page.pageIndex = 1;
      this.valueYear = "";
      this.valueMonth = "";
      this.changeTodate(index);
    },
    changeTodate(num) {
      //选择当前天
      let dateMain = new Date(num);
      this.valuedayModel.yearNum = "" + dateMain.getFullYear();
      this.valuedayModel.monthNum = "" + (dateMain.getMonth() + 1);
      this.valuedayModel.dayNume = "" + dateMain.getDate();
      this.summaryExchangeReport();
    },
    //  获取table选项
    getAppTypeList(num) {
      this.loading = true; //loading层打开
      this.activeType = [];
      httpServer(apiSetting.reportGetAppTypeList, {
        beginyear: this.valueday ? this.valuedayModel.yearNum : this.valueYear, //年
        beginmonth: this.valueday
          ? this.valuedayModel.monthNum
          : this.valueMonth, //月
        day: this.valueday ? this.valuedayModel.dayNume : "" //日,没有传默认
      })
        .then(response => {
          this.$nextTick(function() {
            this.countNum = true;
          });
          if (num == 0) {
            //num等于0的话代表着第一次进来需要把数据第一个id传过去
            this.inquire.id = response[0].id; //默认type取第一个
            this.type_enameName = response[0].type_ename;
          }
          this.activeType = response;
          this.getList();
          this.loading = false; //loading层关闭
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    drawTwoOrder(
      origin_release_count,
      redeem_release_count,
      redeem_exchange_count
    ) {
      var MyOrderChart = this.$echarts.init(
        document.getElementById("exchangeOrder")
      );
      this.option = {
        title: {
          text: "",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}({d}%)"
        },
        formatter: function(val) {
          return val.split("-").join("\n");
        }, //此语句是让legend 中的文字进行换行</span>
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: [0, "30%"],

            label: {},
            labelLine: {
              normal: {
                show: true,
                length: 3,
                length2: 5
              }
            },
            data: [
              { value: origin_release_count, name: "原始码" },
              { value: redeem_release_count, name: "平台码" }
            ]
          },
          {
            name: "访问来源1",
            type: "pie",
            radius: ["60%", "75%"],
            data: [
              {
                value: origin_release_count,
                name: "原始码发放量" + ":" + `${origin_release_count}`
              },
              {
                value: redeem_release_count - redeem_exchange_count,
                name:
                  "平台码未兑换" +
                  ":" +
                  `${redeem_release_count - redeem_exchange_count}`
              },
              {
                value: redeem_exchange_count,
                name: "平台码已兑换" + ":" + `${redeem_exchange_count}`
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split(":").join("\n");
                  }
                },
                labelLine: {
                  show: true,
                  length: 10,
                  length2: 7
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      MyOrderChart.setOption(this.option);
    },
    //画柱状图
    drawBar(origin_release_count, redeem_release_count, redeem_exchange_count) {
      var myChart = this.$echarts.init(document.getElementById("eacharts"));
      this.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["原始码发放量", "平台码发放量", "平台码兑换量"]
        },
        color: ["#ffa817", "#006abd", "#4fb2ff"],
        grid: {
          left: "10%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: [""]
        },
        series: [
          {
            name: "原始码发放量",
            type: "bar",
            barWidth: 30,
            data: [origin_release_count] //原始码
          },
          {
            name: "平台码发放量",
            type: "bar",
            barWidth: 30,
            data: [redeem_release_count] //平台码发放量==蓝色
          },
          {
            name: "平台码兑换量",
            type: "bar",
            barWidth: 30,
            data: [redeem_exchange_count] //平台码兑换量==灰色
          }
        ]
      };
      myChart.setOption(this.option);
      this.canvasloading = false;
    },
    //查看数据详情
    lookrouter(id, template_id) {
      this.$router.push({ path: "/statistics/exchangDataDetail" });
      this.$setsessionStorage("template_id", template_id);
      this.$setsessionStorage("appid", id);
      this.$setsessionStorage("exchangDataParmis", this.page);
    }
  },
  destroyed() {}
};
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.35s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.item {
  padding: 0px;
}
.item .el-tooltip__popper[x-placement^="top"] .popper__arrow {
  /* bottom:0px;
    border-width: 0px; */
  display: none;
  border-top-color: transparent;
}
.item.el-tooltip__popper .popper__arrow {
  display: none;
  border-top-color: transparent;
  border-width: 0px;
}

#dataPandect .block .el-date-editor {
  width: 130px;
}
#dataPandect .block .el-date-editor .el-input__inner {
  padding-left: 17px;
  padding-right: 0;
}
#dataPandect .el-input__icon {
  line-height: 30px;
}
#dataPandect .el-pagination__sizes .el-input .el-input__inner {
  width: 108px;
}
#dataPandect .el-icon-loading {
  margin-right: -9px;
}
</style>
<style scoped lang="less">
#dataPandect {
  .order_btn {
    overflow: hidden;
    padding-left: 20px;
    height: 62px;
    // margin-bottom: 20px;
    border-bottom: 1px solid #eaeaea;
    position: relative;
    span {
      display: block;
      cursor: pointer;
      float: left;
      //   width: 136px;
      padding-left: 13px;
      padding-right: 13px;
      height: 58px;
      line-height: 58px;
      font-size: 14px;
      text-align: center;
      position: relative;
      i.num_tip {
        right: -14px;
        top: 7px;
      }
    }
    .activeBtn {
      border-bottom: 3px solid #4a00e0;
    }
  }
  .resourceDialog {
    .el-dialog {
      .el-dialog__header {
        border: none;
      }
      .el-dialog__body {
        padding: 20px 0px;
      }
    }
  }
  .reasonText {
    .el-textarea__inner {
      height: 180px;
      resize: none;
    }
  }
  .el-button--default {
    margin-right: 20px;
  }
  .el-switch__label.is-active {
    color: #393c40;
  }
  .el-switch__label * {
    font-size: 12px;
  }
  .all_active_title {
    position: relative;
  }
  .timeMain {
    height: 64px;
    border-bottom: 1px solid #eaeaea;
    .changeTime_plese {
      height: 30px;
      line-height: 30px;
      margin: 0 20px;
      padding-top: 15px;
    }
    .block {
      margin-top: 15px;
    }
    .elSelect {
      margin-left: 10px;
    }
    .change_moth {
      margin-top: 15px;
      position: relative;
      .change_moth_icon {
        color: #c0c4cc;
        position: absolute;
        top: 9px;
        left: 19px;
        z-index: 2;
      }
    }
  }
  .el-paginationshow {
    visibility: visible;
  }
  .el-paginationhide {
    visibility: hidden;
    // display: none;
  }
  .radioTextred {
    color: #f56c6c;
    font-size: 12px;
  }
  .resourceListFooter {
    .el-button--primary {
      margin-left: 0px;
    }
  }
  .no_dataNum {
    text-align: center;
    font-size: 14px;
    margin-top: 15px;
    font-weight: 700;
  }
  .activeAllot_content {
    .active_pandect {
      margin-bottom: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      border: solid 1px rgba(206, 206, 206, 0.46);
      position: relative;
      .all_active_ban {
        height: 400px;
        padding: 20px;
        .total_Activity {
          font-size: 14px;
          margin-bottom: 20px;
          span {
            margin-right: 35px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #393c40;
            em {
              width: 71px;
              height: 25px;
              font-family: PingFangSC-Semibold;
              font-size: 18px;
              font-weight: 700;
              font-stretch: normal;
              letter-spacing: 0px;
              font-style: normal;
              color: #393c40;
            }
          }
        }
        .total_ActivityTwo {
          margin-bottom: 30px;
        }
        .all_active_left {
          width: 420px;
          height: 300px;
          background-color: #ffffff;
          box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
          border-radius: 8px;
          .myActive {
            .active_item_title {
              i {
                margin-top: 20px;
                margin-left: 20px;
                margin-right: 9px;
                display: inline-block;
                width: 4px;
                height: 14px;
                background-color: #5a0ae0;
              }
              span {
                font-family: PingFangSC-Semibold;
                font-size: 14px;
              }
            }
            #exchangeOrder {
              width: 100%;
              height: 220px;
              top: 20px;
            }
            .myOrderNotice {
              text-align: center;
              margin-top: 10px;
              color: #9a9ea4;
              font-size: 12px;
              span {
                color: red;
              }
            }
          }
        }
        .all_active_right {
          width: 420px;
          height: 300px;
          background-color: #ffffff;
          box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
          border-radius: 8px;

          .myActive {
            .active_item_title {
              i {
                margin-top: 20px;
                margin-left: 20px;
                margin-right: 9px;
                display: inline-block;
                width: 4px;
                height: 14px;
                background-color: #5a0ae0;
              }
              span {
                font-family: PingFangSC-Semibold;
                font-size: 14px;
              }
            }
            #child_exchangeTick {
              width: 100%;
              height: 240px;
            }
            .myOrderNotice {
              text-align: center;
              margin-top: 10px;
              color: #9a9ea4;
              font-size: 12px;
              span {
                color: red;
              }
            }
          }
        }
      }
      .all_active_title {
        overflow: hidden;
        padding: 20px;
        border-bottom: 1px #e0e0e0 solid;
        font-weight: bold;
        i,
        span,
        div {
          float: left;
        }
        div.activeAllot_box_search {
          width: 240px;
          position: absolute;
          right: 18px;
          top: 16px;
          input {
            width: initial;
          }
        }

        .all_active_i {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          margin-top: 2px;
          margin-right: 5px;
        }
        .change_tab {
          margin-left: 20px;
          width: 98px;
          position: relative;
          height: 22px;
          div {
            width: 50px;
            position: absolute;
            height: 20px;
            line-height: 20px;
            background: #e4e4e4;
            border: 1px solid #d2d2d2;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
          }
          .change_tab_mouth {
            left: 0px;
            top: 0px;
          }
          .change_tab_year {
            right: 0px;
            top: 0px;
          }
          .activeTab {
            color: #fff;
            background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
            border: 1px #4900e0 solid;
            z-index: 2;
          }
        }
      }
      .data_list {
        padding: 0px 20px;
        overflow: hidden;
        margin-bottom: 20px;
        li {
          float: left;
          width: 210px;
          b {
            margin-left: 10px;
          }
        }
      }
      #eacharts {
        height: 230px;
        padding-bottom: 20px;
      }
      .eachartsTitle {
        position: absolute;
        left: 20px;
        top: 200px;
        p {
          line-height: 30px;
          margin-bottom: 5px;
          font-size: 12px;
        }
      }
      .up_nodatecl {
        height: 230px;
        line-height: 230px;
        font-size: 14px;
        text-align: center;
        color: #aaaeb3;
        padding-bottom: 20px;
      }
    }
    .activeAllot_box {
      width: 898px;
      min-height: 350px;
      background-color: #ffffff;
      border-radius: 8px;
      border: solid 1px rgba(206, 206, 206, 0.46);
      padding: 20px 0px;
      padding-top: 0;
      .title_seacch_box {
        overflow: hidden;
        padding: 0px 20px;
        .activeAllot_box_title {
          float: left;
          width: 300px;
          height: 32px;
          font-weight: bold;
          i {
            display: block;
            float: left;
            width: 4px;
            height: 14px;
            margin-top: 3px;
            margin-right: 10px;
            background: #5a0ae0;
          }
        }
        .activeAllot_box_search {
        }
      }
      .active_type_tab {
        overflow: hidden;
        padding: 20px;
        border-bottom: 1px #e0e0e0 solid;
        font-weight: bold;
        .all_active_i {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          margin-right: 5px;
          margin-top: 4px;
        }
        li {
          cursor: pointer;
          float: left;
          height: 50px;
          line-height: 50px;
          font-size: 12px;
          color: #aaaeb3;
          padding: 0px 16px;
          margin-right: 30px;
          div {
            position: relative;
            span {
              display: block;
              position: absolute;
              right: -30px;
              top: 0;
              width: 30px;
              height: 16px;
              font-size: 10px;
              color: #fff;
              text-align: center;
              line-height: 16px;
              border-radius: 8px;
              background-color: #e83531;
            }
          }
        }
        .typeActive {
          font-size: 14px;
          color: #393c40;
          border-bottom: 3px #4900e0 solid;
          span {
            background: #e83531;
          }
        }
      }
      .state_tab {
        font-size: 12px;
        overflow: hidden;
        padding: 25px 20px 0px 20px;
        p,
        ul {
          float: left;
        }
        ul {
          overflow: hidden;
          li {
            cursor: pointer;
            float: left;
            padding-left: 25px;
            color: #aaaeb3;
            i {
              display: inline-block;
              width: 1px;
              height: 10px;
              background: #c0c0c0;
              margin-left: 25px;
            }
            span {
              display: inline-block;
            }
          }
          .stateActive {
            color: #393c40;
            span {
              padding-bottom: 4px;
              border-bottom: 1px #4900e0 solid;
            }
          }
        }
      }
      .activeAllot_list {
        min-height: 500px;
        position: relative;
        .activeAllot_list_ul {
          padding-top: 20px;
          overflow: hidden;
          .activeAllot_list_li {
            width: 420px;
            height: 220px;
            margin-left: 19px;
            margin-bottom: 20px;
            position: relative;
            float: left;
            cursor: pointer;
            box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
            .activeAllot_state {
              position: relative;
              height: 69px;
              border-bottom: 1px #d7d7d7 solid;
              padding: 0px 15px;
              .activeAllot_state_img {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 54px;
                height: 54px;
              }
              .brand_title {
                padding-top: 15px;
                span {
                  font-size: 10px;
                  padding: 2px 10px;
                  background-color: #ebebeb;
                  border-radius: 6px;
                  margin-right: 6px;
                }
              }
              p {
                font-size: 12px;
                padding-top: 10px;
                .active_name {
                  float: left;
                }
                .operation_name {
                  float: right;
                  padding-right: 10px;
                }
              }
            }
            .list_all {
              margin-top: 14px;
              ul {
                li {
                  float: left;
                  width: 124px;
                  height: 56px;
                  margin-left: 12px;
                  background-image: linear-gradient(
                    143deg,
                    #67d7ff 0%,
                    #36aeff 100%
                  );
                  padding: 5px;
                  box-sizing: border-box;
                  color: #fff;
                  box-shadow: 0px 2px 20px 0px rgba(219, 219, 219, 0.5);
                  border-radius: 4px;
                  span {
                    font-size: 12px;
                  }
                  p {
                    text-align: center;
                    font-size: 14px;
                    margin-top: 5px;
                  }
                }
                .all_orders {
                  background: url(../../../assets/images/images/order1.png)
                    no-repeat center;
                  background-size: 100% 100%;
                }
                .sucess_orders {
                  background: url(../../../assets/images/images/order3.png)
                    no-repeat center;
                  background-size: 100% 100%;
                }
                .fail_orders {
                  background: url(../../../assets/images/images/order2.png)
                    no-repeat center;
                  background-size: 100% 100%;
                }
              }
            }
            .activeAllot_msg {
              padding: 10px;
              font-size: 12px;
              overflow: hidden;
              .activeAllot_msg_left {
                float: left;
                width: 250px;
                .onlyOne {
                  display: block;
                  width: 100%;
                  text-align: center;
                }
                .time_year {
                  font-size: 12px;
                  color: #acb0b5;
                  overflow: hidden;
                  text-align: center;
                  .start_year {
                    float: left;
                  }
                  .end_tear {
                    float: right;
                  }
                }
                .time_line {
                  width: 100%;
                  height: 5px;
                  background-color: #d7d7d7;
                  border-radius: 3px;
                  margin-top: 5px;
                  div {
                    width: 6px;
                    height: 5px;
                    background-color: #5ac1ff;
                    border-radius: 3px;
                  }
                  span {
                    display: block;
                    width: 5px;
                    height: 5px;
                    background-color: #5ac1ff;
                    border-radius: 50%;
                  }
                }
                .time_day {
                  font-size: 12px;
                  overflow: hidden;
                  margin-top: 7px;
                  .start_day {
                    float: left;
                  }
                  .end_day {
                    float: right;
                  }
                }
                .allot_resource {
                  margin-top: 10px;
                  font-size: 12px;
                  overflow: hidden;
                  .resource_num {
                    float: left;
                    overflow: hidden;
                    div {
                      float: left;
                      padding-left: 15px;
                    }
                    .authorization {
                      background: url(../../../assets/images/images/resourse.png)
                        no-repeat left center;
                      background-size: 12px 12px;
                    }
                    span {
                      float: left;
                      color: #ffb735;
                      padding-left: 15px;
                    }
                  }
                  .allot_name {
                    float: right;
                  }
                }
              }
              .activeAllot_msg_right {
                float: right;
                margin-right: 15px;
                margin-top: 12px;
                img {
                  display: block;
                  width: 90px;
                  height: 90px;
                  margin-left: 22px;
                }
                p {
                  width: 90px;
                  height: 40px;
                  line-height: 40px;
                  text-align: center;
                  color: #ffffff;
                  font-size: 12px;
                  background-image: linear-gradient(
                    42deg,
                    #8d2de2 0%,
                    #4900e0 100%
                  );
                  border-radius: 5px;
                  .el-icon-view {
                    margin-right: 5px;
                  }
                }
              }
              .turn_down {
                margin-top: 10px;
                overflow: hidden;
                .yuanshi_code,
                .pingtai_code {
                  float: left;
                }
                .yuanshi_code {
                  line-height: 50px;
                  margin-right: 15px;
                }
                .pingtai_code {
                  p {
                    line-height: 25px;
                  }
                }
              }
            }
          }
          li:hover {
            webkit-box-shadow: 0 11px 21px #bfb2b2;
            box-shadow: 0 11px 21px #bfb2b2;
            transition: all 0.5s;
          }
        }
      }
    }
  }
  .no_img {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    p {
      text-align: center;
      color: #aaaeb3;
    }
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
          img {
            width: 30px;
            height: 30px;
            display: block;
            margin-right: 5px;
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
  .resourceDialog {
    .resourceList {
      .resourceList_title {
        border-bottom: 1px #ecedef solid;
        margin-bottom: 10px;
        padding: 10px 20px 5px 20px;
        font-weight: bold;
        i {
          display: block;
          width: 4px;
          height: 14px;
          background-color: #5a0ae0;
          float: left;
          margin-top: 2px;
          margin-right: 5px;
        }
      }
      ul {
        overflow: hidden;
        padding: 0px 20px;
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
            img {
              width: 30px;
              height: 30px;
              display: block;
              margin-right: 5px;
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
  }
}
</style>
