<template>
  <div class="login-component">
    <div class="login-logo">
      <img src="@/assets/images/project_logo.png" alt="" />
    </div>
    <div class="login-form-container">
      <div class="inner-container">
        <div class="main-title">
          欢迎登录
          <img src="@/assets/images/project_logo.png" alt="" />
        </div>
        <div class="tips-container">
          <span class="tips-span">{{ loginTip }}</span>
        </div>
        <el-form
          ref="loginFormIns"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="userName">
            <el-input
              class="login-input"
              v-model="loginForm.userName"
              :prefix-icon="User"
              maxlength="16"
              name="userName"
              type="text"
              auto-complete="on"
              placeholder="账号"
              autofocus
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="login-input"
              maxlength="50"
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
              name="password"
              auto-complete="on"
              placeholder="密码"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item class="non-border button-container">
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%"
              class="login-button"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { loginRequest } from "@/api/user.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const loginTip = ref(null);
const loading = ref(false);
const loginForm = ref({
  userName: "",
  password: "",
});
const loginFormIns = ref(null);
const loginRules = ref({
  userName: [
    {
      required: true,
      trigger: "blur",
      message: "账号",
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: "密码",
    },
  ],
});
const handleLogin = () => {
  loginFormIns.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      loginRequest({
        userName: loginForm.value.userName,
        password: loginForm.value.password,
      })
        .then((res) => {
          if (res.code === 4101) {
            ElMessage({
              message: "账号或密码错误，请重新登录！",
              type: "warning",
            });
          } else {
            if (res.data && res.data.token) {
              localStorage.setItem("diy-admin-token", res.data.token);
              router.push("/");
            }
          }
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
.login-component {
  height: 100%;
  width: 100%;
  background: url("../../assets/images/login_background.png");
  // background: url("../../assets/images/login_background2.jpg");
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-logo {
    position: absolute;
    top: 40px;
    left: 120px;
    width: 190px;
    height: 90px;
    border-radius: 5px;
    color: #252d3d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-family: fantasy;
    filter: invert(1);
  }
  .login-form-container {
    width: 478px;
    height: 422px;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0px 9px 13px 0px rgba(17, 58, 96, 0.15);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .inner-container {
      width: 440px;
      height: 380px;
      background: #ffffff;
      box-shadow: 0px 9px 13px 0px rgba(17, 58, 96, 0.15);
      border-radius: 20px;
      padding: 74px 40px 0;
      .main-title {
        font-size: 20px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #252d3d;
        text-align: center;
        display: flex;
        align-items: center;
        img {
          height: 30px;
          margin-left: 10px;
        }
      }
      .tips-container {
        height: 50px;
        line-height: 50px;
        color: #ff0000;
      }
      .ad-container {
        margin-bottom: 72px;
      }
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 30px;
  }
  :deep(.login-button) {
    background: #029bb0;
    border-color: #029bb0;
  }
  :deep(.login-input) {
    input:focus {
      border-color: #029bb0;
    }
  }
  :deep(.login-checkbox) {
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background: #029bb0;
      border-color: #029bb0;
    }
    .el-checkbox__inner:hover {
      border-color: #029bb0;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #029bb0;
    }
  }

  .button-container {
    margin-top: 80px;
  }
}
</style>