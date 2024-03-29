<template>
   <div class="login">
      <el-form
         ref="loginForm"
         :model="loginForm"
         :rules="loginRules"
         class="login-form"
      >
         <h3 class="title">{{ title }}</h3>
         <el-form-item prop="username">
            <el-input
               v-model="loginForm.username"
               type="text"
               auto-complete="off"
               placeholder="账号"
            >
               <template v-slot:prefix>
                  <svg-icon
                     icon-class="user"
                     class="el-input__icon input-icon"
                  />
               </template>
            </el-input>
         </el-form-item>
         <el-form-item prop="password">
            <el-input
               v-model="loginForm.password"
               type="password"
               auto-complete="off"
               placeholder="密码"
               @keyup.enter="handleLogin"
            >
               <template v-slot:prefix>
                  <svg-icon
                     icon-class="password"
                     class="el-input__icon input-icon"
                  />
               </template>
            </el-input>
         </el-form-item>
         <el-form-item prop="code">
            <el-input
               v-model="loginForm.code"
               auto-complete="off"
               placeholder="验证码"
               style="width: 63%"
               @keyup.enter.native="handleLogin"
            >
               <template #prefix>
                  <svg-icon
                     icon-class="validCode"
                     class="el-input__icon input-icon"
                  />
               </template>
            </el-input>
            <div class="login-code">
               <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
         </el-form-item>
         <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox
         >
         <el-form-item style="width: 100%">
            <el-button
               :loading="loading"
               type="primary"
               style="width: 100%"
               @click.prevent="handleLogin"
            >
               <span v-if="!loading">登 录</span>
               <span v-else>登 录 中...</span>
            </el-button>
         </el-form-item>
      </el-form>
      <!--  底部  -->
      <div class="el-login-footer">
         <span>{{ copyright }}</span>
      </div>
   </div>
</template>

<script>
import { mapState } from "vuex";
import { getCodeImg } from "@/Apis/Login";
import { encryption, decryption } from "@/Utils/AES";

export default {
   name: "Login",
   data() {
      return {
         codeUrl: "",
         loginForm: {
            username: "",
            password: "",
            rememberMe: false,
            code: "",
            uuid: ""
         },
         loginRules: {
            username: [
               { required: true, trigger: "blur", message: "用户名不能为空" }
            ],
            password: [
               { required: true, trigger: "blur", message: "密码不能为空" }
            ],
            code: [
               { required: true, trigger: "change", message: "验证码不能为空" }
            ]
         },
         loading: false,
         redirect: undefined
      };
   },
   computed: {
      ...mapState({
         copyright: (state) => state.settings.copyright,
         aesKey: (state) => state.settings.aesKey,
         aesIv: (state) => state.settings.aesIv,
         title: (state) => state.settings.title
      })
   },
   watch: {
      $route: {
         handler: function (route) {
            this.redirect = route.query && route.query.redirect;
         },
         immediate: true
      }
   },
   created() {
      // this.getCode()
      this.getPassword();
   },
   methods: {
      getCode() {
         getCodeImg().then((res) => {
            if (res) {
               this.codeUrl = "data:image/gif;base64," + res.img;
               this.loginForm.uuid = res.uuid;
            }
         });
      },
      getPassword() {
         const username = localStorage.getItem("username");
         const password = localStorage.getItem("password");
         const rememberMe = localStorage.getItem("rememberMe");

         this.loginForm = {
            username:
               username === undefined ? this.loginForm.username : username,
            password:
               password === undefined
                  ? this.loginForm.password
                  : decryption(password, this.aesKey, this.aesIv),
            rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
         };
      },
      handleLogin() {
         this.$refs.loginForm.validate((valid) => {
            if (valid) {
               this.loading = true;
               this.$store
                  .dispatch("Login", this.loginForm)
                  .then(() => {
                     if (this.loginForm.rememberMe) {
                        localStorage.setItem(
                           "username",
                           this.loginForm.username
                        );
                        localStorage.setItem(
                           "password",
                           encryption(
                              this.loginForm.password,
                              this.aesKey,
                              this.aesIv
                           )
                        );
                        localStorage.setItem(
                           "rememberMe",
                           this.loginForm.rememberMe
                        );
                     } else {
                        localStorage.removeItem("username");
                        localStorage.removeItem("password");
                        localStorage.removeItem("rememberMe");
                     }

                     this.$router.push({ path: this.redirect || "/" });
                  })
                  .catch((e) => {
                     this.loading = false;
                     if (e.response.data && e.response.data.code !== 200) {
                        this.$message.error(e.response.data.errMsg);
                     }
                     //  this.getCode()
                  });
            }
         });
      }
   }
};
</script>

<style lang="less" scoped>
.login {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
   background-image: url("../../Assets/Images/LoginBackground.jpg");
   background-size: cover;
}
.title {
   margin: 0px auto 30px auto;
   text-align: center;
   color: #707070;
}

.login-form {
   border-radius: 6px;
   background: #ffffff;
   width: 400px;
   padding: 25px 25px 5px 25px;
   .el-input {
      height: 38px;
      input {
         height: 38px;
      }
   }
   .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
   }
}
.login-tip {
   font-size: 13px;
   text-align: center;
   color: #bfbfbf;
}
.login-code {
   width: 33%;
   height: 38px;
   float: right;
   img {
      cursor: pointer;
      vertical-align: middle;
   }
}
.el-login-footer {
   height: 40px;
   line-height: 40px;
   position: fixed;
   bottom: 0;
   width: 100%;
   text-align: center;
   color: #fff;
   font-family: Arial;
   font-size: 12px;
   letter-spacing: 1px;
}
.login-code-img {
   height: 38px;
}
</style>
