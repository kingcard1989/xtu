<template>
  <div>
    <el-dialog
      title="注册"
      :visible.sync="dialogFormRegister"
      @close="closeDialog"
      width="25%"
      center
    >
      <el-form
        :model="RegisterForm"
        status-icon
        ref="RegisterForm"
        :rules="RegisterRules"
        label-width="100px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input
            placeholder="请输入学号"
            v-model="RegisterForm.stuId"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="请输入邮箱"
            v-model="RegisterForm.email"
          ></el-input>
        </el-form-item>

        <el-form-item label="设置密码" prop="password">
          <el-input
            placeholder="6~12个字符"
            type="password"
            v-model="RegisterForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="width: 100%"
          type="primary"
          round
          @click.native="registerClick"
          >确 定</el-button
        >
        <div class="button-wjmm">
          <a @click="gologinClick()">已激活，去登录</a>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'; // 引入 axios
export default {
  data() {
    return {
      dialogFormRegister: false,
      RegisterForm: {
        stuId: "",
        email: "",
        password: "",
      },
      loading: false,
      RegisterRules: {
        stuId: [{ required: true, trigger: "blur", message: "请输入学号" }],
        email: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
      },
    };
  },
  computed: {
    dialogregister() {
      return this.$store.state.dialog.register;
    },
  },
  watch: {
    dialogregister(val) {
      this.dialogFormRegister = val;
    },
  },
  methods: {
    gologinClick() {
      this.$store.dispatch("dialog/setregister", false);
      this.$store.dispatch("dialog/setlogin", true);
    },
    closeDialog() {
      this.$store.dispatch("dialog/setregister", false);
    },
    registerClick() {
      this.$refs.RegisterForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 调用新的注册 API
          axios.post('http://localhost:3000/api/register', this.RegisterForm)
            .then((res) => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message);
                this.$store.dispatch("dialog/setregister", false);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((error) => {
              console.error(error);
              this.$message.error('注册失败，请重试');
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
/* 添加样式 */
</style>