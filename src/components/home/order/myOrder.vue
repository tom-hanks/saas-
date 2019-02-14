<template>
  <div id="myOrder">
    <p class="content-title">
      <span>订单管理</span>
      <i class="el-icon-arrow-right content-title-jiantou"></i>
      <span class="content-last-title">我的订单</span>
    </p>
    <!-- <div class="order_btn">
            <span v-for="(item,index) in ordertypeList" :key="index" @click="ordertypeTable(index,item.id)" :class="ordertypeIndex == index?'activeBtn':''">{{item.type_name}}</span>
    </div>-->
    <div class="activeAllot_box" v-loading="loading">
      <div class="title_seacch_box">
        <p class="activeAllot_box_title">活动管理</p>
        <div class="activeAllot_box_search">
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
      <div class="active_type_tab">
        <ul>
          <li
            :class="{typeActive:ordertypeIndex == index}"
            v-for="(item,index) in ordertypeList"
            :key="index"
            @click="ordertypeTable(index,item.id)"
          >
            <div>
              {{item.type_name}}
              <span>({{item.count}})</span>
              <span>
                <i
                  v-for="(item_state_arry,index_increaseName) in notification"
                  :key="index_increaseName+'f'"
                  v-if="item_state_arry.page_code == 'myOrder'&&item_state_arry.region_code=='stateTable'&&item_state_arry.public_id == item.id"
                  class="num_tip"
                >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</i>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <!-- <div class="active_type_tab"> -->
      <!-- <ul>
                    <li :class="{typeActive:activeTypeIndex == Tindex}" v-for="(type,Tindex) in activeType" :key="Tindex" @click="isclickshow?typeTab(Tindex):''">
                        <div>{{type}}
                            <span v-if="ordertypeIndex !=1">({{Tindex == 0?orderStateNum.online_count:orderStateNum.downline_count}})</span>
                            <span v-if="ordertypeIndex == 1">(0)</span>
                        </div>
                    </li>
      </ul>-->
      <!-- </div> -->
      <div class="main">
        <div class="state_tab">
          <p>状态：</p>
          <ul>
            <li :class="{stateActive:activeTypeIndex == 0}" @click="isclickshow?typeTab(0):''">
              <span>已上线活动({{onlineCount}})</span>
              <em></em>
              <i
                v-for="(item_state_arry,index_increaseName) in notification"
                :key="index_increaseName+'s'"
                v-if="item_state_arry.page_code == 'myOrder'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == 'stateOnline'"
                class="num_tip"
              >{{item_state_arry.num<10000?item_state_arry.num:'...'}}</i>
            </li>
            <li :class="{stateActive:activeTypeIndex == 1}" @click="isclickshow?typeTab(1):''">
              <span>已下线活动({{downlineCount}})</span>
              <em></em>
              <i
                v-for="(item_state_arry,index_increaseName) in notification"
                :key="index_increaseName+'s'"
                v-if="item_state_arry.page_code == 'myOrder'&&item_state_arry.region_code=='stateChildTable'&&item_state_arry.code == 'stateOffline'"
                class="num_tip"
              >{{item_state_arry.num}}</i>
            </li>
          </ul>
        </div>
        <div class="activeAllot_list">
          <ul>
            <transition-group style="display:block" :name="'list'" tag="div">
              <li
                @click="godetail(item.id,item.template_id)"
                v-for="(item,index) in itemList"
                :key="index+1"
              >
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
                    <span class="active_name" :title="item.app_name">{{item.app_name}}</span>
                  </p>
                </div>
                <div class="activeAllot_msg">
                  <div class="order_list">
                    <div class="all_orders">
                      <span>全部订单：</span>
                      <p>{{item.release_count}}</p>
                    </div>
                    <div class="success_order">
                      <span>成功订单：</span>
                      <p>{{item.release_success}}</p>
                    </div>
                    <div class="fail_order">
                      <span>失败订单：</span>
                      <p>{{item.release_error}}</p>
                    </div>
                  </div>
                  <div class="activeAllot_msg_left">
                    <!-- <p class="time_year ">
                           <span class="start_year onlyOne">2008年</span>
                    </p>-->
                    <p class="time_year" v-if="item.start_year!=item.end_year">
                      <span class="start_year">{{item.start_year}}年</span>
                      <span class="end_tear">{{item.end_year}}年</span>
                    </p>
                    <p
                      class="time_year"
                      v-if="item.start_year == item.end_year"
                    >{{item.start_year}}年</p>
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
                  </div>
                  <div class="activeAllot_msg_right">
                    <el-button type="primary" class="edit_btn">查看详细数据</el-button>
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
    <!-- itemListloading判断是为了阻止分页点击过快做成的bug,注意下面还有样式 -->
    <el-pagination
      :key="Math.random()"
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
export default {
  name: "myOrder",
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      seachclick_close: false,
      downlineCount: 0, //下线活动数
      onlineCount: 0, //上线活动数
      dataList: [],
      itemList: [],
      ordertypeIndex: 0, //顶部导航切换active
      itemListloading: true, //如果列表正在请求中分页就不能触发，不然会有bug
      ordertypeList: [], //table导航
      orderStateNum: {}, //这个对象放着状态的数量
      seachValue: "", //主页的搜索响应式
      no_data: false, //没有数据的时候控制无数据提示
      seacherno_data: false,
      activeTypeIndex: 0,
      isclickshow: true,
      page: page,
      inquire: {
        id: "",
        statue: this.$customState.app_status_code_700 //默认的是已上线
      }
    };
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    }
  },
  mounted() {
    this.page.pageIndex = 1;
    let $emit = this;
    $emit.page.pageSize = 24; //修改每页显示数
    $emit.page.pageSizeList = [24, 48, 72]; //修改可以下拉框选择的每页显示数
    // //分页调用的获取列表方法
    $emit.page.query = function() {
      if ($emit.itemListloading) {
        $emit.ordergetAppOrderFun($emit.typeid);
        this.itemList = [];
        $emit.itemListloading = false; //以防分页点击过快的flag节流阀
      }
    };
    apiSetting.ordergetAppOrder.page = this.page; //api接口分页赋值
    apiSetting.ordergetAppOrder.dataList = this.dataList; //api分页数据赋值

    if (this.$route.params.tabName) {
      console.log("我是----路由传递的参数");
      console.log(this.$route.params.page.pageIndex);
      this.page.pageIndex = this.$route.params.page.pageIndex;
      this.ordertypeIndex = this.$route.params.ordertypeIndex;
      this.activeTypeIndex = this.$route.params.activeTypeIndex;
      this.inquire.id = this.$route.params.inquire.id;
      this.inquire.statue = this.$route.params.inquire.statue;
      // this.$forceUpdate();
    }
    this.orderGetAppTypeList().then(data => {
      console.log(data);
      this.ordergetAppOrderFun();
      //后面可以用传过来的数据做些其他操作
      //......
    });
  },
  methods: {
    seachclick(a) {
      if (a == 0) {
        this.seachValue = "";
      }
      this.page.pageIndex = 1;
      if (this.isclickshow) {
        this.ordergetAppOrderFun("seach"); //搜索请求列表
      }
    },
    ordertypeTable(index, id) {
      this.ordertypeIndex = index;
      this.inquire.id = id;
      this.onlineCount = this.ordertypeList[index].online_count;
      this.downlineCount = this.ordertypeList[index].downline_count;
      this.ordergetAppOrderFun();
      //   //后面可以用传过来的数据做些其他操作
      //   //......
      // });
    },
    lookrouter() {},
    typeTab(index) {
      this.itemList = [];
      this.isclickshow = false;
      // this.inquire.statue = 50;
      this.seachValue = "";
      if (index == 0) {
        this.inquire.statue = this.$customState.app_status_code_700;
        // 点击上线删除消息通知
        this.notification.forEach(element => {
          if (
            element.page_code == "myOrder" &&
            element.region_code == "stateChildTable" &&
            element.code == "stateOnline"
          ) {
            this.$deleteMid_notify(element, "myOrder");
          }
        });
      } else if (index == 1) {
        this.inquire.statue = this.$customState.app_status_code_13000;
        // 点击上线删除消息通知
        this.notification.forEach(element => {
          if (
            element.page_code == "myOrder" &&
            element.region_code == "stateChildTable" &&
            element.code == "stateOffline"
          ) {
            this.$deleteMid_notify(element, "myOrder");
          }
        });
      }
      // console.log(id);

      this.activeTypeIndex = index;
      this.ordergetAppOrderFun();
    },
    godetail(id, template_id) {
      this.$setsessionStorage("appid", id); //存id
      this.$setsessionStorage("template_id", template_id); //存template_id
      let myOrder = {
        page: this.page,
        ordertypeIndex: this.ordertypeIndex,
        activeTypeIndex: this.activeTypeIndex,
        inquire: {
          id: this.inquire.id,
          statue: this.inquire.statue
        }
      };
      this.$setsessionStorage("myOrder", myOrder);

      // this.$router.push({ path: "/orderDetail" });
      this.$router.push({
        name: "orderDetail",
        query: {
          tabName: "myOrder",
          page: this.page,
          ordertypeIndex: this.ordertypeIndex,
          activeTypeIndex: this.activeTypeIndex,
          inquire: {
            id: this.inquire.id,
            statue: this.inquire.statue
          }
        }
      });
    },
    orderGetAppTypeList(num) {
      return new Promise((resolve, reject) => {
        //做一些异步操作
        httpServer(apiSetting.orderGetAppTypeList)
          .then(response => {
            console.log("我是导航");
            this.ordertypeList = response;
            this.onlineCount = this.ordertypeList[0].online_count;
            this.downlineCount = this.ordertypeList[0].downline_count;
            if (!this.$getsessionStorage("myOrder") && response.length > 0) {
              //num等于0的话代表着第一次进来需要把数据第一个id传过去
              this.inquire.id = response[0].id; //默认type取第一个
            }
            resolve("随便什么数据1");
            console.log(response);
          })
          .catch(error => {
            console.log(error); //loading层关闭
          });
      });
    },
    ordergetAppOrderFun(flagName) {
      clearInterval(this.timerk2);
      this.isclickshow = false;
      let timer2 = null; //声明定时器
      this.itemList = [];
      this.itemListloading = false;
      this.loading = true; //loading层打开
      //卡片列表
      httpServer(apiSetting.ordergetAppOrder, {
        Name: this.seachValue,
        ProductClass: this.inquire.id,
        PageIndex: this.page.pageIndex,
        AppStatusCode: this.inquire.statue,
        PageSize: this.page.pageSize
      })
        .then(response => {
          console.log("卡片列表");
          this.isclickshow = true;
          this.loading = false; //loading层关闭
          this.dataList = apiSetting.ordergetAppOrder.dataList;
          this.itemListloading = true;
          let item = apiSetting.ordergetAppOrder.dataList;
          console.log("大萨达所");
          console.log(this.dataList);
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
            this.$getMid_notify("myOrder");
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
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    }
  }
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
</style>
<style scoped lang="less">
#myOrder {
  .order_btn {
    overflow: hidden;
    margin-bottom: 20px;
    span {
      display: block;
      cursor: pointer;
      float: left;
      width: 136px;
      height: 36px;
      border-radius: 5px;
      box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.22);
      font-size: 14px;
      text-align: center;
      line-height: 36px;
      margin: 10px 25px 10px 5px;
    }
    .activeBtn {
      background-image: linear-gradient(42deg, #4a00e0 0%, #8d2de2 100%);
      box-shadow: 0px 2px 15px 0px rgba(74, 0, 224, 0.35);
      color: #fff;
    }
  }
  .activeAllot_box {
    width: 898px;
    min-height: 350px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    padding: 20px 0px;
    .title_seacch_box {
      overflow: hidden;
      padding: 0px 20px;
      .activeAllot_box_title {
        float: left;
        width: 300px;
        height: 32px;
        font-weight: bold;
      }
      .activeAllot_box_search {
        float: right;
      }
    }
    .active_type_tab {
      border-bottom: 1px #eaeaea solid;
      padding-left: 20px;
      overflow: hidden;
      margin-top: 10px;
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
            // display: block;
            // position: absolute;
            // right: -30px;
            // top: 0;
            // width: 30px;
            // height: 16px;
            // font-size: 10px;
            // color: #fff;
            // text-align: center;
            // line-height: 16px;
            // border-radius: 8px;
            // background-color: #e83531;
            i.num_tip {
              top: 4px;
              right: -25px;
            }
          }
        }
      }
      .typeActive {
        font-size: 14px;
        color: #393c40;
        border-bottom: 3px #4900e0 solid;
        // span {
        //     background: #e83531;
        // }
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
        // overflow: hidden;
        li {
          cursor: pointer;
          float: left;
          padding-left: 25px;
          color: #aaaeb3;
          position: relative;
          // text-decoration-line:underline;
          // text-decoration-color: #4900e0;

          em {
            display: inline-block;
            width: 1px;
            height: 10px;
            background: #c0c0c0;
            margin-left: 25px;
          }
          span {
            display: inline-block;
          }
          i.num_tip {
            right: 4px;
            top: -18px;
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
      ul {
        padding-top: 20px;
        overflow: hidden;
        li {
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
                width: 350px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .operation_name {
                float: right;
                padding-right: 10px;
              }
            }
          }
          .activeAllot_msg {
            padding: 10px 0px 10px 15px;
            font-size: 12px;
            overflow: hidden;
            .order_list {
              overflow: hidden;
              div {
                float: left;
                width: 114px;
                height: 45px;
                background: #01c58a;
                margin-right: 10px;
                color: #fff;
                border-radius: 4px;
                padding: 5px;
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
              .success_order {
                background: url(../../../assets/images/images/order3.png)
                  no-repeat center;
                background-size: 100% 100%;
              }
              .fail_order {
                background: url(../../../assets/images/images/order2.png)
                  no-repeat center;
                background-size: 100% 100%;
              }
            }
            .activeAllot_msg_left {
              float: left;
              width: 250px;
              margin-top: 20px;
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
              float: left;
              margin-left: 30px;
              margin-top: 25px;
              .edit_btn {
                width: 90px;
                height: 40px;
                padding: 0px;
                text-align: center;
                line-height: 40px;
                background-image: linear-gradient(
                  42deg,
                  #4900e0 0%,
                  #8d2de2 100%
                );
                border-radius: 5px;
                border: none;
                font-size: 12px;
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
}
</style>
