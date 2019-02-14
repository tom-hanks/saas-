<template>
  <div id="exchangDataDetail">
    <p class="content-title">
      <span>数据统计</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">兑换平台</span>
    </p>
    <div class="returnBtn" @click="backUp">
      <i></i> 返回
    </div>
    <div class="preview_content" v-loading="lookToploading">
      <p class="preview_title">
        <span></span> 基础信息
      </p>
      <div class="preview_header">
        <p
          class="preview_title active_name"
        >{{appDetaildata.app_num}}&nbsp;&nbsp;—&nbsp;&nbsp;{{appDetaildata.app_name}}</p>
        <p class="preview_active_item preview_resouce">
          <span>
            授权资源数：{{appDetaildata.grant_material}}个
            <i
              class="el-icon-view"
              @click="lookResouceDialog"
            >查看</i>
          </span>
          <span>活动类型：{{appDetaildata.type_name}}</span>
        </p>
        <p class="preview_active_item link">
          活动预览：
          <span v-if="isWeixinCode">
            <a :href="appDetaildata.domainurl" target="view_window">{{appDetaildata.domainurl}}</a>
          </span>
          <span v-if="!isWeixinCode">本活动中不包含平台码，无H5页面</span>
        </p>
        <p class="resouce">
          发放时间：
          <span @click="lookResouce">
            <i class="el-icon-view"></i>查看各资源发放时间
          </span>
        </p>
        <p
          class="preview_active_item"
        >项目周期：{{appDetaildata.onlinetime}}至{{appDetaildata.offlinetime}}</p>
        <div id="indexLaga">
          <div class="weixin_code" v-if="isWeixinCode">
            <img :src="appDetaildata.qrcode" alt="二维码">
          </div>
          <div class="weixin_code" v-if="!isWeixinCode">
            <img class="active_header_img" src="../../../assets/images/images/noSet.png" alt>
            <!-- <p>点击查看详细配置规则</p> -->
          </div>
        </div>
      </div>
    </div>
    <div class="preview_content clearfix exchang_data">
      <p class="preview_title fl">
        <span></span>资源使用数据
      </p>
      <div class="selectResouce fl">
        <el-select v-model="selectValue" @change="selectisSued">
          <el-option label="全部资源" value="0"></el-option>
          <el-option
            v-for="(item,index) in isSued"
            :key="index"
            :label="item.material_name"
            :value="item.mid_material_allot_id"
          ></el-option>
          <!-- <el-option label="资源一" value="2"></el-option>
                    <el-option label="资源二" value="3"></el-option>
          <el-option label="资源三" value="4"></el-option>-->
        </el-select>
      </div>
      <div class="block fl" style="margin-right:20px">
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
      <div class="block fl" style="width:100px;margin-right:20px">
        <el-date-picker
          v-model="valueYear"
          @change="changeYear"
          type="year"
          :clearable="false"
          format="yyyy年"
          :picker-options="pickerOptions0"
          style="width:130px"
          placeholder="选择年"
        ></el-date-picker>
      </div>
      <div class="fl change_moth">
        <i class="el-icon-date change_moth_icon"></i>
        <el-select
          v-model="valueMonth"
          @change="changeSelect"
          class="elSelect"
          style="width:120px"
          placeholder="选择月"
        >
          <el-option
            v-for="item in optionSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="exportbtn_box">
        <div class="exportbtn" @click="exportCost">
          <i class="exportIcon"></i>成本核算导出
        </div>
        <p class="exportbtn_notice">
          <span class="red_star">*</span>原始码和已兑换码数据汇总
        </p>
      </div>
      <!-- canvas绘图部分 -->
      <div class="all_active_ban">
        <div class="all_active_left fl">
          <div class="active_item myActive">
            <div class="active_item_title">
              <i></i>
              <span>兑换码</span>
            </div>
            <div id="child_exchangeOrder"></div>
          </div>
        </div>
        <div class="all_active_right fr">
          <div class="active_item myActive">
            <div class="active_item_title">
              <i></i>
              <span>充值金额</span>
            </div>
            <div id="exchangeTick"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview_content data_detail" v-loading="loading">
      <p class="preview_title">
        <span></span>详细数据
      </p>
      <div class="table">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th>订单编号</th>
            <th>资源类型</th>
            <th>资源名称</th>
            <th>发放类型</th>
            <th>发放号码</th>
            <th>兑换次数</th>
            <th>充值金额</th>
            <th>兑换时间</th>
            <th>状态</th>
            <!-- <th>原始码</th> -->
          </tr>
          <tr v-for="(item,index) in itemList" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.material_type_name}}</td>
            <td class="material_name_long" :title="item.material_name">
              <div>{{item.material_name}}</div>
            </td>
            <td v-if="item.grant_type == 1">平台码</td>
            <td v-if="item.grant_type == 2">原始码</td>
            <td v-if="item.grant_type == 3">直接充值</td>

            <td>{{item.resms_mobile?item.resms_mobile:item.recharge_number}}</td>
            <td>{{item.grant_type == 3?'— —':item.exchange_count}}</td>
            <td>{{item.grant_type == 3?item.recharge_count:'— —'}}</td>
            <td>{{item.exchange_date_time?item.exchange_date_time:'— —'}}</td>
            <!-- 已有的注释掉 -->
            <td
              width="10%"
              v-if="item.grant_type == 1 && item.order_status<=0 && item.is_send_message == 1"
            >
              <span style="position: relative;">
                <i class="no_change"></i>未兑换
              </span>
            </td>
            <td width="10%" v-else-if="item.order_status==0 && item.is_send_message == -1">
              <i class="faile_icon"></i>发放失败
            </td>
            <td width="10%" v-else-if="item.order_status==0 && item.is_send_message == 1">
              <i class="fafang_icon"></i>发放成功
            </td>
            <td width="10%" style="position: relative;" v-else-if="item.order_status == 5">
              <i class="stay_out_icon"></i>充值中
            </td>
            <td width="10%" v-else-if="item.order_status == 1">
              <i class="success_icon"></i>兑换成功
            </td>
            <td width="10%" v-else-if="item.order_status == 2">
              <i class="success_icon"></i>充值成功
            </td>
            <td width="10%" v-else-if="item.order_status == 3">
              <i class="faile_icon"></i>兑换失败
            </td>
            <td width="10%" v-else-if="item.order_status == 4">
              <i class="faile_icon"></i>充值失败
            </td>
            <td width="10%" v-else>— —</td>
          </tr>
        </table>
        <p class="nodata_tip" v-if="nodata_tip">暂无数据</p>
      </div>
    </div>
    <!-- 查看资源发放时间  弹框 -->
    <el-dialog class="ediAwardDialog showNameListDialog" title="派发名单" :visible.sync="showNameList">
      <table class="NameList_table" cellspacing="0" cellpadding="0" border="0px">
        <tr class="NameList_table_title">
          <th>序号</th>
          <th>icon</th>
          <th>资源名称</th>
          <th>发放时间</th>
        </tr>
        <tr v-for="(item,index) in isSued" :key="index">
          <td>{{index+1}}</td>
          <td class="td_img_f">
            <img :src="item.icon" alt>
          </td>
          <td>{{item.material_name}}</td>
          <td>{{item.release_time}}</td>
        </tr>
      </table>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="showRedPackageDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="showNameList = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看资源的弹框 -->
    <el-dialog title="授权资源" :visible.sync="showResouceDialog" class="resourceDialog">
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>授权资源
        </p>
        <ul>
          <li :title="item.material_name" v-for="(item,index) in Hairresources" :key="index">
            <span class="resouce_num">{{index+1}}</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="item.icon" alt="资源图片">
              </div>
              <span>{{item.material_name}}</span>
            </div>
          </li>
          <p v-if="Hairresources.length<=0" style="text-align:center">暂无使用资源</p>
        </ul>
      </div>
      <div class="resourceList">
        <p class="resourceList_title">
          <i></i>使用资源
        </p>
        <ul>
          <li :title="item.material_name" v-for="(item,index) in isSued" :key="index">
            <span class="resouce_num">{{index+1}}</span>
            <div class="resouce_name">
              <div class="resouce_img_f">
                <img :src="item.icon" alt="资源图片">
              </div>
              <span>{{item.material_name}}</span>
            </div>
          </li>
          <p v-if="isSued.length<=0" style="text-align:center">暂无使用资源</p>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer resourceListFooter">
        <el-button type="primary" @click="showResouceDialog = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导出报表弹框 -->
    <download-popup
      :childModel="childArry"
      @childByValue="childByValue"
      @childByfatherSuccess="childByfatherSuccess"
    ></download-popup>
    <saas-dialog :html="html" v-if="showSaasDialog"></saas-dialog>

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
const downloadPopup = () =>
  import(/* webpackChunkName:"downloadPopup" */ "../../dialog/downloadPopup");
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
export default {
  name: "exchangDataDetail",
  props: {},
  components: {
    downloadPopup,
    saasDialog
  },
  data() {
    return {
      loading: false,
      valueYear: "", //年的选择器
      valueMonth: "", //月选择器
      valueday: "", //天
      valuedayModel: {
        yearNum: "",
        monthNum: "",
        dayNume: ""
      },
      lookToploading: true,
      isWeixinCode: false,
      showNameList: false,
      showResouceDialog: false,
      showSaasDialog: false,
      childArry: {
        //导出报表弹框 --通知给子组件的
        showReportDialog: false,
        appId: this.$getsessionStorage("appid"),
        routernName: "exchangDataDetail"
      },
      dataList: [],
      itemList: [],
      page: page,
      loading: true,
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      nodata_tip: false, //表格有无数据 的暂无数据提示
      no_data: false,
      Hairresources: [], //第一个资源弹窗里的上半部分
      isSued: [], //发放时间的列表
      appDetaildata: {}, // 接收上半部分信息的数据
      redeem_exchange_count: "", //平台码兑换量
      redeem_release_count: "", //平台码发放量
      origin_release_count: "", //原始码发放量
      company: "", //单位
      echaers_data: [], //柱状图用的数组
      selectValue: "0", //select全部资源
      grant_typeNumber: 0,
      seleloading: true,
      value: "全部资源",
      select_tmid_material_allot_id: "0", //记录mid_material_allot_id
      reportForm: {
        radio2: "", // 单选按钮   选中的值
        disabled: false, //如果选择自定义才可以输入，
        input: "", //预警通知弹窗的input追加邮箱的相应绑定
        textTip: "",
        arryList: [],
        istextTip: false
      },
      reportRules: {},
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
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      arryLists: [2, 8, 2] //模拟数据
    };
  },
  created() {
    this.page.pageIndex = 1;
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
    console.log(this.valueday);
  },
  mounted() {
    this.getAppdetailTop();

    // 此处为图片查看器
    const ViewerDom = document.getElementById("indexLaga");
    const viewer = new Viewer(ViewerDom, {
      // 配置
    });

    // this.drawBar();
    this.reportGetAppSummary();
    this.getUseMaterialByAppId();
    this.getMaterialInfo();
    let $emit = this;
    $emit.page.pageSize = 30; //修改每页显示数
    $emit.page.pageSizeList = [30, 60, 90]; //修改可以下拉框选择的每页显示数
    this.reportGetAppList();

    //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.reportGetAppList($emit.typeid);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.reportGetApprderList.page = this.page; //api接口分页赋值
    apiSetting.reportGetApprderList.dataList = this.dataList; //api分页数据赋值
  },
  methods: {
    drawMyTick() {
      var MyOrderChart = this.$echarts.init(
        document.getElementById("exchangeTick")
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
        document.getElementById("child_exchangeOrder")
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
            radius: "70%",
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
    selectisSued(value) {
      console.log(value);

      this.page.pageIndex = 1;
      if (value != 0) {
        //代表着只要不是默认等于0的时候
        this.selectshowAll = false;
        let obj = {};
        obj = this.isSued.find(item => {
          //这里的userList就是上面遍历的数据源
          return item.mid_material_allot_id === value; //筛选出匹配数据
        });
        this.select_tmid_material_allot_id = obj.mid_material_allot_id;
        console.log("我是canvas的select");
        console.log(obj.grant_type);
      } else {
        this.grant_typeNumber = 0;
        this.select_tmid_material_allot_id = 0;
      }
      this.reportGetAppSummary(); //绘图
      this.reportGetAppList(); //表格部分
    },

    //成本核算导出
    exportCost() {
      this.childArry.showReportDialog = true;
    },
    // 和子组件通信---导出弹窗--子组件传过来的方法和参数
    childByValue(childByValue) {
      console.log("我是子组件传过来的");
      console.log(childByValue);
      this.childArry.showReportDialog = childByValue.childshow;
    },
    // 和子组件通信---导出弹窗--子组件传过来的方法和参数
    childByfatherSuccess(childByfatherSuccess) {
      this.childArry.showReportDialog = !childByfatherSuccess;
      this.html = "<p>操作成功</p>";
      this.showSaasDialog = childByfatherSuccess;
      let _this = this;
      let timer = setTimeout(function() {
        _this.showSaasDialog = false;
      }, 2000);
    },
    backUp() {
      this.$router.back(-1);
    },
    lookResouce() {
      this.showNameList = true;
    },
    lookResouceDialog() {
      // alert("sss");
      this.showResouceDialog = true;
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
      this.reportGetAppSummary();
      console.log(this.valuedayModel.yearNum);
      console.log(this.valuedayModel.monthNum);
      console.log(this.valuedayModel.dayNume);
    },
    changeYear(index) {
      this.page.pageIndex = 1;

      this.valueMonth = "";
      let date_Year = new Date(index);
      this.valueYear = "" + date_Year.getFullYear();
      this.valueday = "";
      this.dayNume = "";
      console.log("我是选择年", this.valueYear);
      this.reportGetAppSummary();
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
      this.reportGetAppSummary();
      console.log(index);
    },
    // 获取活动预览的   上半部分信息
    getAppdetailTop() {
      httpServer(apiSetting.appDetailTop, {
        appId: this.$getsessionStorage("appid"),
        template_id: this.$getsessionStorage("template_id")
      })
        .then(response => {
          console.log("是吧是吧");
          console.log(response);
          this.appDetaildata = response;
          this.lookToploading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getMaterialInfo() {
      httpServer(apiSetting.getMaterialInfo, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          this.Hairresources = response;
        })
        .catch(error => {
          // this.loading = false;
        });
    },
    getUseMaterialByAppId() {
      //发放时间的弹窗
      httpServer(apiSetting.getUseMaterialByAppId, {
        app_id: this.$getsessionStorage("appid")
      })
        .then(response => {
          console.log("发放时间");
          console.log(response);
          this.isSued = response;
          // 判断 下半部分 资源列表 是否含有平台码
          for (var i in response) {
            if (response[i].grant_type == 1) {
              this.isWeixinCode = true;
            }
          }
        })
        .catch(error => {
          // this.loading = false;
        });
    },
    reportGetAppList() {
      this.itemListloading = false;
      this.loading = true;
      //表格部分
      httpServer(apiSetting.reportGetApprderList, {
        mid_material_allot_id: this.select_tmid_material_allot_id,
        release_status: 0, //0全部 1正确的  -1错误的
        PageIndex: this.page.pageIndex,
        PageSize: this.page.pageSize,
        app_id: this.$getsessionStorage("appid"),
        Conditions: "" //搜索条件
      })
        .then(response => {
          console.log("我是二页表格部分");
          this.dataList = apiSetting.reportGetApprderList.dataList;
          this.itemList = apiSetting.reportGetApprderList.dataList;
          this.itemListloading = true;
          this.loading = false;
          if (apiSetting.reportGetApprderList.dataList.length <= 0) {
            this.nodata_tip = true;
            this.no_data = true;
          }
          console.log(apiSetting.reportGetApprderList.dataList.length);
        })
        .catch(error => {
          this.loading = false;
        });
    },
    reportGetAppSummary() {
      //绘制canvas
      httpServer(apiSetting.summaryExchangeReport, {
        beginyear: this.valueday ? this.valuedayModel.yearNum : this.valueYear, //年
        beginmonth: this.valueday
          ? this.valuedayModel.monthNum
          : this.valueMonth, //月
        day: this.valueday ? this.valuedayModel.dayNume : "", //日,没有传默认
        app_id: this.$getsessionStorage("appid"),
        mid_material_allot_id: this.select_tmid_material_allot_id
      })
        .then(response => {
          console.log("我是二页canvas部分");
          console.log(response);
          this.redeem_exchange_count = response.redeem_exchange_count;

          this.redeem_release_count = response.redeem_release_count;
          this.origin_release_count = response.origin_release_count;
          this.company = response.recharge_amount_statistics.date_unit; //天
          this.echaers_data =
            response.recharge_amount_statistics.recharge_amount_minute_list;
          this.seleloading = false; //canvas画图的loading
          this.$nextTick(function() {
            this.drawMyOrder(
              this.origin_release_count,
              this.redeem_release_count,
              this.redeem_exchange_count
            );
            this.drawMyTick();
          });
        })
        .catch(error => {
          this.loading = false;
        });
    },
    drawTwoOrder(
      origin_release_count,
      redeem_release_count,
      redeem_exchange_count
    ) {
      var MyOrderChart = this.$echarts.init(
        document.getElementById("child_exchangeOrder")
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
                name: `原始码发放量:${origin_release_count}`
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
                name: "平台码已兑换:" + `${redeem_exchange_count}`
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
    }
  },
  destroyed() {
    let $emit = this;
    $emit.page.pageIndex = 1;
    $emit.page.pageSize = 4; //修改每页显示数
    $emit.page.pageSizeList = [4, 8, 12, 16, 20, 24]; //修改可以下拉框选择的每页显示数
  }
};
</script>
<style>
#exchangDataDetail .resourceDialog .el-dialog .el-dialog__header {
  border: none;
}
#exchangDataDetail .resourceDialog .el-dialog .el-dialog__body {
  padding: 20px 0px;
}
#exchangDataDetail .selectResouce .el-input__inner {
  text-indent: 0px;
}
#exchangDataDetail .el-input {
  font-size: 12px;
}
#exchangDataDetail .selectResouce .el-input__icon {
  line-height: 32px;
}
#exchangDataDetail .block .el-date-editor {
  width: 130px;
}
#exchangDataDetail .block .el-date-editor--year .el-input__inner {
  width: 100px;
}
#exchangDataDetail .el-input--suffix .el-input__inner {
  padding-right: 0;
}
#exchangDataDetail .change_moth .el-input__icon {
  line-height: 34px;
  margin-right: 16px;
}
#exchangDataDetail .change_moth {
  position: relative;
}
#exchangDataDetail .change_moth .el-input--suffix .el-input__inner {
  width: 100px;
}
#exchangDataDetail .el-input--prefix .el-input__inner {
  padding-left: 20px;
}
#exchangDataDetail .change_moth .el-icon-date {
  position: absolute;
  top: 9px;
  left: 8px;
  z-index: 2;
  color: #c0c4cc;
}
#exchangDataDetail i.el-input__icon.el-icon-date {
  line-height: 24px;
}
#exchangDataDetail .showNameListDialog .el-dialog__body {
  overflow-x: auto;
}
</style>
<style scoped lang="less">
#exchangDataDetail {
  .returnBtn {
    width: 110px;
    height: 36px;
    background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
    border-radius: 5px;
    color: #fff;
    text-indent: 15px;
    line-height: 36px;
    margin-bottom: 15px;
    cursor: pointer;
    i {
      display: block;
      float: left;
      width: 20px;
      height: 36px;
      background: url(../../../assets/images/images/return.png) no-repeat center;
      background-size: 20px 15px;
      margin-left: 15px;
    }
  }
  .preview_content {
    // width: 860px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    padding: 20px;
    margin-bottom: 20px;
    .preview_title {
      font-weight: bold;
      margin-bottom: 20px;
      span {
        display: block;
        float: left;
        width: 4px;
        height: 14px;
        background: #5a0ae0;
        margin-top: 3px;
        margin-right: 5px;
      }
    }
    .preview_header {
      position: relative;
      .active_name {
        margin-bottom: 15px;
      }
      .preview_active_item {
        margin-bottom: 10px;
        span {
          display: inline-block;
          vertical-align: top;
          word-break: break-all;
          width: 73%;
        }
      }
      .preview_resouce {
        span {
          width: 230px;
          .el-icon-view {
            color: #ffb834;
            margin-left: 10px;
            cursor: pointer;
          }
          .el-icon-view:hover {
            color: #393c40;
          }
        }
      }
      .resouce {
        width: 300px;
        margin-bottom: 10px;
        span {
          color: #ffb834;
          cursor: pointer;
        }
        span:hover {
          color: #393c40;
        }
        .el-icon-arrow-up {
          color: #5a0ae0;
          transition: transform 0.3s, -webkit-transform 0.3s;
        }
        .arrowDown {
          transform: rotateZ(180deg);
        }
      }
      .link {
        span {
          cursor: pointer;
          a {
            color: #1959ff;
          }
        }
      }
    }
    .weixin_code {
      position: absolute;
      right: 0px;
      top: -10px;
      width: 140px;
      text-align: center;
      cursor: pointer;
      img {
        display: inline-block;
        width: 93px;
        height: 93px;
      }
      p {
        width: 100%;
        text-align: center;
        color: #ffb834;
      }
    }
  }
  .exchang_data {
    height: 376px;
    position: relative;
    padding-top: 17px;
    .preview_title {
      //   position: absolute;
      margin-top: 4px;
    }
    #echarts {
      height: 180px;
      margin-top: 50px;
    }
    #platEcharts {
      height: 230px;
    }
    .oneDom {
      top: 100px;
    }
    .eachartsTitle {
      position: absolute;
      left: 20px;
      top: 100px;
      p {
        line-height: 30px;
        margin-bottom: 5px;
        font-size: 12px;
      }
      .yuanshi {
        margin-top: 50px;
      }
      .pingtai {
        margin-top: 130px;
      }
    }
    .selectResouce {
      width: 180px;
      margin-left: 10px;
      margin-right: 20px;
      //   position: absolute;
      //   top: 15px;
      //   left: 130px;
    }
    .exportbtn_box {
      position: absolute;
      right: 30px;
      top: 12px;
      .exportbtn {
        width: 135px;
        height: 36px;
        margin-left: 10px;
        background-image: linear-gradient(42deg, #00b4ff 0%, #23d7ff 100%);
        border-radius: 4px;
        color: #fff;
        line-height: 36px;
        cursor: pointer;
        .exportIcon {
          display: block;
          float: left;
          width: 14px;
          height: 14px;
          background: url(../../../assets/images/images/exportBtn.png) no-repeat;
          background-size: 100% 100%;
          margin-top: 11px;
          margin-left: 15px;
          margin-right: 10px;
        }
      }
      .exportbtn_notice {
        color: #9a9ea4;
        font-size: 12px;
      }
    }
    .all_active_ban {
      margin-top: 75px;
      .all_active_left {
        width: 420px;
        height: 300px;
        background-color: #ffffff;
        box-shadow: 0px 2px 15px 0px rgba(210, 210, 210, 0.45);
        border-radius: 8px;
        .myActive {
          // margin-right: 16px;
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
          #child_exchangeOrder {
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
          // margin-right: 16px;
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
          #exchangeTick {
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
  }
  .data_detail {
    padding: 0px;
    width: 900px;
    .preview_title {
      padding-left: 20px;
      padding-top: 20px;
    }
    .nodata_tip {
      width: 100%;
      height: 228px;
      line-height: 228px;
      font-size: 14px;
      text-align: center;
      color: #aaaeb3;
    }
    .table {
      padding-bottom: 20px;
      min-height: 300px;
      table {
        width: 100%;
        tr {
          th {
            background-color: #f5f5f5;
            line-height: 40px;
            color: #aaaeb3;
            font-size: 12px;
          }
          td {
            text-align: center;
            line-height: 70px;
            border-bottom: 1px #ecedef solid;
            font-size: 12px;
            .success_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #00c388;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .fafang_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #37afff;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .faile_icon {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #f85a3c;
              border-radius: 50%;
              margin-top: 30px;
              margin-right: 5px;
            }
            .stay_out_icon {
              display: inline-block;
              width: 13px;
              height: 13px;
              vertical-align: middle;
              background: url(../../../assets/images/images/stayOut.png)
                no-repeat center;
              background-size: 100%;
              position: absolute;
              top: 29px;
              left: 9px;
            }
            .no_change {
              display: inline-block;
              width: 13px;
              height: 13px;
              vertical-align: middle;
              background: url(../../../assets/images/images/no_exchange1.png)
                no-repeat;
              background-size: 100%;
              position: absolute;
              top: 3px;
              left: -16px;
            }
          }
          .material_name_long {
            div {
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .showNameListDialog {
    .NameList_table {
      width: 100%;
      margin-bottom: 20px;
      tr {
        height: 50px;
        th {
          background: #f5f5f5;
          color: #aaaeb3;
          font-size: 12px;
        }
        td.td_img_f {
          line-height: 40px;
          /* display: inline-block; */
          width: 30px;
          height: 30px;
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
        td {
          text-align: center;
          font-size: 12px;
          border-bottom: 1px solid #ecedef;
        }
      }
      .NameList_table_title {
        height: 40px;
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
  }
}
</style>
