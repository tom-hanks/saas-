<template>
  <div id="nav_left">
    <div class="left-menu">
      <div class="logo" @click="backhome"></div>
      <!-- <p>{{shishi}}</p> -->
      <!-- <p>{{$store.state.Heade.count}}</p> -->
      <!-- <p>{{$store.state.Content.cont}}</p> -->
      <!-- <p>{{countAnother}}1</p> -->
      <!-- <i v-for="item in arrList">{{item}}</i> -->
      <!-- <h1 @click="$store.commit('Count',10)">dada</h1> -->
      <!-- <h2 @click="$store.dispatch('Acount')">wwwwwwwww</h2> -->
      <!-- <h3 @click="$store.getters.countAnother">not_show</h3> -->
      <div class="menu-list" dir="rtl">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          router
          @open="handleOpen"
          @close="handleClose"
          text-color="#fff"
          active-text-color
        >
          <el-submenu :index="''+index" v-for="(item,index) in menu_list" :key="index">
            <template slot="title">
              <i
                class="icon"
                :class="{iconMyactive:item.item.icon_class=='iconMyactive',
                                                    iconHome:item.item.icon_class=='iconHome',
                                                    iconAllot:item.item.icon_class=='iconAllot',
                                                    iconAudit:item.item.icon_class=='iconAudit',
                                                    iconData:item.item.icon_class=='iconData',
                                                    iconManager:item.item.icon_class=='iconManager',
                                                    iconOrder:item.item.icon_class=='iconOrder',
                                                    }"
              ></i>
              <span class="identificatio_name">
                {{item.item.menu_name}}
                <!-- 一级导航得红点 -->
                <i
                  v-for="(item_notification,index_notification) in notification"
                  :key="index_notification"
                  v-if="item_notification.page_code=='home'&&item_notification.region_code=='navLeft'&&item_notification.public_id == item.item.id&&(item_notification.code == item.item.menu_url)&&item_notification.num>0"
                ></i>
              </span>
            </template>
            <el-menu-item-group class="menu">
              <el-menu-item
                :index="`${menu.item.menu_url}`"
                v-for="(menu,index2) in item.children_node"
                :key="index2"
              >
                {{menu.item.menu_name}}
                <!-- 二级导航得红点 -->
                <i
                  class="menu_num_tip"
                  v-for="(item_notification_child,index_notification_child) in notification"
                  :key="index_notification_child"
                  v-if="item_notification_child.page_code=='home'&&item_notification_child.region_code=='navLeft'&&item_notification_child.public_id == menu.item.id&&item_notification_child.code==menu.item.menu_url&&item_notification_child.num>0"
                ></i>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="verMsg" @click="goVerMsg">
        <p>版本信息</p>
        <p>{{versions}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../assets/js/http.js";
export default {
  name: "nav_left",
  data() {
    return {
      isShowsliding: 0, //这个选中标签 只让在当前展开的时候添加
      controlflag: true, //控制只准一个
      // 菜单列表
      menu_list: [],
      activeNames: 0,
      openId: 0,
      versions: ""
    };
  },
  beforeCreate() {
    httpServer(apiSetting.getMenus)
      .then(response => {
        this.menu_list = response.menu_node_models;
        document.title = "foxcloud";
        // this.versions = response.system_version;
        this.$setsessionStorage("menus", response.menu_node_models); //存储个人信息
      })
      .catch(error => {
        this.$message({
          message: error.data.message,
          duration: 1000
        }); //loading层关闭
      });
    httpServer(apiSetting.getMilestones, {
      PageIndex: "1",
      PageSize: "5"
    })
      .then(response => {
        this.versions = response.collection[0].version;
      })
      .catch(error => {
        this.$message({
          message: error.data.message,
          duration: 1000
        });
      });
  },
  computed: {
    notification: function() {
      //每个页面得消息通知数据监听更新
      return this.$store.state.Heade.notific;
    },
    arrList: function() {
      return this.$store.getters.arrList; //通过store.getters对象来访问
    },
    countAnother: function() {
      return this.$store.getters.countAnother; //通过store.getters对象来访问
    }
  },
  mounted() {
    this.$getMid_notify("home"); //获取公共部分（左侧导航栏的消息通知）
  },
  methods: {
    gernerateId: function(index) {
      return index.toString();
    },
    getVersionList() {},
    handleOpen(key, keyPath) {
      console.log("开" + key);
      this.isShowsliding = key;
    },
    handleClose(key, keyPath) {
      console.log("关" + key);
    },
    backhome() {
      this.$router.push({ path: "/helloWorld" });
    },
    goVerMsg() {
      this.$router.push({ path: "/versionList" });
    }
  }
};
</script>
<style scope lang="less">
#nav_left {
  .menu .plot {
    display: block;
  }
  .el-menu-item-group > ul {
    position: relative;
  }
  .sliding-bar {
    transition: all 0.35s ease;
    opacity: 0;
    position: absolute;
    top: -12px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    margin-top: 13px;
    color: #fff;
    background-image: linear-gradient(42deg, #ebbc00 0%, #ff8000 100%);
    box-shadow: 0px 2px 4px 0px rgba(224, 18, 0, 0.38);
    border-radius: 8px;
    z-index: -1;
  }
  .verMsg {
    margin-left: 30px;
    padding-left: 25px;
    background: url("../assets/images/images/verIcon.png") no-repeat top left;
    background-size: 18px 18px;
    cursor: pointer;
    position: absolute;
    bottom: 20px;
  }
}
</style>

<style>
#nav_left .el-menu-item a {
  text-decoration: none;
  color: #fff;
  display: block;
  width: 100%;
  height: 100%;
  padding-left: 40px;
}
#nav_left .el-menu-item > .menu_num_tip {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d4d;
  position: absolute;
  right: 32px;
  top: 4px;
}
#nav_left .el-menu-item.is-active {
  z-index: 2;
}
#nav_left .icon {
  position: absolute;
  left: 7px;
  /* display: inline-block; */
}
#nav_left .iconMyactive {
  width: 18px;
  height: 17px;
  background: url(../assets/images/images/iconMyactive.png) no-repeat center;
  background-size: 18px 17px;
}
#nav_left .iconHome {
  width: 20px;
  height: 22px;
  background: url(../assets/images/images/iconHome.png) no-repeat center;
  background-size: 20px 20px;
  top: -2px;
}
#nav_left .iconAllot {
  width: 16px;
  height: 16px;
  background: url(../assets/images/images/iconAllot.png) no-repeat center;
  background-size: 16px 16px;
}
#nav_left .iconAudit {
  width: 18px;
  height: 18px;
  background: url(../assets/images/images/iconAudit.png) no-repeat center;
  background-size: 18px 18px;
}
#nav_left .iconData {
  width: 19px;
  height: 16px;
  background: url(../assets/images/images/iconData.png) no-repeat center;
  background-size: 19px 16px;
}
#nav_left .iconManager {
  width: 17px;
  height: 16px;
  background: url(../assets/images/images/iconManager.png) no-repeat center;
  background-size: 17px 16px;
}
#nav_left .iconOrder {
  width: 16px;
  height: 16px;
  background: url(../assets/images/images/iconOrder.png) no-repeat center;
  background-size: 16px 16px;
}
#nav_left .logo {
  cursor: pointer;
}
#nav_left .versions {
  margin-top: -5px;
  text-align: center;
}
#nav_left > .el-submenu__title {
  height: 40px;
  position: relative;
}

#nav_left .el-submenu__title .identificatio_name {
  position: absolute;
  left: 39px;
}
#nav_left .el-submenu__title .identificatio_name > i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d4d;
  float: right;
  margin-left: 5px;
}
#nav_left .el-menu-item {
  text-align: left;
  /* padding-left: inherit !important; */
}
#nav_left .el-submenu .el-menu-item {
  padding-left: inherit !important;
  /* padding-left: 40px !important; */
  padding-right: 0px;
  text-align: center;
  transition: font-size 0.3s;
}
#nav_left .el-submenu .is-active {
  color: #ffffff;
  /* background: blue; */
  background-image: linear-gradient(42deg, #ebbc00, #ff8000);
  box-shadow: 0 2px 4px 0 rgba(224, 18, 0, 0.38);
  border-radius: 8px;
  font-size: 16px;
}
#nav_left .homeclass {
  height: 45px;
  line-height: 45px;
}
#nav_left .icon-home {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: red;
  vertical-align: middle;
}
</style>
