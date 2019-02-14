<template>
  <div id="personal">
    <!-- <router-link to="/login"> -->
    <div class="persersonal clearfix">
      <div class="person-name fl">
        <div>
          <img class="img-name" :src="head_img?head_img:defaultImg">
        </div>
        <span>{{real_name}}</span>
        <i class="personal-jiantou el-icon-arrow-down"></i>
      </div>

      <!-- 悬浮卡 -->
      <div class="suspension">
        <div class="triangle_border_up">
          <span></span>
        </div>
        <div class="portrait" @click="goEdit">
          <img :src="head_img" alt=" ">
          <span class="portrait_edit icon icon-portraitedit"></span>
        </div>
        <p class="portrait_nickname">{{real_name}}</p>
        <p class="job_title">{{department_name}}{{position_name}}</p>
        <div class="portrait_list clearfix" v-show="false">
          <div class="portrait_one fl">
            <h1 class="portrait_num">0</h1>
            <p class="portrait_tip">上线项目</p>
          </div>
          <span class="borderwith fl"></span>
          <div class="portrait_two fl">
            <h1 class="portrait_num">23</h1>
            <p class="portrait_tip">下线项目</p>
          </div>
          <span class="borderwith fl"></span>
          <div class="portrait_three fl">
            <h1 class="portrait_num">13</h1>
            <p class="portrait_tip">待处理项目</p>
          </div>
        </div>
        <div class="out_button" @click="sign_out()">退出</div>
      </div>
    </div>
    <!-- </router-link> -->
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../assets/js/http.js";

export default {
  name: "personal",
  components: {},
  data() {
    return {
      real_name: "****", //姓名
      department_name: "****", //部门
      position_name: "",
      head_img: "",
      defaultImg: require("@/assets/images/images/header.png")
    };
  },
  created() {
    this.$setsessionStorage("personalSuccess", false); //为了区分缓存的更新信息是否被更新过，防止其它地方用到还没更新就开始读缓存了
    this.$eventBus.$emit("eventBusName", "buhao");
  },
  watch: {
    $route(to, from) {
      // console.log("111==================");
      // console.log(to, from);
      if (from.name == "editPersonal") {
        this.getThisuser();
      }
    }
  },
  mounted() {
    this.getThisuser();
    // console.log(this.getCookie("Authorization"));
  },
  methods: {
    sign_out() {
      this.delCookie("Authorization");
      this.$router.push({ path: "/login" });
    },
    goEdit() {
      this.$router.push({ path: "/editPersonal" });
    },
    getThisuser() {
      httpServer(apiSetting.getThisuser)
        .then(response => {
          this.$setsessionStorage("personal", response); //存储个人信息
          this.$wacthResetSetItem("personalSuccess", true);
          // eventBus.$emit("eventBusName", response);
          this.$eventBus.$emit("eventBusName", "haole");

          this.real_name = response.real_name;
          this.head_img = response.head_img;
          if (response.position_id) {
            this.position_name = response.position_name;
            this.department_name = response.department_name;
          } else {
            this.department_name = response.organization_name;
          }
        })
        .catch(error => {
          console.log(error); //loading层关闭
        });
    }
  }
};
</script>

<style scoped>
.persersonal {
  position: absolute;
  top: 19px;
  right: 0;
}
.persersonal:hover .suspension {
  display: block;
}
.person-name {
  cursor: pointer;
  height: 50px;
}
.person-name div {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  float: left;
}
.person-name > div > .img-name {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
}
.person-name span {
  display: block;
  float: left;
  font-size: 12px;
  color: #aaaeb3;
  padding-top: 8px;
  padding-left: 10px;
}
.personal-jiantou {
  display: block;
  float: left;
  padding-top: 12px;
  color: #aaaeb3;
  padding-left: 4px;
}
.suspension {
  display: none;
  /*在弹窗的样式里加入*/
  animation: scale-in-ease cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.5s;
  width: 250px;
  height: 280px;
  background: #fff;
  box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  position: absolute;
  top: 50px;
  right: 2px;
  z-index: 2001;
}

/*向上*/
.triangle_border_up {
  width: 0;
  height: 0;
  border-width: 0 18px 30px;
  border-style: solid;
  border-color: transparent transparent #ffff; /*透明 透明  灰*/
  /* margin:40px auto; */
  position: absolute;
  right: -2.5px;
  top: -8px;
  transform: rotate(-90deg);
}
.portrait {
  width: 67px;
  height: 67px;
  margin: 0 auto;
  margin-top: 18px;
  background: #ffff;
  cursor: pointer;
  position: relative;
}
.portrait > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.portrait_edit {
  cursor: pointer;
  width: 23px;
  height: 23px;
  box-shadow: 0px 2px 15px 0px rgba(74, 0, 224, 0.35);
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  left: -5px;
}
.portrait_nickname {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 28px;
  letter-spacing: 1px;
  color: #000000;
  margin-top: 6px;
  margin-top: 10px;
}
.job_title {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 2px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 2px;
}
.out_button {
  width: 70px;
  height: 30px;
  line-height: 29px;
  text-align: center;
  border-radius: 4px;
  margin: 0 auto;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
  background-image: linear-gradient(42deg, #8d2de2 0%, #4a00e0 100%);
  margin-top: 20px;
  cursor: pointer;
}
.portrait_list {
  margin-top: 22px;
}
.portrait_one {
  width: 80px;
  height: 42px;
  /* background: green; */
}
.portrait_two {
  width: 82px;
  height: 42px;
  /* background: blue; */
}
.portrait_three {
  width: 80px;
  height: 42px;
  /* background: orange; */
}
.borderwith {
  width: 2px;
  height: 20px;
  background: rgba(34, 34, 34, 0.1);
  margin-top: 12px;
}
.portrait_num {
  margin-bottom: 6px;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 1px;
  color: #393c40;
}
.portrait_tip {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 2px;
  color: rgba(0, 0, 0, 0.5);
}
/*分享 放在调用的上部*/
@-webkit-keyframes scale-in-ease {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) perspective(1200px);
    transform: scale(1) perspective(1200px);
  }
}
@keyframes scale-in-ease {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) perspective(1200px);
    transform: scale(1) perspective(1200px);
  }
}
@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
