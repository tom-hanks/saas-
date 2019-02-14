<template>
  <div id="memberlist">
    <div class="memberlist_conten" v-loading="loading">
      <div class="header clearfix">
        <p class="title fl">成员列表</p>
        <el-button
          class="fr adddome addbutton"
          title="添加成员"
          v-if="addbuttonshow"
          @click="addlist"
          icon="el-icon-addPlus"
        >添加成员</el-button>
      </div>
      <el-table
        v-if="!putongshow"
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        :header-cell-style="getRowClass"
        :row-style="getAdminRowClass"
        style="width: 100%"
      >
        <el-table-column
          v-if="nodataUser"
          align="center"
          property="user_name"
          label="账户名称"
          min-width="60"
        ></el-table-column>
        <el-table-column property="real_name" align="center" label="员工名称" min-width="45"></el-table-column>
        <el-table-column property="position_name" align="center" label="岗位" min-width="50"></el-table-column>
        <el-table-column property="department_name" align="center" label="所属部门" min-width="90"></el-table-column>
        <el-table-column property="phone" align="center" label="联系方式" min-width="60"></el-table-column>
        <el-table-column property="create_date_time" align="center" label="创建时间"></el-table-column>
        <el-table-column label="操作" min-width="60" align="center">
          <template slot-scope="scope" v-if="scope.row.position_name!='管理员'">
            <span
              title="编辑"
              class="el-icon-edit editbutton"
              v-if="editbuttonshow"
              @click="modify(scope.row.id,scope.row)"
            ></span>
            <span
              class="jiange"
              v-if="jiangeshow && (page.pageIndex!=1 || tableData[0].id!=scope.row.id)"
            >|</span>
            <span
              title="删除"
              class="el-icon-delete delebutton"
              v-if="delebuttonshow && (page.pageIndex!=1 || tableData[0].id!=scope.row.id)"
              @click="deleteList(scope.row.id,scope.row)"
            ></span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 这是普通身份看到的 -->
      <el-table
        v-if="putongshow"
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        :header-cell-style="getRowClass"
        :row-style="getAdminRowClass"
        style="width: 100%"
      >
        <el-table-column property="real_name" align="center" label="员工名称" min-width="45"></el-table-column>
        <el-table-column property="position_name" align="center" label="岗位" min-width="45"></el-table-column>
        <el-table-column property="department_name" align="center" label="所属部门" min-width="80"></el-table-column>
        <el-table-column property="phone" align="center" label="联系方式" min-width="70"></el-table-column>
        <el-table-column property="create_date_time" align="center" label="创建时间" min-width="60"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-on:size-change="page.changeSize"
      v-on:current-change="page.gotoPage"
      :current-page="page.pageIndex"
      :page-sizes="page.pageSizeList"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>

    <!-- 弹窗 -->
    <el-dialog title="提示" :append-to-body="true" :visible.sync="showDialog">
      <div slot="footer" class="dialog-footer">
        <p class="dialog_tip">是否删除成员：{{deleteUsername}}</p>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { httpServer, apiSetting } from "../../../assets/js/http.js";

import page from "../../../assets/js/page.js";

export default {
  name: "memberlist",
  props: {
    stepModel: null
  },
  components: {},
  data() {
    return {
      tableData: [{}],
      nodataUser: true, //没事
      deleteUsernum: 0,
      deleteUsername: "",
      showDialog: false,
      page: page, //分页
      currentRow: null,
      putongshow: true, //普通权限和高级权限的显示开关
      delebuttonshow: false, //判断删除按钮显示隐藏
      editbuttonshow: false,
      addbuttonshow: false,
      jiangeshow: false, //显示隐藏 编辑和 删除的间隔线
      memberlis: {
        //为了传给父组件
        isshow: null, //下一步
        title: "新增用户",
        userid: null,
        username: ""
      },
      loading: true,
      apploginid: {} //全局登陆后的用户id
    };
  },
  mounted() {
    this.getload();
    this.apploginid = this.$getsessionStorage("personal").id;
  },
  methods: {
    getAdminRowClass({ row, column, rowIndex, columnIndex }) {
      //设置表头颜色
      if (row.id == this.apploginid) {
        return "background:#D5EBFF;";
      } else {
        return "";
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getload() {
      this.page.pageSize = 10;
      this.page.pageSizeList = [10, 20, 30, 40]; //修改可以下拉框选择的每页显示数
      let $emit = this;
      $emit.page.query = function() {
        $emit.getList();
      };
      apiSetting.memberList.page = this.page; //api接口分页赋值
      apiSetting.memberList.dataList = this.dataList; //api分页数据赋值
      // console.log(this.stepModel.buttonPower.length)//>0,说明有权限传过来
      if (this.stepModel.buttonPower && this.stepModel.buttonPower.length > 0) {
        this.putongshow = false; //有权限说明就不是普通用户
        //forEach
        this.stepModel.buttonPower.forEach(v => {
          //判断传过来的按钮对应显示
          if (v.item.menu_url === "delebutton") {
            this.delebuttonshow = true;
          }
          if (v.item.menu_url === "editbutton") {
            this.editbuttonshow = true;
          }
          if (v.item.menu_url === "addbutton") {
            this.addbuttonshow = true;
          }
          if (this.editbuttonshow && this.delebuttonshow) {
            this.jiangeshow = true; //如果编辑和删除都显示的话，竖线间隔 才显示
          }
          if (
            this.editbuttonshow &&
            this.delebuttonshow &&
            this.addbuttonshow
          ) {
            this.putongshow = false; //有权限说明就不是普通用户
          } else if (
            !this.editbuttonshow &&
            !this.delebuttonshow &&
            this.addbuttonshow
          ) {
            this.putongshow = true; //没有修改、删除权限，说明就不是普通用户
          }
        });
      }

      $emit.getList();
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      //设置表头颜色

      if (rowIndex == 0) {
        return "background:#EFEFEF;height:38px;padding:0;border:0;";
      } else {
        return "";
      }
    },
    addlist() {
      //新增的时候把标题传过去
      //this.memberlis.real_name = '';//点击添加就需要清除父组件存的表单（因为点击修改的时候需要默认值，点击添加的时候就不需要）
      this.$emit("changeStep", this.memberlis);
    },
    modify(id, real_name) {
      this.memberlis.title = "修改账户";
      this.memberlis.userid = id;
      this.memberlis.real_name = real_name;
      this.$emit("changeStep", this.memberlis);
    },
    getList() {
      //  获取列表请求
      httpServer(apiSetting.memberList, {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
        .then(response => {
          this.tableData = response.collection;
          this.tableData.forEach(item => {
            if (!item.user_name) {
              this.nodataUser = false;
            }
          });
          this.loading = false;
          //如果小于等于0的时候，显示暂无数据
          if (response.collection.length <= 0) {
            this.tableData = [];
          }
        })
        .catch(error => {
          // alert(error)
          this.loading = false;
          console.log(error); //loading层关闭
        });
    },
    deleteList(id, val) {
      this.deleteUsername = val.real_name;
      this.deleteUsernum = id;
      this.showDialog = true;
    },
    deleteUser() {
      httpServer(apiSetting.deletUser, {
        id: this.deleteUsernum
      })
        .then(response => {
          console.log(response);
          if (response) {
            this.getload();
            this.showDialog = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error); //loading层关闭
        });
      // this.tableData = [];
    },
    cancel() {
      this.showDialog = false;
    }
  },
  beforeDestroy() {
    this.page.pageIndex = 1; //生命周期结束默认返回第一页
  }
};
</script>


<style scoped lang="less">
#memberlist {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  .memberlist_conten {
    width: 880px;
    min-height: 560px;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px rgba(206, 206, 206, 0.46);
    padding-top: 14px;
    margin-top: 30px;
    .header {
      padding-left: 20px;
      padding-right: 20px;
      .title {
        height: 32px;
        line-height: 32px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #393c40;
        margin-bottom: 10px;
      }
      .adddome {
        // margin-right: 18px;
      }
    }
    .jiange {
      margin-left: 15px;
      margin-right: 15px;
      color: #aaaeb3;
    }
    .el-icon-edit {
      font-size: 14px;
      color: #4a00e0;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .el-icon-edit:hover {
      transform: scale(1.5);
    }
    .el-icon-delete {
      font-size: 14px;
      color: #f55d5d;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .el-icon-delete:hover {
      transform: scale(1.5);
    }
  }
}
</style>

<style>
#memberlist .organization_content {
  padding: 0;
}
#memberlist .el-table thead {
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  height: 38px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #adb1b6;
}
#memberlist .el-table th {
  height: 54px;
  box-sizing: border-box;
}
#memberlist .el-table__footer-wrapper,
.el-table__header-wrapper {
  background: #efefef;
}
#memberlist .cell {
  max-height: 48px !important;
  font-size: 12px;
  overflow: hidden !important;
}
#memberlist .el-table .cell {
  padding-left: 20px;
}
#memberlist .el-pagination__sizes .el-input .el-input__inner {
  width: 108px;
}
.dialog_tip {
  height: 20px;
  line-height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  padding-bottom: 32px;
  color: #433d3d;
}
</style>