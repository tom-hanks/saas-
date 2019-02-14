<template>
  <div id="welcome" v-loading="loading">
    <p class="content-title">
      <span class="content-last-title">首页</span>
    </p>
    <div class="welcome_box">
      <div class="welcome_header">
        <div class="header_img">
          <img :src="head_img" alt>
        </div>
        <div class="welcome_name">
          <p class="name">
            {{hello}}
            <span v-show="real_name">，</span>
            {{real_name}}
          </p>
          <p class="position">
            {{department_name}}
            <span v-if="position_name">-{{position_name}}</span>
          </p>
        </div>
        <div class="welcome_weather">
          <div class="weather_img" v-if="data.weather=='多云'">
            <img src="../assets/images/images/cloudy.png" alt>
          </div>
          <div class="weather_img" v-if="data.weather=='雨'|| data.weather=='小雨转多云'">
            <img src="../assets/images/images/rain.png" alt>
          </div>
          <div
            class="weather_img"
            v-if="data.weather !='雨' && data.weather!='小雨转多云' && data.weather!='多云'"
          >
            <img src="../assets/images/images/sun.png" alt>
          </div>
          <!-- <div class="weather_img" v-if="data.weather='晴'"><img src="../assets/images/images/sun.png" alt=""></div> -->
          <div class="weather_time">
            <div>
              <h1>{{weather}}°</h1>
              <span>{{data.weather}}</span>
            </div>
            <p>
              {{year}}
              <span v-if="month">-</span>
              {{month}}
              <span v-if="NewDate">-</span>
              {{NewDate}}&nbsp;&nbsp;
              {{week}}&nbsp;&nbsp;
              {{hour}}
              <span
                v-if="minutes"
              >:</span>
              {{minutes}}
              <span v-if="second">:</span>
              {{second}}
            </p>
          </div>
        </div>
      </div>
      <div class="active_list">
        <div class="active_item myActive">
          <div class="active_item_title">
            <i></i>
            <span>我的活动</span>
          </div>
          <div v-show="!isShowMyActive" id="myOrder"></div>
          <p v-show="!isShowMyActive" class="myOrderNotice">
            <span>*</span>具体信息请到我的活动中查看
          </p>
          <div v-if="isShowMyActive" class="noActive">
            <img src="../assets/images/images/nodata.png" alt>
            <p>暂无活动</p>
          </div>
        </div>
        <div class="active_item">
          <div class="active_item_title">
            <i></i>
            <span>待分配活动</span>
            <div class="active_totle">总数：{{total_count}}个</div>
          </div>
          <div id="allotActive"></div>
          <span class="onlineTime">距上线时间</span>
        </div>
        <div class="active_item audit_active">
          <div class="active_item_title">
            <i></i>
            <span>待审核活动</span>
            <div class="active_totle">总数：{{total_count_audit}}个</div>
          </div>
          <div id="auditActive"></div>
          <span class="onlineTime">距上线时间</span>
        </div>
        <div class="active_item">
          <div class="active_item_title">
            <i></i>
            <span>我的数据</span>
            <el-date-picker
              class="selectYear"
              v-model="valueYear"
              :clearable="false"
              format="yyyy 年"
              type="year"
              :picker-options="pickerOptions0"
              @change="changeYear"
              placeholder="选择年"
            ></el-date-picker>
          </div>
          <div id="myData"></div>
          <div class="myDataTab">
            <div @click="changeMyDataTab(1)" class="online" :class="{'activeTab':MyDataTabNum ==1}">
              <div>
                <span></span>上线活动统计
              </div>
              <p>{{online_count}}</p>
            </div>
            <div
              @click="changeMyDataTab(2)"
              class="exchange"
              :class="{'activeTab':MyDataTabNum ==2}"
            >
              <div>
                <span></span>兑换数
              </div>
              <p>{{exchange_count}}</p>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <!-- <div class="active_item"><img src="../assets/images/images/myActive.png" alt=""></div>
                <div><img src="../assets/images/images/distribution.png" alt=""></div>
                <div class="active_item"><img src="../assets/images/images/waudit.png" alt=""></div>
        <div><img src="../assets/images/images/data.png" alt=""></div>-->
      </div>
    </div>
  </div>
</template>
<script>
// import $ from "jquery";
import { httpServer, apiSetting } from "../assets/js/http.js";
import jsonp from "jsonp";
export default {
  name: "welcome",
  components: {},
  data() {
    return {
      head_img: "",
      hello: "",
      real_name: "", //姓名
      department_name: "", //部门
      position_name: "",
      data: {},
      week: "",
      date: "",
      weather: "",
      address: "",
      now: {},
      year: "",
      month: "",
      NewDate: "",
      day: "",
      hour: "",
      minutes: "",
      second: "",
      now_time: "",
      loading: true,
      tab_date: 1,
      MyDataTabNum: 1,
      // 我的活动的数据
      changeActive: "",
      directActive: "",
      upReceiptActive: "",
      PDQActive: "",
      OneThingActive: "",
      isShowMyActive: false,
      // 待分配活动
      total_count: "",
      changeAllot: [],
      directAllot: [],
      upReceiptAllot: [],
      PDQAllot: [],
      OneThingAllot: [],
      // 待审核活动
      total_count_audit: "",
      changeAudit: [],
      directAudit: [],
      upReceiptAudit: [],
      PDQAudit: [],
      OneThingAudit: [],
      // 我的数据
      exchange_count: "",
      online_count: "",
      returnMyData: [],
      valueYear: "2018",
      $color: "#4d65fb",
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      }
    };
  },
  mounted() {
    console.log("我是首页");
    this.getPersonNews();
    // this.getWeather();
    this.getAddress();
    this.getMyOrder();
    this.getAllotActive();
    this.getAuditActive();
    this.getMyData();
  },
  methods: {
    getPersonNews() {
      this.loading = true;
      httpServer(apiSetting.getThisuser)
        .then(response => {
          this.real_name = response.real_name;
          this.head_img = response.head_img;
          if (new Date().getHours() > 0 && new Date().getHours() <= 6) {
            this.hello = "早上好";
          } else if (new Date().getHours() > 6 && new Date().getHours() <= 12) {
            this.hello = "上午好";
          } else if (
            new Date().getHours() > 12 &&
            new Date().getHours() <= 18
          ) {
            this.hello = "下午好";
          } else {
            this.hello = "晚上好";
          }
          if (response.position_id) {
            this.position_name = response.position_name;
            this.department_name = response.department_name;
          } else {
            this.department_name = response.organization_name;
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    },
    showTime() {
      this.week = new Array(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      );
      this.now = new Date();
      this.year = this.now.getFullYear();
      this.month = this.now.getMonth();
      this.NewDate = this.now.getDate();
      this.day = this.now.getDay();
      this.hour = this.now.getHours();
      this.minutes = this.now.getMinutes();
      this.second = this.now.getSeconds();
      this.month = this.month + 1;
      this.month < 10 ? (this.month = "0" + this.month) : this.month;
      this.hour < 10 ? (this.hour = "0" + this.hour) : this.hour;
      this.minutes < 10 ? (this.minutes = "0" + this.minutes) : this.minutes;
      this.second < 10 ? (this.second = "0" + this.second) : this.second;
      this.week = this.week[this.day];
      // this.now_time =  this.year + '-' + this.month + '-' + this.NewDate+ this.week[this.day]+'       '+this.hour+':'+this.minutes+':'+this.second;
    },
    // 获取当前所在城市
    getAddress() {
      this.loading = true;
      jsonp(
        "http://api.map.baidu.com/location/ip?ip=103.6.223.136&ak=60OwlAbghDNm4VIlREoyhZ8KfkGCiTU4&coor=bd09ll",
        null,
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            this.address = data.content.address;
            // console.log("0000000000"+data.content.address);
            this.getWeather(this.address);
            this.loading = false;
          }
        }
      );
    },
    getWeather(address) {
      //查看名单模板
      jsonp(
        "http://api.map.baidu.com/telematics/v3/weather?location=" +
          address +
          "&output=json&ak=DBfHSTRqARNEvsjqMj59dssOiCs2uz7y",
        null,
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            this.data = data.results[0].weather_data[0];
            this.weather = this.data.date.substring(14, 16);
            let that = this;
            setInterval(function() {
              that.showTime();
            }, 1000);
            // this.week = ;
            console.log(data);
            console.log(this.week);
            this.loading = false;
          }
        }
      );
    },
    //  我的活动 饼状图
    getMyOrder() {
      httpServer(apiSetting.getHomeMyAppCount)
        .then(response => {
          for (var i = 0; i < response.length; i++) {
            if (response[i].type_ename == "exchange") {
              this.changeActive = response[i].app_count;
            } else if (response[i].type_ename == "directpurchase") {
              this.directActive = response[i].app_count;
            } else if (response[i].type_ename == "upticket") {
              this.upReceiptActive = response[i].app_count;
            } else if (response[i].type_ename == "pdq") {
              this.PDQActive = response[i].app_count;
            } else if (response[i].type_ename == "qrcode") {
              this.OneThingActive = response[i].app_count;
            }
          }
          console.log(this.directActive);
          if (
            this.changeActive == 0 &&
            this.directActive == 0 &&
            this.upReceiptActive == 0 &&
            this.PDQActive == 0 &&
            this.OneThingActive == 0
          ) {
            this.isShowMyActive = true;
          } else {
            this.isShowMyActive = false;
            this.$nextTick(function() {
              this.drawMyOrder();
            });
          }
        })
        .catch(error => {});
    },
    drawMyOrder() {
      var MyOrderChart = this.$echarts.init(document.getElementById("myOrder"));
      this.option = {
        title: {
          text: "",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          bottom: "1",
          icon: "circle",
          data: ["兑换平台", "直采", "上传小票", "PDQ", "一物一码"]
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            data: [
              {
                value: this.changeActive == 0 ? "" : this.changeActive,
                name: "兑换平台",
                itemStyle: {
                  color: "#ff73ae"
                }
              },
              {
                value: this.directActive == 0 ? "" : this.directActive,
                name: "直采",
                itemStyle: {
                  color: "#ffde2e"
                }
              },
              {
                value: this.upReceiptActive == 0 ? "" : this.upReceiptActive,
                name: "上传小票",
                itemStyle: {
                  color: "#4fcfff"
                }
              },
              {
                value: this.PDQActive == 0 ? "" : this.PDQActive,
                name: "PDQ",
                itemStyle: {
                  color: "#934eff"
                }
              },
              {
                value: this.OneThingActive == 0 ? "" : this.OneThingActive,
                name: "一物一码",
                itemStyle: {
                  color: "#1ad23f"
                }
              }
            ]
            // itemStyle: {
            //     emphasis: {
            //         shadowBlur: 10,
            //         shadowOffsetX: 0,
            //         shadowColor: "rgba(0, 0, 0, 0.5)"
            //     }
            // }
          }
        ]
      };
      MyOrderChart.setOption(this.option);
      this.canvasloading = false;
    },
    // 待分配活动  柱状图
    getAllotActive() {
      httpServer(apiSetting.gethomeStatusAppCount, {
        appStatus: this.$customState.app_status_code_200
      })
        .then(response => {
          this.total_count = response.total_count;
          for (var i = 0; i < response.app_home_days.length; i++) {
            if (response.app_home_days[i].day_one[0].type_ename == "exchange") {
              switch (response.app_home_days[i].day) {
                case "1-14天":
                  this.changeAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.changeAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.changeAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.changeAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
              }
            }
            if (
              response.app_home_days[i].day_one[0].type_ename ==
              "directpurchase"
            ) {
              switch (response.app_home_days[i].day) {
                case "1-14天":
                  this.directAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.directAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.directAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.directAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[i].day_one[0].type_ename == "upticket") {
              switch (response.app_home_days[i].day) {
                case "1-14天":
                  this.upReceiptAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.upReceiptAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.upReceiptAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.upReceiptAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[i].day_one[0].type_ename == "pdq") {
              switch (response.app_home_days[i].day) {
                case "1-14天":
                  this.PDQAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.PDQAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.PDQAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.PDQAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[i].day_one[0].type_ename == "qrcode") {
              switch (response.app_home_days[i].day) {
                case "1-14天":
                  this.OneThingAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.OneThingAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.OneThingAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.OneThingAllot.push(
                    response.app_home_days[i].day_one[0].app_count
                  );
                  break;
              }
            }
          }
          this.drawAllotActive();
        })
        .catch(error => {});
    },
    drawAllotActive() {
      var allotActiveChart = this.$echarts.init(
        document.getElementById("allotActive")
      );
      this.option = {
        color: ["#ff73ae", "#ffde2e", "#4fcfff", "#934eff", "#1ad23f"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["兑换平台", "直采", "上传小票", "PDQ", "一物一码"],
          icon: "circle"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["1-14天", "15-30天", "30-60天", ">60天"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "兑换平台",
            type: "bar",
            barWidth: "8",
            data: this.changeAllot
          },
          {
            name: "直采",
            type: "bar",
            barWidth: "8",
            data: this.directAllot
          },
          {
            name: "上传小票",
            type: "bar",
            barWidth: "8",
            data: this.upReceiptAllot
          },
          {
            name: "PDQ",
            type: "bar",
            barWidth: "8",
            data: this.PDQAllot
          },
          {
            name: "一物一码",
            type: "bar",
            barWidth: "8",
            data: this.OneThingAllot
          }
        ]
      };
      allotActiveChart.setOption(this.option);
      this.canvasloading = false;
    },
    // 待审核活动  柱状图
    getAuditActive() {
      httpServer(apiSetting.gethomeStatusAppCount, {
        appStatus: this.$customState.app_status_code_14000
      })
        .then(response => {
          this.total_count_audit = response.total_count;
          for (var j = 0; j < response.app_home_days.length; j++) {
            if (response.app_home_days[j].day_one[0].type_ename == "exchange") {
              switch (response.app_home_days[j].day) {
                case "1-14天":
                  this.changeAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.changeAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.changeAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.changeAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
              }
            }
            if (
              response.app_home_days[j].day_one[0].type_ename ==
              "directpurchase"
            ) {
              switch (response.app_home_days[j].day) {
                case "1-14天":
                  this.directAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.directAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.directAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.directAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[j].day_one[0].type_ename == "upticket") {
              switch (response.app_home_days[j].day) {
                case "1-14天":
                  this.upReceiptAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.upReceiptAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.upReceiptAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.upReceiptAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[j].day_one[0].type_ename == "pdq") {
              switch (response.app_home_days[j].day) {
                case "1-14天":
                  this.PDQAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.PDQAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.PDQAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.PDQAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
              }
            }
            if (response.app_home_days[j].day_one[0].type_ename == "qrcode") {
              switch (response.app_home_days[j].day) {
                case "1-14天":
                  this.OneThingAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "15-30天":
                  this.OneThingAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case "31-60天":
                  this.OneThingAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
                case ">60天":
                  this.OneThingAudit.push(
                    response.app_home_days[j].day_one[0].app_count
                  );
                  break;
              }
            }
          }
          console.log(this.changeAudit);
          this.$nextTick(function() {
            this.drawAuditActive();
          });
        })
        .catch(error => {});
    },
    drawAuditActive() {
      var auditActiveChart = this.$echarts.init(
        document.getElementById("auditActive")
      );
      this.option = {
        color: ["#ff73ae", "#ffde2e", "#4fcfff", "#934eff", "#1ad23f"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["兑换平台", "直采", "上传小票", "PDQ", "一物一码"],
          icon: "circle"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["1-14天", "15-30天", "30-60天", ">60天"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "兑换平台",
            type: "bar",
            barWidth: 25,
            stack: "11",
            data: this.changeAudit
          },
          {
            name: "直采",
            type: "bar",
            stack: "11",
            data: this.directAudit
          },
          {
            name: "上传小票",
            type: "bar",
            stack: "11",
            data: this.upReceiptAudit
          },
          {
            name: "PDQ",
            type: "bar",
            stack: "11",
            data: this.PDQAudit
          },
          {
            name: "一物一码",
            type: "bar",
            stack: "11",
            data: this.OneThingAudit
          }
        ]
      };
      auditActiveChart.setOption(this.option);
      this.canvasloading = false;
    },
    // 我的数据  折线图
    getMyData() {
      this.returnMyData = []; //数组置空
      this.$color = "";
      httpServer(apiSetting.getHomeYearDataCount, {
        year: this.valueYear,
        condition: this.MyDataTabNum
      })
        .then(response => {
          this.exchange_count = response.exchange_count;
          this.online_count = response.online_count;
          for (var i = 0; i < response.month_infos.length; i++) {
            switch (response.month_infos[i].month) {
              case "1月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "2月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "3月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "4月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "5月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "6月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "7月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "8月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "9月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "10月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "11月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
              case "12月":
                this.returnMyData.push(response.month_infos[i].month_count);
                break;
            }
          }
          this.$nextTick(function() {
            if (this.MyDataTabNum == 1) {
              this.$color = "#6978fd";
            } else if (this.MyDataTabNum == 2) {
              this.$color = "#e9a8ed";
            }
            this.drawMyData(this.returnMyData, this.$color);
          });
        })
        .catch(error => {});
    },
    drawMyData(data, color) {
      var myDataChart = this.$echarts.init(document.getElementById("myData"));
      this.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: color
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "",
            type: "line",
            areaStyle: { color: color },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: color //折线颜色
                }
              }
            },
            data: data
          }
        ]
      };
      myDataChart.setOption(this.option);
      // this.canvasloading = false;
    },
    changeYear(index) {
      let date_Year = new Date(index);
      this.valueYear = "" + date_Year.getFullYear();
      this.getMyData();
    },
    changeMyDataTab(index) {
      this.MyDataTabNum = index;
      this.getMyData();
    }
  }
};
</script>
<style scoped lang="less">
#welcome {
  .welcome_box {
    margin-bottom: 20px;
    .welcome_header {
      height: 90px;
      background: url(../assets/images/images/welcome.png) no-repeat center;
      padding: 15px 25px 0px 25px;
      .header_img,
      .welcome_name {
        float: left;
      }
      .header_img {
        width: 60px;
        height: 60px;
        margin-right: 25px;
        padding-top: 10px;
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .welcome_name {
        color: #fff;
        padding-top: 10px;
        .name {
          font-size: 18px;
        }
        .position {
          font-size: 14px;
          margin-top: 10px;
        }
      }
      .welcome_weather {
        float: right;
        margin-right: 30px;
        overflow: hidden;
        .weather_img,
        .weather_time {
          width: 210px;
          float: left;
        }
        .weather_img {
          width: 62px;
          height: 62px;
          margin-right: 35px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .weather_time {
          div {
            color: #fff;
            overflow: hidden;
            h1 {
              float: left;
              font-size: 44px;
            }
            span {
              margin-top: 20px;
              margin-left: 15px;
              float: left;
              font-size: 12px;
            }
          }
          p {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
    .active_list {
      margin-top: 25px;
      overflow: hidden;
      .active_item {
        float: left;
        width: 410px;
        height: 260px;
        background-color: #ffffff;
        border-radius: 8px;
        border: solid 1px rgba(206, 206, 206, 0.46);
        margin-bottom: 20px;
        padding: 15px;
        position: relative;
        .active_item_title {
          font-weight: bold;
          overflow: hidden;
          i {
            display: block;
            float: left;
            width: 4px;
            height: 14px;
            background-color: #5a0ae0;
            margin-top: 3px;
            margin-right: 10px;
          }
          span {
            float: left;
          }
          .active_totle {
            float: right;
            font-weight: normal;
          }
        }
        #allotActive,
        #auditActive {
          width: 100%;
          height: 230px;
          margin-top: 10px;
        }
        #myData {
          width: 100%;
          height: 155px;
          margin-top: 10px;
        }
        .myDataTab {
          margin: 10px 22px 0px 22px;
          overflow: hidden;
          position: relative;
          .online,
          .exchange {
            float: left;
            width: 180px;
            border-top: 2px #dddddd solid;
            padding-top: 10px;
            cursor: pointer;
            div {
              padding-left: 40px;
              span {
                display: block;
                width: 17px;
                height: 17px;
                float: left;
                background: #6978fd;
                border-radius: 5px;
                margin-right: 10px;
              }
            }
            p {
              margin-top: 5px;
              text-align: center;
              font-size: 18px;
            }
          }
          .line {
            position: absolute;
            left: 180px;
            width: 3px;
            height: 37px;
            top: 15px;
            background-color: #dddddd;
          }
          .exchange {
            div {
              span {
                background: #e9a8ed;
              }
            }
          }
          .activeTab {
            border-top: 2px #5a0ae0 solid;
          }
        }
        .onlineTime {
          position: absolute;
          left: 20px;
          bottom: 20px;
          color: #aaaeb3;
          font-size: 12px;
        }
      }
      .myActive {
        margin-right: 16px;
        #myOrder {
          width: 100%;
          height: 210px;
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
        .noActive {
          text-align: center;
          padding-top: 20px;
          img {
            display: inline-block;
            width: 144px;
            height: 154px;
          }
        }
      }
      .audit_active {
        margin-right: 16px;
      }
    }
  }
  .selectYear {
    margin-left: 10px;
    width: 100px;
  }
}
</style>
<style lang="less">
#welcome {
  .el-input--suffix .el-input__inner {
    padding-right: 0px;
    padding-left: 20px;
  }
  .el-input__prefix,
  .el-input__suffix {
    top: -5px;
  }
  .selectYear {
    .el-input__inner {
      height: 28px;
      font-size: 12px;
    }
  }
}
</style>

