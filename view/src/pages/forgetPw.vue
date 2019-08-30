<template>
  <div class="register backgroupImg">
    <div class="registerPanel centerPanel">
      <p class="title">{{$t('forgetPw')}}</p>
      <div class="Form" v-if="!confrimEmail">
        <aside class="aside">
          <input type="text" class="input" v-model="username" :placeholder="$t('inputusername')" @blur="checkUsername" @focus="inputUsername">
          <i class="iconfont icon-user icon"></i>
          <p class="tip tipNull" v-if="usernameNull">{{$t('usernameNotNull')}}</p>
          <p class="tip tipLegal" v-if="usernameLegal">{{$t('inputuserError')}}</p>
        </aside>
        <aside class="aside">
          <aside class="emailInput">
            <input type="text" class="input" :placeholder="$t('inputemail')" v-model="email" @blur="checkEmail" @focus="inputEmail">
            <i class="iconfont icon-email icon"></i>
            <p class="tip tipNull" v-if="emailNull">{{$t('emailNotNull')}}</p>
            <p class="tip tipLegal" v-if="emailLegal">{{$t('emailError')}}</p>
          </aside>
          <aside class="sendBtnAside">
            <button class="sendBtn" :disabled="btnNotUse" @click="sendCode">{{$t('sendCode')}}<span>({{time}})</span></button>
          </aside>
        </aside>
        <aside class="aside">
          <input type="text" class="input" :placeholder="$t('captcha')" v-model="code" @blur="checkCode" @focus="inputCode">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip" v-if="codeNull">{{$t('codeNotNUll')}}</p>
          <p class="tip" v-if="codeLegal">{{$t('codeError')}}</p>
        </aside>
        <aside class="btnGrounp">
          <button class="leftBtn" @click="cancelRegister">{{$t('cancel')}}</button>
          <button class="rightBtn" @click="confirmRegister">{{$t('submit')}}</button>
        </aside>
      </div>
      <div class="Form" v-else>
        <aside class="aside">
          <input type="password" class="input" placeholder="请输入新密码" v-model="password" @blur="checkPassword" @focus="inputPassword">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip tipNull" v-if="passwordNull">请填写密码</p>
          <p class="tip tipLegal" v-if="passwordLegal">请输入合法密码(长度6-16)</p>
        </aside>
        <aside class="aside">
          <input type="password" class="input" placeholder="确认新密码" v-model="confirmPW" @blur="checkConfirmPW" @focus="inputConfirmPW">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip tipNull" v-if="confirmPwLegal">两次密码不匹配</p>
        </aside>
        <aside class="btnGrounp">
          <button class="leftBtn" @click="cancelRegister">取消</button>
          <button class="rightBtn" @click="confirmPassword">确认</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios'
export default {
  name: "forgetPw",
  data () {
    return {
      time: 60,
      confrimEmail: false,
      btnNotUse: false,
      codeNull: false,
      codeLegal: false,
      passwordNull: false,
      passwordLegal: false,
      confirmPwLegal: false,
      usernameNull: false,
      usernameLegal: false,
      emailNull: false,
      emailLegal: false,
      isChangeInfo: false,
      username: '',
      confirmPW: '',
      password: '',
      email: '',
      code: ''
    }
  },
  methods: {
    inputUsername: function () {
      this.usernameNull = false
      this.usernameLegal = false
    },
    checkUsername: function () {
      console.log(this.username)
      if (this.username === '') {
        this.usernameNull = true
      } else if (this.username.length < 2 || this.username.length > 6) {
        this.usernameLegal = true
      }
    },
    checkPassword: function () {
      this.isChangeInfo = true
      if (this.password === '') {
        this.passwordNull = true
      } else if (this.passwordNull.length < 2 || this.passwordNull.length > 6) {
        this.passwordLegal = true
      }
    },
    inputPassword: function () {
      this.isChangeInfo = true
      this.passwordNull = false
      this.passwordLegal = false
    },
    inputConfirmPW: function () {
      this.isChangeInfo = true
      this.confirmPwLegal = false
    },
    checkConfirmPW: function () {
      this.isChangeInfo = true
      if (this.password !== this.confirmPW) {
        this.confirmPwLegal = true
      }
    },
    checkEmail: function () {
      let checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      this.isChangeInfo = true
      if (this.email === '') {
        this.emailNull = true
      } else if (!checkEmail.test(this.email)) {
        this.emailLegal = true
      }
    },
    inputEmail: function () {
      this.isChangeInfo = true
      this.emailNull = false
      this.emailLegal = false
    },
    checkCode: function () {
      if (this.code === '') {
        this.codeNull = true
      } else if (this.code.length !== 4) {
        this.codeLegal = true
      }
    },
    inputCode: function () {
      this.isChangeInfo = true
      this.codeNull = false
    },
    cancelRegister: function () {
      this.$router.push('/login')
    },
    confirmRegister: function () {
      if (this.isChangeInfo === false) {
        this.usernameNull = true
        this.codeNull = true
        this.emailNull = true
      } else {
        this.checkUsername()
        this.checkEmail()
        this.checkCode()
        if (!this.emailNull && !this.emailLegal && !this.usernameNull && !this.usernameLegal && !this.codeLegal && !this.codeNull) {
          let user = {
            username: this.username,
            email: this.email,
            code: this.code
          }
          axios.post('/api/confirmForget', user).then(({status, data}) => {
            console.log(status, data)
            if (status === 200) {
              if (data.code === 100) {
                this.$Message.success(data.msg)
                this.confrimEmail = true
              } else {
                this.$Message.error(data.msg)
              }
            }
          })
        }
      }
    },
    sendCode () {
      this.checkUsername()
      this.checkEmail()
      if (this.usernameNull === false && this.usernameLegal === false && this.emailLegal === false && this.emailNull === false) {
        let user = {
          username: this.username,
          email: this.email
        }
        axios.post('/api/verifyCode', user).then(({status, data}) => {
            if ( data.code === 100) {
              this.$Message.success(data.msg)
              this.btnNotUse = true
              let timer = setInterval( () => {
                this.time -= 1
                if (this.time === 0) {
                  clearInterval(timer)
                  this.btnNotUse = false
                  this.time = 60
                }
              }, 1000)
            } else if (data.code === -1) {
              this.$Message.error(data.msg)
            } else if (data.code === 109) {
              this.$Message.error(data.msg)
            }
        })
      }
    },
    confirmPassword () {
      this.checkPassword()
      this.checkConfirmPW()
      if (this.passwordNull === false && this.passwordLegal === false && this.confirmPwLegal === false) {
        let password = {
          password: this.password,
          email: this.email
        }
        axios.post('/api/forgetPw', password).then(({status, data}) => {
          if (data.code === 100) {
            this.$Message.success(data.msg)
            this.$router.push('/login')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/backgroud.css";
  @import "../assets/css/register.css";
</style>
