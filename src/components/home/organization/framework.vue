<template>
  <div id="framework" v-loading="loading">
    <p class="framework_sign">
      组织架构
      <span v-for="(itemquan,indexquan) in stepModel.buttonPower" :key="indexquan">
        <el-button
          class="fr addbutton addPartment"
          title="增加部门"
          @click="addFramework()"
          v-if="itemquan.item.menu_url == 'organization_addbutton'"
          icon="el-icon-addPlus"
        >增加部门</el-button>
      </span>
    </p>
    <div class="framework_title">
      <div class="framework_name">
        <img v-if="entity.sex ==1" src="../../../assets/images/images/manOrg.png" alt="管理员头像">
        <img v-if="entity.sex ==2" src="../../../assets/images/images/womanOrg.png" alt="管理员头像">
        <span>{{entity.name}}-{{entity.real_name}}</span>
      </div>
    </div>
    <div class="framework_list" ref="scroller">
      <!-- <ul class="framework_list_ul">
                <li class="framework_item" v-for="(item,index) in departmentList" :key="index">
                    <div class="framework_edit">
                        {{item.organization_name}}
                        <span v-if="Administrator == 1" title="编辑" class="el-icon-edit" @click="addFramework(item)"></span>
                        <button v-if="Administrator == 1" title="删除" class="el-icon-delete delete_btn"  @click="deleteFramework(item)"></button>
                    </div>

                    <div class="framework_line" :class="[{'line_one': index % 4 == 0},{'line_two':index%4 == 1},{'line_three':index%4 == 2,},{'line_fore':index%4 == 3}]"></div>
                    <div class="framework_depart_list">
                        <div v-if="item.department_position_sum_list && item.department_position_sum_list.length" class="framework_depart" v-for="(sum,Dindex) in item.department_position_sum_list" :key="Dindex">
                            <p>
                                <span>{{sum.position}}</span>
                                <span class="number">{{sum.count}}人</span>
                            </p>
                            <ul class="framework_name_list">
                                <li  v-for="(user,Uindex) in sum.department_position_list" :key="Uindex">{{user.user_name}}</li>
                            </ul>
                        </div>
                        <div  v-if="!item.department_position_sum_list || !item.department_position_sum_list.length"  class="framework_depart_none">此部门尚无成员，请移至成员列表中添加成员</div>
                    </div>
                </li>
      </ul>-->
      <swiper class="swiper-container framework_list_ul" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item,index) in departmentList" :key="index">
          <div class="framework_item">
            <div class="framework_edit">
              {{item.organization_name}}
              <span
                v-for="(itemquan,indexquan) in stepModel.buttonPower"
                :key="indexquan"
              >
                <span
                  v-if="itemquan.item.menu_url == 'organization_editbutton'"
                  title="编辑"
                  class="el-icon-edit"
                  @click="addFramework(item)"
                ></span>
                <button
                  v-if="itemquan.item.menu_url == 'organization_delebutton'"
                  title="删除"
                  class="el-icon-delete delete_btn"
                  @click="deleteFramework(item)"
                ></button>
              </span>
            </div>
            <div
              class="framework_line"
              :class="[{'line_one': index % 4 == 0},{'line_two':index%4 == 1},{'line_three':index%4 == 2,},{'line_fore':index%4 == 3}]"
            ></div>
            <div class="framework_depart_list">
              <div
                v-if="item.department_position_sum_list && item.department_position_sum_list.length"
                class="framework_depart"
                v-for="(sum,Dindex) in item.department_position_sum_list"
                :key="Dindex"
              >
                <p>
                  <span>{{sum.position}}</span>
                  <span class="number">{{sum.count}}人</span>
                </p>
                <ul class="framework_name_list">
                  <li
                    v-for="(user,Uindex) in sum.department_position_list"
                    :key="Uindex"
                  >{{user.user_name}}</li>
                </ul>
              </div>
              <div
                v-if="!item.department_position_sum_list || !item.department_position_sum_list.length"
                class="framework_depart_none"
              >此部门尚无成员，请移至成员列表中添加成员</div>
            </div>
          </div>
        </swiper-slide>

        <div class="swiper-button-prev" v-show="isLeft" slot="button-prev" @click="goLeft">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="swiper-button-next" v-show="isRight" slot="button-next" @click="goRight">
          <i class="el-icon-arrow-right"></i>
        </div>
      </swiper>
    </div>
    <!-- <span class="leftBtn" @click="moveLeft" v-if="isLeft">
            <i class="el-icon-arrow-left"></i>
        </span>
        <span class="rightBtn" @click="moveRight" v-if="isRight">
            <i class="el-icon-arrow-right"></i>
    </span>-->
    <el-dialog :title="departName" :rules="rules2" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules2" ref="form" @submit.native.prevent>
        <el-form-item prop="part_name" label="部门名称">
          <el-input
            @keyup.enter.native="submitForm(form)"
            v-model="form.part_name"
            auto-complete="off"
            maxlength="10"
            placeholder="部门名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";
import "swiper/dist/css/swiper.css";

import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "framework",
  props: {
    stepModel: null
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 4, //容器能够同时显示的slides数量
        spaceBetween: 0, // 在slide之间设置距离（单位px）
        slidesPerGroup: 4, // 一次滑动的slide个数
        loop: true, // 是否循环
        loopFillGroupWithBlank: true,

        // pagination: {
        //     el: '.swiper-pagination',
        //     clickable: true
        // },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      oneClick: false,
      isDisable: true,
      departName: "编辑部门名称",
      dialogFormVisible: false,
      entity: [], // 组织信息
      isLeft: false,
      isRight: false,
      departmentList: [],
      _scrollWidth: 0,
      moveNum: 0,
      loading: true,
      form: {
        id: 0,
        part_name: "",
        organization_id: 0
      },
      rules2: {
        part_name: [
          {
            required: true,
            message: "*请输入部门名称",
            trigger: "blur"
          }
        ]
      },
      delebuttonshow: false, //判断删除按钮显示隐藏
      editbuttonshow: false,
      addbuttonshow: false
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    this.getGroupList();
    console.log("hjkdhkjsad");
    // console.log(this.stepModel.buttonPower);
    // if (this.stepModel.buttonPower) {
    //     alert("1232");
    //     this.stepModel.buttonPower.forEach(v => {
    //         console.log(v.item.menu_url);
    //         //判断传过来的按钮对应显示
    //         if (v.item.menu_url === "delebutton") {
    //             this.delebuttonshow = true;
    //         }
    //         if (v.item.menu_url === "editbutton") {
    //             this.editbuttonshow = true;
    //         }
    //         if (v.item.menu_url === "addbutton") {
    //             this.addbuttonshow = true;
    //         }
    //     });
    // }
  },
  methods: {
    goRight() {
      this.isLeft = true;
      if (this.swiper.isEnd) {
        this.isRight = false;
      }
    },
    goLeft() {
      this.isRight = true;
      if (this.swiper.isBeginning) {
        this.isLeft = false;
      }
    },
    //  用户所在组织的信息
    getGroupList() {
      this.loading = true; //loading层打开
      httpServer(apiSetting.organization).then(response => {
        this.loading = false; //loading层关闭
        console.log(response);
        this.entity = response.entity;
        this.departmentList = response.department_info_model_list;
        this.isLeft = false;
        this.isRight = false;
        if (this.departmentList.length > 4) {
          this.isRight = true;
          if (this.oneClick) {
            //新增的时候才执行这句
            this.$nextTick(function() {
              this.swiper.slideTo(this.departmentList.length - 1, 1000, false);
            });
          }
        } else {
          this.isRight = false;
        }
      });
    },
    // 新增 编辑部门
    addFramework(item) {
      this.oneClick = true;
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      // 如果id存在则为编辑
      if (item && item.id > 0) {
        this.departName = "编辑部门名称";
        this.form.part_name = item.organization_name;
        this.form.id = item.id;
        this.form.organization_id = this.entity.id;
        this.dialogFormVisible = true;
      } else {
        // 如果id不存在则为添加
        this.departName = "新增部门名称";
        this.form.part_name = "";
        this.form.id = 0;
        this.form.organization_id = this.entity.id;
        this.dialogFormVisible = true;
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //表单验证通过
          if (this.form.id > 0) {
            // 编辑部门的接口
            httpServer(apiSetting.editDepartment, {
              id: this.form.id,
              name: this.form.part_name,
              organization_id: this.form.organization_id
            }).then(response => {
              this.getGroupList();
              this.dialogFormVisible = false;
            });
          } else {
            //添加部门的接口
            httpServer(apiSetting.addDepartment, {
              name: this.form.part_name,
              organization_id: this.form.organization_id
            }).then(response => {
              this.getGroupList();
              this.dialogFormVisible = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除部门
    deleteFramework(item) {
      if (this.isDisable) {
        this.isDisable = false;
        let _this = this;
        setTimeout(function() {
          _this.isDisable = true;
        }, 2000);
        console.log(this.isDisable);
        this.form.part_name = item.organization_name;
        this.form.id = item.id;
        this.form.organization_id = this.entity.id;
        if (item.department_position_sum_list.length > 0) {
          this.$message({
            message: "请到成员列表删除组织成员后方可删除部门",
            duration: 1000
          });
        } else {
          this.$confirm("是否确定删除？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
            // type: 'warning'
          })
            .then(() => {
              httpServer(apiSetting.deleteDepartment, {
                id: this.form.id,
                organization_id: this.form.organization_id
              }).then(response => {
                console.log(response);
                this.getGroupList();
                // this.$refs.scroller.scrollLeft(this._scrollWidth);
              });
            })
            .catch(() => {
              console.log("我不想删了");
            });
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.framework_sign {
  overflow: hidden;
  margin-left: 20px;
  .addPartment {
    margin-right: 20px;
  }
}
#framework {
  width: 900px;
  min-height: 500px;
  background-color: #ffffff;
  border-radius: 8px;
  border: solid 1px rgba(206, 206, 206, 0.46);
  margin: 30px 0px;
  padding: 20px 0px 20px 0;
  position: relative;
  .leftBtn,
  .rightBtn {
    // display: block;
    // width: 40px;
    // height: 40px;
    // background: rgba(0, 0, 0, 0.3);
    // position: absolute;
    // top: 330px;
    // cursor: pointer;
    // color: #fff;
    // border-radius: 50%;
    // line-height: 40px;
    // text-align: center;
    // font-size: 28px;

    i {
      font-weight: bolder;
    }
  }
  .leftBtn {
    left: 20px;
  }
  .rightBtn {
    right: 20px;
  }
}
.framework_title {
  width: 860px;
  height: 40px;
  background-image: linear-gradient(42deg, #4900e0 0%, #8d2de2 100%);
  border-radius: 5px;
  margin-top: 15px;
  color: #fff;
  margin-left: 20px;
  .framework_name {
    text-align: center;
    line-height: 40px;
    position: relative;
    img {
      position: absolute;
      bottom: 0px;
      display: inline-block;
      width: 50px;
      height: 61px;
    }
    span {
      padding-left: 55px;
    }
  }
}
.framework_list {
  overflow: hidden;
  height: 540px;
  // overflow-x: auto;
  // margin: 0 20px;
  margin-left: 20px;
  position: relative;
  .framework_list_ul {
    // margin-left: -20px;
    // height: 540px;
    // position: absolute;
    // left: 0px;
    // top: 0px;
    // white-space: nowrap;
    .framework_item {
      white-space: normal;
      width: 200px;
      margin-top: 20px;
      // float: left;
      display: inline-block;
      // margin-left: 20px;
      .framework_edit {
        height: 20px;
        line-height: 20px;
        background: #fff;
        font-weight: bold;
        position: relative;
        padding-bottom: 5px;
        .el-icon-edit {
          margin-left: 5px;
          margin-top: 5px;
          cursor: pointer;
          color: #adb1b6;
          transition: all 0.25s ease;
        }
        .el-icon-edit:hover {
          transform: scale(1.5);
        }
        .delete_btn {
          margin-top: 5px;
          position: absolute;
          right: 0px;
          cursor: pointer;
          color: red;
          background: none;
          transition: all 0.25s ease;
        }
        .delete_btn:hover {
          transform: scale(1.5);
        }
      }
      .framework_line {
        width: 200px;
        height: 4px;
      }
      .line_one {
        background-image: linear-gradient(143deg, #36aeff 0%, #67d7ff 100%);
      }
      .line_two {
        background-image: linear-gradient(45deg, #ffa200 0%, #ffcf00 100%);
      }
      .line_three {
        background-image: linear-gradient(138deg, #17f2ce 0%, #09e2a0 100%);
      }
      .line_fore {
        background-image: linear-gradient(29deg, #6a6a6a 0%, #a4a4a4 100%);
      }
      .framework_depart_list {
        width: 178px;
        height: 459px;
        background: #f5f5f5;
        border: solid 1px #eaeaea;
        border-top: 0px;
        padding: 10px 10px 0px 10px;
        overflow-y: auto;
        .framework_depart_none {
          width: 100%;
          text-align: center;
          color: #adb1b6;
          margin: 200px auto;
          height: 40px;
          font-weight: bolder;
        }
        .framework_depart {
          background: #fff;
          font-size: 12px;
          padding: 5px 0px 5px 10px;
          margin-bottom: 10px;
          p {
            margin-bottom: 5px;
            padding-right: 10px;
            .number {
              color: #adb1b6;
              float: right;
            }
          }
          .framework_name_list {
            overflow: hidden;
            li {
              float: left;
              background-color: #f5f5f5;
              border-radius: 2px;
              margin-right: 10px;
              margin-top: 5px;
              padding: 2px 5px;
            }
          }
        }
      }
    }
  }
}
.swiper-slide {
  width: 220px !important;
}
</style>
<style lang="less">
#framework {
  .el-dialog {
    // width: 380px;
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0px 20px;
      .el-dialog__title {
        font-size: 14px;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        top: 10px;
      }
    }
    .el-input {
      width: 480px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      padding: 0px;
      width: 100%;
    }
    .el-dialog__footer {
      .el-button {
        width: 90px;
        height: 32px;
        background-color: #c3c3c3;

        border-radius: 5px;
        padding: 0px;
        color: #fff;
      }
    }
  }
  .el-form-item__error {
    padding-left: 80px;
  }
  .el-dialog__body {
    padding-bottom: 0px;
  }
  .swiper-button-prev,
  .swiper-button-next {
    // display: block;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    // position: absolute;
    // top: 330px;
    // cursor: pointer;
    color: #fff;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    font-size: 28px;
  }
  .swiper-button-next {
    right: 30px;
  }
}
</style>


