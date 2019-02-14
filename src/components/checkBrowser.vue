<template>
  <div id="checkBrowser" :class="isShow?'el_closeShow':''">
    <div class="checkBrowser_box">
      <div class="checkBrowser_text">为了更好的安全和体验请下载谷歌浏览器，重新访问</div>
      <div class="checkBrowser_btn">
        <a :href="chromeDownloadWin" v-if="windowShow">
          <div class="window">
            <i></i>点击下载win版
          </div>
        </a>
        <a :href="chromeDownloadMac" v-if="macShow">
          <div class="mac">
            <i></i>点击下载mac版
          </div>
        </a>
      </div>
    </div>
    <i class="el-icon-close" @click="el_close"></i>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../assets/js/http.js";
export default {
  name: "checkBrowser",
  components: {},
  data() {
    return {
      isShow: false,
      windowShow: false,
      macShow: false,
      chromeDownloadWin: apiSetting.chromeDownloadWin.url, //下载chrome win
      chromeDownloadMac: apiSetting.chromeDownloadMac.url //下载chrome mac
    };
  },
  created() {},
  mounted() {
    if (this.detectOS() == "windows") {
      this.windowShow = true;
    }
    if (this.detectOS() == "Mac") {
      this.macShow = true;
    }
  },
  methods: {
    el_close() {
      this.isShow = true;
    },
    detectOS() {
      var sUserAgent = navigator.userAgent;
      var isWin =
        navigator.platform == "Win32" || navigator.platform == "Windows";
      var isMac =
        navigator.platform == "Mac68K" ||
        navigator.platform == "MacPPC" ||
        navigator.platform == "Macintosh" ||
        navigator.platform == "MacIntel";
      if (isMac) return "Mac";
      var isUnix = navigator.platform == "X11" && !isWin && !isMac;
      if (isUnix) return "Unix";
      var isLinux = String(navigator.platform).indexOf("Linux") > -1;
      if (isLinux) return "Linux";
      if (isWin) {
        var isWin2K =
          sUserAgent.indexOf("Windows NT 5.0") > -1 ||
          sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP =
          sUserAgent.indexOf("Windows NT 5.1") > -1 ||
          sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 =
          sUserAgent.indexOf("Windows NT 5.2") > -1 ||
          sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista =
          sUserAgent.indexOf("Windows NT 6.0") > -1 ||
          sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 =
          sUserAgent.indexOf("Windows NT 6.1") > -1 ||
          sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        return "windows";
      }
    }
  }
};
</script>
<style lang="less" lang="less">
#checkBrowser {
  height: 55px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.4);
  animation: bounceInLeft 1s 1 cubic-bezier(0.215, 0.61, 0.355, 1);
  // transform: translate(-27%, 0);
  .checkBrowser_box {
    width: 650px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    // top: 10px;
    // left: 100px;
    // width: 650px;
    height: 55px;
    color: #fff;
    // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
    // border-radius: 8px;
    .checkBrowser_text,
    .checkBrowser_btn {
      float: left;
      a {
        display: inline-block;
        width: 100%;
        color: #fff;
        z-index: 3;
        a:link,
        a:visited {
          color: #444;
          text-decoration: none;
        }
      }
    }
    .checkBrowser_text {
      line-height: 55px;
      font-weight: bold;
    }
    .checkBrowser_btn {
      .window,
      .mac {
        float: left;
        margin-left: 20px;
        width: 148px;
        height: 32px;
        border-radius: 6px;
        border: solid 1px #fff;
        line-height: 32px;
        text-indent: 10px;
        margin-top: 10px;
        cursor: pointer;
        i {
          display: block;
          float: left;
          width: 20px;
          height: 20px;
          background: url(../assets/images/images/chrome.png) no-repeat center;
          background-size: 100% 100%;
          margin-top: 6px;
          margin-left: 10px;
        }
      }
    }
  }
  .el-icon-close {
    font-size: 28px;
    padding: 10px 0px 0px 20px;
    color: #fff;
    position: absolute;
    right: 30px;
    cursor: pointer;
  }
}
#checkBrowser:after {
  content: "";
  position: absolute;
  left: -200px;
  height: 100%;
  width: 30%;
  top: 0;
  overflow: hidden;
  background: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
}
.el_closeShow {
  transition: 1s ease all;
  transform: translateY(100px);
}
#checkBrowser:hover:after {
  left: 150%;
  transition: all 1s ease;
}
@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  100% {
    transform: none;
  }
}
</style>
    