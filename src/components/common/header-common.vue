<template>
  <div>
    <keep-alive>
      <div class="header-ct">
        <div class="header-logo">
          <img src="../../assets/img/logo2.png" alt="" />
        </div>
        <ul class="header-nav">
          <router-link
            :to="items.path"
            tag="li"
            @click.native="selectMenu(items.id)"
            v-for="(items, index) in menuList"
            :class="defaultSelectPage === items.id ? 'active' : ''"
            :key="index"
          >
            {{ items.label }}
            <span class="active-span"></span>
          </router-link>
          
        </ul>
        <div class="header-user">
          <div v-if="userInfo.stuId">
            <div
              style="
                right: 50%;
                display: inline-block;
                margin-right: 50px;
                line-height: 15px;
              "
            >
                      </div>
            <!-- <el-dropdown style="right: 50%">
              <el-badge class="item">
                <span class="el-icon el-icon-message"></span>
              </el-badge>
            </el-dropdown> -->
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="'https://tse3-mm.cn.bing.net/th/id/OIP-C.qidgOqAsPEdzAg5inmSK3AAAAA?rs=1&pid=ImgDetMain'" />
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="$router.push('/personalCenter')"
                  >个人中心</el-dropdown-item
                >
                <el-dropdown-item @click.native="gofindpassword()"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item @click.native="logoutClick()"
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <el-button
              type="primary"
              round
              size="mini"
              @click.native="gologinClick()"
              >登录</el-button
            >
            <el-button round size="mini" @click.native="goregister()"
              >注册</el-button
            >
          </div>
        </div>
      </div>
    </keep-alive>

    <LoginBox />
    <RegisterBox />
    <FormpassBox />
    <FindpassBox />
    <!-- 使用 el-dialog 作为考试通知弹出框 -->
    <el-dialog :visible.sync="showExamNewBox" title="考试通知" @close="handleClose">
      <div class="exam-content">
        <h2>最近可以参加的考试</h2>
        <ul class="exam-list">
          <li>
        <a href="http://localhost:1991/s/g5GacM" target="_blank">网络安全常识------公共类</a>
        </li>
        <li>
        <a href="http://localhost:1991/s/TL5vhQ" target="_blank">Web应用安全------Web应用基础</a>
        </li>
        </ul>
        <p>请确保在开始考试之前，您已准备好所有必要的材料。</p>
        <p>考试说明：考试成绩会进行学习记录</p>
        <div class="exam-actions">
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mapGetters } from 'vuex';
import LoginBox from "@/components/common/login-box";
import RegisterBox from "@/components/common/register-box";
import FormpassBox from "@/components/common/formpass_box";
import FindpassBox from "@/components/common/findpass_box";
export default {
  name: "header-common",
  components: {
    LoginBox,
    RegisterBox,
    FormpassBox,
    FindpassBox,
  },
  data() {
    return {
      timer: null,
      dialogFormPassword: false,
      defaultSelectPage: 0,
      showExamNewBox: false, // 控制 examnewbox 的显示
      menuList: [
        { label: "首页", id: 1, path: "/homeCenter" },
        {
          label: "学习中心",
          id: 2,
          path: "/courseCenter",
        },
        {
          label: "个人中心",
          id: 3,
          path: "/learnCenter",
        },
        {
          label: "讲师",
          id: 4,
          path: "/teacherCenter",
        },
        {
          label: "问答",
          id: 5,
          path: "/forumCenter",
        },
      ],
      loginForm: {
        stuId: "",
        password: "",
      },
      loginRules: {
        stuId: [{ required: true, trigger: "blur", message: "请输入学号" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
      },
    };
  },

  watch: {
    $route: {
      handler(to, from) {
        let item = this.menuList.find((item) => {
          return item.path == to.path;
        });

        if (item && item.id) this.defaultSelectPage = item.id;
      },
      deep: true,
      immediate: true,
    },
    userInfo(newVal) {
      // 当 userInfo 变化时，检查并设置 showExamNewBox
      if (newVal && newVal.stuId) {
        this.showExamNewBox = true; 
      } else {
        this.showExamNewBox = false; 
      }
    },
  },

  computed: {
    ...mapGetters('user', ['userInfo']),
    defaultSelectPages() {},
  },
  destroyed() {},

  mounted() {
    // console.log(this.userInfo);
  },
  methods: {
    ...mapActions("user", [ "login"]),
    goregister() {
      this.$store.dispatch("dialog/setregister", true);
    },
    gologinClick() {
      this.$store.dispatch("dialog/setlogin", true);
      this.$store.dispatch("dialog/setregister", false);
    },
    logoutClick() {
      this.logout();
    },
    selectMenu(id) {
      this.defaultSelectPage = id;
    },
    gofindpassword() {
      this.$store.dispatch("dialog/setfindpass", true);
    },
    
    handleClose() {
      this.showExamNewBox = false; // 关闭弹出框
    },
  },
};
</script>
<style lang="scss">
.el-dropdown-link {
  width: 50px;
  cursor: pointer;
  img {
    width: 32px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
  }
}
.header-ct {
  width: 1200px;
  height: 60px;
  margin: 0 auto;
  position: relative;
  letter-spacing: 2px;
  color: #9aabb8;
  line-height: 60px;
  .header-logo {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 60px;
    font-size: 20px;
    font-weight: 700;
    padding-left: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 180px;
    line-height: 60px;
    float: left;
    img {
      width: 152px;
      margin-top: 1px;
    }
  }
  .header-nav {
    float: left;
    height: 60px;
    padding-left: 10px;
    font-size: 16px;
    line-height: 60px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    li {
      width: 108px;
      text-align: center;
      float: left;
      position: relative;
      height: 60px;
      transition: all 0.3s;
      cursor: pointer;
      &.active {
        color: $theme-color-font;
        font-size: 18px;
        font-weight: 700;
        position: relative;
        .active-span {
          width: 2em;
        }
      }
      .active-span {
        width: 0px;
        height: 4px;
        display: block;
        border-radius: 4px;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        position: absolute;
        z-index: 2;
        bottom: -4px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);

        // background: linear-gradient(90deg, #0059c5, #49d9e3);
        background: $theme-color-bg;
      }
    }
  }
  .header-user {
    height: 60px;
    float: right;
  }

  // .el-dropdown {
  //   position: absolute;
  //   right: 0;
  //   top: 35px;
  //   height: 36px;
  //   line-height: 36px;
  //   cursor: pointer;
  //   .cp {
  //     font-size: 36px;
  //     color: #009cde;
  //     padding-right: 5px;
  //     vertical-align: middle;
  //   }
  // }
}

// .form-login .el-input__inner {
//   height: 45px;
//   line-height: 45px;
//   background: #eef3f5;
// }
.button-wjmm {
  margin: 15px 0;
  letter-spacing: 2px;
  text-align: right;
  font-size: 12px;
}
.exam-content {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.exam-list {
  list-style-type: none; 
  padding: 0; 
}

.exam-list li {
  margin: 10px 0; 
}

.exam-list a {
  color: #409EFF; 
  text-decoration: none; 
  font-weight: bold; 
}

.exam-list a:hover {
  text-decoration: underline; }

.exam-actions {
  margin-top: 20px; 
  display: flex;
  justify-content: flex-end; 
}
</style>

