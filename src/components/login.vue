<template>
  <div id="login">
    <div id="particles">
      <div class="login">
        <div class="login_logo"></div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class>
          <p>HELLO & WELCOME FOX CLOUD</p>
          <el-input
            type="text"
            v-model="ruleForm.name"
            maxlength="20"
            placeholder="请输入账号"
            auto-complete="off"
            @keyup.enter.native="submitForm(ruleForm)"
          ></el-input>
          <el-input
            type="password"
            v-model="ruleForm.pass"
            maxlength="100"
            placeholder="请输入密码"
            auto-complete="off"
            @keyup.enter.native="submitForm(ruleForm)"
          ></el-input>
          <el-checkbox label="记住账号密码" v-model="ruleForm.rember"></el-checkbox>
          <!-- <span class="login_btn"  @click="submitForm(ruleForm)">登录</span> -->
          <el-button
            type="primary"
            class="login_btn"
            @click="submitForm(ruleForm)"
            :loading="loginContent.onColse"
          >{{loginContent.content}}</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../assets/js/http.js";
import "../../static/js/particles.min.js";
export default {
  name: "login",
  components: {},
  props: {},
  data() {
    return {
      ruleForm: {
        name: "",
        pass: "",
        rember: true //判断是否保存登陆状态
      },
      loginContent: {
        onColse: false,
        content: "登录"
      },
      rules: {}
    };
  },
  mounted() {
    sessionStorage.clear(); //清除sessionStorage的所有缓存
    // 动画参数配置
    particlesJS("particles", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true,
      config_demo: {
        hide_card: false,
        background_color: "#b61924",
        background_image: "",
        background_position: "50% 50%",
        background_repeat: "no-repeat",
        background_size: "cover"
      }
    });
  },
  methods: {
    submitForm(formName) {
      if (!formName.name) {
        this.$message("账户不能为空");
      } else if (!formName.pass) {
        this.$message("密码不能为空");
      } else {
        this.loginContent.onColse = true;
        this.loginContent.content = "登录中";
        httpServer(apiSetting.postLogin, {
          user_name: formName.name,
          password: formName.pass
        })
          .then(response => {
            console.log(this.ruleForm.rember);
            if (this.ruleForm.rember == true) {
              this.setCookie("Authorization", response, 7);
            } else {
              this.setCookie("Authorization", response, 0.3);
            }
            this.$router.push({ path: "/home" });
          })
          .catch(error => {
            this.$message(error.data.message);
            this.delCookie("Authorization");
            this.loginContent.onColse = false;
            this.loginContent.content = "登录";
          });
      }
    }
  }
};
</script>
<style>
</style>
<style scoped lang="less">
#login {
  height: 100vh;
  width: 100%;
  background: #2e31b7 url(../assets/images/images/login_bg.png) no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
  #particles {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  .login {
    padding-top: 40px;
    position: absolute;
    overflow: hidden;
    width: 100%;
    .login_logo {
      height: 75px;
      margin-left: 65px;
      background: url(../assets/images/images/login_logo.png) no-repeat left top;
      background-size: 224px 75px;
    }
    .el-form {
      width: 295px;
      float: right;
      color: #fff;
      margin-right: 165px;
      margin-top: 40px;
      p {
        font-size: 18px;
        margin-bottom: 25px;
      }
      .el-input {
        margin-bottom: 25px;
        width: 260px;
      }
      .el-checkbox {
        color: #fff;
      }
      .login_btn {
        cursor: pointer;
        display: block;
        width: 260px;
        height: 40px;
        border-radius: 6px;
        text-align: center;
        border: 0;
        // line-height: 45px;
        margin-top: 15px;
        color: #fff;
        background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
      }
    }
  }
}
</style>
<style lang="less">
#login {
  .el-input__inner {
    background: rgba(255, 255, 255, 0.4);
    border: none;
    color: #fff;
    width: 100%;
    height: 40px;
    text-indent: 0px;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: rgba(255, 255, 255, 0.4);
    border-color: #fff;
  }
  .el-checkbox__inner:hover {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
  }
}
</style>

