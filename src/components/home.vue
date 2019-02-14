<template>
  <div id="home">
    <!-- 全局公共左侧导航 -->
    <left-menu></left-menu>
    <div class="content_main" id="content_main">
      <checkBrowser v-if="BrowserShow"></checkBrowser>
      <div class="content">
        <!-- 头像信息 -->
        <personal></personal>
        <!-- <activehome></activehome> -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAliveMain"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAliveMain"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
const leftMenu = () =>
  import(/* webpackChunkName:"leftMenu" */ "./nav-left.vue");
const personal = () =>
  import(/* webpackChunkName:"personal" */ "./personal.vue");
// const activehome = () => import ( /* webpackChunkName:"activehome" */ './home/configureActive/activehome.vue');
const checkBrowser = () =>
  import(/* webpackChunkName:"checkBrowser" */ "./checkBrowser");
export default {
  name: "home",
  data() {
    return {
      BrowserShow: false
    };
  },
  components: {
    leftMenu,
    personal,
    checkBrowser
    // activehome
  },
  mounted() {
    var abc = this.getBroswer().broswer;
    if (abc != "Chrome") {
      this.BrowserShow = true;
    }
  },
  methods: {
    getBroswer() {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var is360 = this._mime(
        "type",
        "application/vnd.chromium.remoting-viewer"
      );

      var s;
      (s = ua.match(/edge\/([\d.]+)/))
        ? (Sys.edge = s[1])
        : (s = ua.match(/rv:([\d.]+)\) like gecko/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/msie ([\d.]+)/))
        ? (Sys.ie = s[1])
        : (s = ua.match(/firefox\/([\d.]+)/))
        ? (Sys.firefox = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
        ? (Sys.chrome = s[1])
        : (s = ua.match(/opera.([\d.]+)/))
        ? (Sys.opera = s[1])
        : (s = ua.match(/version\/([\d.]+).*safari/))
        ? (Sys.safari = s[1])
        : 0;

      if (Sys.edge)
        return {
          broswer: "Edge",
          version: Sys.edge
        };
      if (Sys.ie)
        return {
          broswer: "IE",
          version: Sys.ie
        };
      if (Sys.firefox)
        return {
          broswer: "Firefox",
          version: Sys.firefox
        };
      if (is360)
        return {
          broswer: "360"
        };
      if (Sys.chrome)
        return {
          broswer: "Chrome",
          version: Sys.chrome
        };
      if (Sys.opera)
        return {
          broswer: "Opera",
          version: Sys.opera
        };
      if (Sys.safari)
        return {
          broswer: "Safari",
          version: Sys.safari
        };

      return {
        broswer: "",
        version: "0"
      };
    },
    _mime(option, value) {
      var mimeTypes = navigator.mimeTypes;
      for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
<style>
</style>
