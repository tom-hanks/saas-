<template>
  <div id="roleSet" v-loading="loadingTop">
    <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="80px">
      <!--普通用户 -->
      <div class="role_box">
        <el-form-item label="部门" prop="sectionDepartment">
          <el-select
            v-model="roleForm.sectionDepartment"
            @change="changeSelectDepartment"
            placeholder="请选择部门"
          >
            <el-option
              v-for="item in roleForm.optionsDepartment"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="stationPost">
          <el-select
            v-model="roleForm.stationPost"
            @change="changeSelectPosition"
            placeholder="请选择岗位"
          >
            <el-option
              v-for="item in roleForm.optionsPost"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="jurisdiction">
        <p class="jurisdiction_title">权限选择</p>
        <ul class="statistics_list">
          <li class="statistics_list_li" v-for="(analyze,Aindex) in roleForm.data1" :key="Aindex">
            <div class="statistics">
              <span>{{analyze.name}}</span>
              <div class="checkbox fr">
                <input
                  type="checkBox"
                  :checked="analyze.active"
                  @click="checkAllClick(analyze)"
                  :id="analyze.id"
                >
                <label :for="analyze.id">全选</label>
              </div>
            </div>
            <div
              class="statistics_line"
              :class="[{'line_one':Aindex%4 == 0},{'line_two':Aindex%4 == 1},{'line_three':Aindex%4 == 2,},{'line_fore':Aindex%4 == 3}]"
            ></div>
            <div class="jurisdiction_list">
              <div
                class="jurisdiction_list_title"
                v-for="(parent,Pindex) in analyze.children_list"
                :key="Pindex"
              >
                <div class="checkbox fl">
                  <input
                    type="checkBox"
                    :id="parent.id"
                    :checked="parent.active"
                    @click="itemClick(analyze,parent)"
                  >
                  <label :for="parent.id" :title="parent.label">{{parent.label}}</label>
                </div>
                <div
                  class="height_set fr"
                  v-if="parent.children.length>0"
                  :class="{overSet:parent.subActive}"
                  @click="heightSet(analyze,parent)"
                >高级设置</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="step-btn">
        <!-- @click="prev" -->
        <el-button class="last-step" @click="prev">上一步</el-button>
        <el-button
          type
          class="next-btn next-promis"
          @click="confirmFlage?confirm():''"
          :loading="loginContent.onColse"
        >{{loginContent.content}}</el-button>
      </div>
      <!-- 全选选择弹框 -->
      <el-dialog title="用户分析权限高级设置" :visible.sync="showCheckedDialog">
        <div class="checkedDialog_content">
          <div class="checkedDialog_title">
            <p class="fl">请选择该功能模块内的高级权限</p>
            <div class="checkbox fr">
              <input
                type="checkBox"
                id="quanxuan11"
                @click="hightSelectAll"
                :checked="roleForm.currentHightAllSelect"
              >
              <label for="quanxuan11">全部选择</label>
            </div>
          </div>
          <p class="waring_dialog">
            <span>*</span>若非核心成员，建议不用设置，普通成员勾选外部功能即可使用系统默认功能"
          </p>
          <div class="dialog_check_box">
            <div
              class="checkbox fl"
              v-for="(hightItem,hightIndex) in roleForm.currentHightData"
              :key="hightIndex"
            >
              <input
                type="checkBox"
                :id="hightItem.id"
                :checked="hightItem.active"
                @click="hightItemClick(hightItem)"
              >
              <label :for="hightItem.id">{{hightItem.label}}</label>
            </div>
          </div>
          <p class="waring_dialog fr">
            <span>*</span>高级权限开放有风险，请谨慎操作
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showCheckedDialog = false">取 消</el-button>
          <el-button class="subbutton" type="primary" @click="hightConfim">确定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";

export default {
  name: "roleSet",
  props: {
    stepModel: null
  },
  components: {},
  data() {
    return {
      // checkedAllModal:true,
      //xuanze:false,
      loginContent: {
        onColse: false, //false
        content: "提交"
      },
      showCheckedDialog: false,
      confirmFlage: true, //按钮节流阀
      roleSet: {
        isshow: false, //公共按钮隐藏
        isadd: true, //顶部步骤进度显示
        step: 2,
        roleSetshow: true,
        userid: "",
        formLabelAlign: null,
        formLabelAlignxin: null
      },
      preformLabelAlign: null,
      rules: {
        sectionDepartment: [
          {
            required: true,
            message: "*请选择部门",
            trigger: "change"
          }
        ],
        stationPost: [
          {
            required: true,
            message: "*请选择岗位",
            trigger: "change"
          }
        ]
      },
      roleForm: {
        sectionDepartment: "", //部门的默认值
        stationPost: "", //岗位的默认值
        departmentId: "", //部门点击选择的id  当作数据提交
        positionId: "", //岗位点击选择的id  当作数据提交
        ShowIndex: 0,
        optionsDepartment: [
          {
            value: "选项1",
            label: "沃尔玛A"
          },
          {
            value: "选项2",
            label: "沃尔玛B"
          },
          {
            value: "选项3",
            label: "沃尔玛C"
          }
        ],
        optionsPost: [
          {
            value: "选项一",
            label: "宝马"
          },
          {
            value: "选项二",
            label: "奔驰"
          },
          {
            value: "选项三",
            label: "奥迪"
          }
        ],
        // 权限选择的数据
        data1: [], //总数据
        currentHightParentID: [], //当前点击的高级选择的父级对象数据
        currentHightData: [], //当前点击的高级选择后需要显示的数据
        currentHightAllSelect: false, //当前点击的高级选择中的全选是否选中, true:选中, false: 未选中
        currentHightSelectData: [] //当前点击的高级选择后 点击确定后选中的数据
        // isHaveData:true,
        // defaultProps: {
        //     children: 'children',
        //     label: 'label',
        // }
      },
      isJurisdictionChild: false,
      loadingTop: true //上部分的加载loading
      // isUser: true
    };
  },
  mounted() {
    //验证是否是项目负责人
    // let mem = this.$getsessionStorage("personal");
    // if (mem.organization_id) {
    //     this.isUser = false;
    // }

    this.preformLabelAlign = this.stepModel.formLabelAlign;
    // console.log(this.preformLabelAlign)
    this.roleSet.userid = this.stepModel.userid; //把传过来的userid给存起来
    this.$emit("changeStep", this.roleSet);
    // console.log('jjjj')
    // console.log(this.preformLabelAlign)

    this.getorganizationMenuuser();

    this.getorganizationAll();
    this.getpositionAll();
    //区分是新增还是修改，修改的要请求userid的个人部门和岗位
    if (this.roleSet.userid != null) {
      // 这是部门需要调用的方法
      this.getdepartmentUser();
      // 这是岗位需要调用的方法
      this.getpositionUser();
    } else {
      this.loadingTop = false;
    }
  },
  methods: {
    // 是否显示树的第二级
    isShowChild(index) {
      this.roleForm.ShowIndex = index;
      this.isJurisdictionChild = !this.isJurisdictionChild;
    },
    prev() {
      this.roleSet.step = 1; //点击上一步 只让第一步高亮
      this.roleSet.roleSetshow = false; //点击下一步 让 角色配置 显示，自己隐藏
      this.$emit("changeStep", this.roleSet); //传给父页面 home.vue 的changeStep方法
      if (this.roleSet.userid == null) {
        console.log("我是上一步");
        //console.log('jjjj')
        console.log(this.preformLabelAlign);
        this.roleSet.formLabelAlignxin = this.preformLabelAlign;
        this.$emit("changeStep", this.roleSet); //传给父页面 home.vue 的changeStep方法
      }
    },
    // 点击树节点的方法   用来控制全选是否选中
    getkey(index) {
      // 获取选中的树节点
      let treeNodeCheck = this.$refs.tree[index].getCheckedKeys();
      let treeNodeAll = 0;
      // 循环所有数据中所有的节点
      for (var i = 0; i < this.roleForm.data2.length; i++) {
        treeNodeAll = this.roleForm.data2[i].children.length + treeNodeAll;
      }
      treeNodeAll = treeNodeAll + this.roleForm.data2.length;
      // 判断  如果 选中的树节点<所有数据中所有的节点 全选不选中
      if (treeNodeCheck.length < treeNodeAll) {
        this.$refs.checK[index].model = false;
      } else {
        this.$refs.checK[index].model = true;
      }
    },
    getdepartmentUser() {
      //  我所在的部门的id
      httpServer(apiSetting.departmentUser, {
        user_id: this.roleSet.userid
      })
        .then(response => {
          this.roleForm.sectionDepartment = response.department_id; //默认显示的部门
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    getorganizationAll() {
      //  我所在的部门的id
      httpServer(apiSetting.organizationAll)
        .then(response => {
          //    console.log('我所在的所有部门')
          this.roleForm.optionsDepartment = response;
          //    console.log(response)
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    changeSelectDepartment(vid) {
      // console.log('我是选择的部门')
      this.roleForm.departmentId = vid;
      // console.log(this.roleForm.departmentId)
    },
    getpositionUser() {
      //  我所在的部门的id
      httpServer(apiSetting.positionUser, {
        user_id: this.roleSet.userid
      })
        .then(response => {
          //    console.log('我所在的岗位')
          this.roleForm.stationPost = response.position_id; //默认显示的部门
          //    console.log(response.position_id)
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    getpositionAll() {
      //  我所在的部门的id
      httpServer(apiSetting.positionAll)
        .then(response => {
          this.roleForm.optionsPost = response;
          this.loadingTop = false;
          //    console.log('所有的岗位')
          //    console.log(response)
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    changeSelectPosition(vid) {
      // console.log('我是选择的岗位')
      this.roleForm.positionId = vid;
      // console.log(this.roleForm.positionId)
    },
    getorganizationMenuuser() {
      //  获取当前id的用户信息
      httpServer(apiSetting.getorganizationMenu, {
        user_id: this.stepModel.userid
      })
        .then(response => {
          this.roleForm.data1 = response;
          this.initTree();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //Begin 树的处理
    initTree() {
      //初始调用
      var self = this;
      self.roleForm.data1.forEach(function(item) {
        var itemBol = true;
        if (item.children_list) {
          item.children_list.forEach(function(item1) {
            item1["subActive"] = false;
            if (!item1.active) {
              itemBol = false;
            }
            if (item1.children) {
              var item2Bol = false;
              item1.children.forEach(function(item2) {
                if (item2.active) {
                  item2Bol = true;
                }
              });
              item1.subActive = item2Bol;
            }
          });
        }
        item.active = itemBol;
      });
    },
    //parent: 当前点击对象的父级
    //item: 当前点击的对象
    //parentParent: 当前点击对象的父级的父级
    itemClick(parent, item, parentParent) {
      //单个对象点击事件
      var self = this;
      if (item.active) {
        item.active = false;
      } else {
        item.active = true;
      }
      self.setItemParentForChildrenListActive(parent, item);
    },
    checkAllClick(item) {
      //全选事件
      if (item.active) {
        this.setItemChildrenListActive(item, false);
      } else {
        this.setItemChildrenListActive(item, true);
      }
    },
    setItemChildrenListActive(item, bol) {
      //ChildrenList中的值是否选中
      var self = this;
      item.active = bol;
      item.children_list.forEach(function(item1) {
        item1.active = bol;
      });
    },
    setItemParentForChildrenListActive(parent, item, parentParent) {
      //子集全部取消选中后, 取消父级的选择
      if (parent.children_list) {
        var bol = true;
        parent.children_list.forEach(function(item1) {
          if (!item1.active) {
            bol = false;
          }
        });
        this.setItemParentActive(parent, bol);
      }
    },
    setItemParentActive(parent, bol) {
      //设置父级复选框是否选中
      if (!bol) {
        parent.active = false;
      } else {
        parent.active = true;
      }
    },
    heightSet(parent, item, parentParent) {
      // 点击高级设置
      var self = this;
      self.showCheckedDialog = true;
      self.roleForm.currentHightParentID = item.id;
      self.roleForm.currentHightData = item.children;
      var _bol = true;
      self.roleForm.currentHightData.forEach(function(item1) {
        if (!item1.active) {
          _bol = false;
        }
      });
      if (_bol) {
        self.roleForm.currentHightAllSelect = _bol;
      }
    },
    hightSelectAll() {
      //点击弹出层中的全部选择
      var self = this;
      var bol = true;
      if (self.roleForm.currentHightAllSelect) {
        bol = false;
        self.setParentSubActive(false);
      } else {
        bol = true;
        self.setParentSubActive(true);
      }
      self.roleForm.currentHightData.forEach(function(item) {
        item.active = bol;
      });
      self.roleForm.currentHightAllSelect = bol;
    },
    hightItemClick(item) {
      //高级设置中的单个选择事件
      var self = this;
      if (item.active) {
        item.active = false;
        //设置SubActive是否选中前,需要判断所有数据是否都被取消选中
        var _bol = false;
        self.roleForm.currentHightData.forEach(function(item1) {
          if (item1.active) {
            _bol = true;
          }
        });
        if (!_bol) {
          self.setParentSubActive(_bol);
        }
      } else {
        item.active = true;
        self.setParentSubActive(true);
      }
      var bol = true;
      self.roleForm.currentHightData.forEach(function(item) {
        if (!item.active) {
          bol = false;
        }
      });
      self.roleForm.currentHightAllSelect = bol;
    },
    hightConfim() {
      //高级设置中的确认按钮
      var self = this;
      var tmpData = [];
      self.roleForm.currentHightData.forEach(function(item) {
        if (item.active) {
          tmpData.push(item.id);
        }
      });
      self.currentHightSelectData = tmpData;
      self.showCheckedDialog = false;
      self.roleForm.currentHightData = [];
    },
    setParentSubActive(bol) {
      //设置父级 subActive 属性是否选中
      var self = this;
      self.roleForm.data1.forEach(function(item) {
        if (item.children_list) {
          item.children_list.forEach(function(item1) {
            if (item1.id == self.roleForm.currentHightParentID) {
              item1.subActive = bol;
            }
          });
        }
      });
    },
    getItems() {
      //获取最后的选择结果, 注意, 无论怎么选,只要 区块下面的内容有被选中的,则区块主节点就会被选择
      var self = this;
      var result = [];
      self.roleForm.data1.forEach(function(item) {
        if (item.children_list) {
          var itemBol = false;
          item.children_list.forEach(function(item1) {
            if (item1.active) {
              itemBol = true;
              result.push(item1.id);
            }
          });
          if (itemBol) {
            result.push(item.id);
          }
        }
      });
      if (self.currentHightSelectData) {
        self.currentHightSelectData.forEach(function(item) {
          result.push(item);
        });
      }
      return self.hasRepeat(result);
    },
    //End 树的处理

    confirm() {
      if (this.getItems().length <= 0) {
        this.$message({
          message: "请进行权限选择",
          duration: 1000
        });
        return false;
      }
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.confirmFlage = false;
          if (this.roleSet.userid) {
            //如果有userid就是修改,如果没有userid就添加新账号
            this.confirmAxios(apiSetting.putUser);
          } else {
            this.confirmAxios(apiSetting.postUser);
          }
        } else {
          this.$scrollToTop();
          console.log("error 验证不通过!!");
          return false;
        }
      });
    },
    confirmAxios(url) {
      console.log("0000001111" + this.preformLabelAlign.head_img);
      this.loginContent.onColse = true;
      this.loginContent.content = "正在提交中";
      //修改PUT apiSetting.putUser,新增提交用POST apiSetting.postUser
      httpServer(url, {
        id: this.roleSet.userid ? this.roleSet.userid : 0,
        position_id: this.roleForm.stationPost,
        department_id: this.roleForm.sectionDepartment,
        user_name: this.preformLabelAlign.user_name,
        password: this.preformLabelAlign.password,
        sex: this.preformLabelAlign.gender,
        head_img: this.preformLabelAlign.headerUrl,
        organization_id: 0,
        real_name: this.preformLabelAlign.real_name,
        mail: this.preformLabelAlign.mail,
        phone: this.preformLabelAlign.phone,
        menus: this.getItems() //权限的数组
      })
        .then(response => {
          console.log("我是最后一步提交的信息");
          console.log(response);
          this.confirmFlage = true;
          this.roleSet.isshow = true; //点击下一步 让 角色配置 显示，自己隐藏
          this.roleSet.step = 1;
          this.roleSet.isadd = false;
          this.$emit("changeStep", this.roleSet); //传给父页面 home.vue 的changeStep方法
        })
        .catch(error => {
          this.confirmFlage = true;
          this.loading = false;
          this.loginContent.content = "提交";
          this.loginContent.onColse = false;
          console.log(error); //loading层关闭
        });
    }
  }
};
</script>
<style>
#roleSet .step-btn .next-btn .el-icon-loading {
  margin-left: -3px;
  margin-right: -10px;
}
#roleSet .el-button--primary {
  background-color: #eceff300;
}
#roleSet .role_box .el-form-item__error {
  margin-top: 5px;
  margin-left: 55px;
}
</style>

<style scoped lang="less">
body .content .step-btn {
  margin-top: 40px;
}
body .content .step-btn .next-btn {
  width: 120px;
  height: 36px;
  background-image: linear-gradient(42deg, #8d2de2 0%, #4900e0 100%);
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  padding: 0;
  color: #ffffff;
}
body .content .step-btn .last-step {
  line-height: 0;
}

.role_box {
  width: 880px;
  height: 125px;
  background-color: #ffffff;
  border-radius: 8px;
  border: solid 1px rgba(206, 206, 206, 0.46);
  margin-top: 20px;
  padding-left: 20px;
  padding-top: 25px;
}
.checkbox {
  //  line-height: 20px;
  margin-right: 5px;
  input {
    width: 14px;
    height: 14px;
    display: block;
    float: left;
    margin-top: 4px;
    margin-right: 3px;
  }
  input[type="checkbox"] {
    color: #fff;
  }
  label {
    cursor: pointer;
  }
}
.jurisdiction {
  margin-top: 20px;
  width: 880px;
  min-height: 420px;
  background-color: #ffffff;
  border-radius: 8px;
  border: solid 1px rgba(206, 206, 206, 0.46);
  margin-bottom: 40px;
  padding-left: 20px;
  overflow: hidden;
  .jurisdiction_title {
    line-height: 55px;
  }
  .statistics_list {
    .statistics_list_li {
      width: 200px;
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
      .statistics {
        height: 30px;
        position: relative;
      }
      .statistics_line {
        width: 200px;
        height: 6px;
      }
      .line_one {
        background-color: #00a9ff;
      }
      .line_two {
        background-color: #ff7700;
      }
      .line_three {
        background-color: #1ab933;
      }
      .line_fore {
        background-color: #6a6a6a;
      }
      .jurisdiction_list {
        height: 288px;
        overflow-x: auto;
        background-color: #f5f5f5;
        border: solid 1px #eaeaea;
        border-top: 0px;
        padding: 16px 7px;
        .jurisdiction_list_title {
          width: 174px;
          height: 16px;
          background-color: #ffffff;
          border: solid 1px #eaeaea;
          padding: 10px 5px;
          overflow: hidden;
          position: relative;
          margin-bottom: 10px;
          cursor: pointer;
          .height_set {
            height: 100%;
            color: #aaaeb3;
            font-size: 12px;
            padding-left: 16px;
            background: url(../../../assets/images/images/heightSet.png)
              no-repeat left center;
            background-size: 16px 12px;
          }
          .overSet {
            background: url(../../../assets/images/images/editOver.png)
              no-repeat left center;
            background-size: 14px 14px;
            color: #393c40;
          }
          .checkbox {
            input {
              width: 12px;
              height: 12px;
            }
            label {
              font-size: 12px;
              display: block;
              width: 90px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
.checkedDialog_content {
  overflow: hidden;
  .checkedDialog_title {
    overflow: hidden;
  }
  .waring_dialog {
    font-size: 12px;
    color: #9da1a7;
    span {
      color: #ef444b;
    }
  }
  .dialog_check_box {
    margin-top: 20px;
    width: 520px;
    height: 160px;
    padding: 10px 20px;
    overflow-y: auto;
    background-color: #f5f5f5;
    border: solid 1px rgba(195, 195, 195, 0.35);
    .checkbox {
      margin-bottom: 15px;
      label {
        display: block;
        width: 160px;
        color: #393c40;
      }
    }
  }
}
</style>
<style lang="less">
#roleSet {
  input[type="checkbox"]:checked {
    -webkit-appearance: none;
    background: url("../../../assets/images/images/checkbox.png") no-repeat
      center;
    background-size: 14px 14px;
    color: blue;
    border-radius: 2px;
    outline: none;
  }
  .jurisdiction_list_title {
    input[type="checkbox"]:checked {
      background: url("../../../assets/images/images/checkbox.png") no-repeat
        center;
      background-size: 12px 12px;
    }
  }
  // input[type="checkbox"]:checked:before{
  //         -webkit-appearance: none;
  //          background: red;
  //         color: blue;
  //     }
  .el-form-item {
    margin-bottom: 15px;
    .el-form-item__label {
      color: #393c40;
    }
    .el-form-item__content {
      width: 280px;
      height: 32px;
      border-radius: 4px;
      margin-left: 0px !important;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        background-color: #efefef;
        border: 0px;
        padding: 0px;
        font-size: 12px;
        width: 200px;
      }
    }
    .el-form-item__label {
      width: auto !important;
    }
  }
  .jurisdiction_childen_list {
    .el-checkbox + .el-checkbox {
      margin-left: 0px;
    }
    .el-checkbox {
      display: block;
    }
    .el-checkbox__label {
      font-size: 12px;
    }
    .el-checkbox-group {
      background: #f5f5f5;
      padding: 10px;
    }
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: none;
  }
  .el-tree-node__content:hover {
    background: none;
  }
  .el-tree {
    background: none;
    .el-tree-node {
      margin-bottom: 10px;
      background: #fff;
      padding: 10px;
      .el-tree-node__label {
        color: #393c40;
      }
      .el-tree-node__children {
        background: #f5f5f5;
        padding-top: 5px;
        margin-top: 10px;
        .el-tree-node {
          background: #f5f5f5;
          padding: 0px;
          margin: 0px;
          .el-tree-node__label {
            font-size: 12px;
            color: #393c40;
          }
        }
        .el-tree-node__content {
          // margin:10px 0px;
          padding: 0px 10px !important;
        }
      }
    }
    .el-tree-node__expand-icon {
      color: #5109e2;
      font-size: 18px;
      position: absolute;
      right: 10px;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
  .el-collapse-item__header {
    height: 32px;
    line-height: 0;
    position: relative;
    padding-bottom: 10px;
  }
  .el-collapse-item__arrow {
    line-height: 40px;
    // top:20px;
    z-index: 10;
    position: absolute;
    right: 0px;
    transform: rotate(90deg);
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(270deg);
  }
  .noShowChilden {
    .el-collapse-item__arrow {
      display: none;
    }
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
}
</style>
    