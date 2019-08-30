<template>
  <div class="register backgroupImg">
    <div class="registerPanel centerPanel">
      <p class="title">{{$t('changePw')}}</p>
      <div class="Form">
        <aside class="aside">
          <input type="password" class="input" :placeholder="$t('inputoldPassword')" v-model="oldPassword" @blur="checkOldPassword" @focus="inputOldPassword">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip" v-if="oldPasswordNull">{{$t('oldPasswordNotNull')}}</p>
          <p class="tip" v-if="oldPasswordLegal">{{$t('InpputPasswordError')}}</p>
          <p class="tip tipError" v-if="passwordError">{{$t('oldPasswordError')}}</p>
        </aside>
        <aside class="aside">
          <input type="password" class="input" :placeholder="$t('inputNewPassword')" v-model="password" @blur="checkPassword" @focus="inputPassword">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip" v-if="passwordNull">{{$t('passwordNotNull')}}</p>
          <p class="tip" v-if="passwordLegal">{{$t('InpputPasswordError')}}</p>
        </aside>
        <aside class="aside">
          <input type="password" class="input" :placeholder="$t('confirmNewPassword')" v-model="confirmPW" @blur="checkConfirmPW" @focus="inputConfirmPW">
          <i class="iconfont icon-passwd icon"></i>
          <p class="tip tipNull" v-if="confirmPwLegal">{{$t('confirmPasswordError')}}</p>
        </aside>
        <aside class="btnGrounp">
          <button class="leftBtn" @click="cancelRegister">{{$t('cancel')}}</button>
          <button class="rightBtn" @click="confirmRegister">{{$t('submit')}}</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '../axios'
  export default {
    name: "register",
    data () {
      return {
        oldPasswordNull: false,
        oldPasswordLegal: false,
        passwordError: false,
        passwordNull: false,
        passwordLegal: false,
        confirmPwLegal: false,
        isChangeInfo: false,
        oldPassword: '',
        password: '',
        confirmPW: '',
      }
    },
    methods: {
      checkOldPassword: function () {
        this.isChangeInfo = true
        if (this.oldPassword === '') {
          this.oldPasswordNull = true
        } else if (this.oldPassword.length < 2 || this.oldPassword.length > 6) {
          this.oldPasswordLegal = true
        }
      },
      inputOldPassword: function () {
        this.isChangeInfo = true
        this.oldPasswordNull = false
        this.oldPasswordLegal = false
      },
      checkPassword: function () {
        this.isChangeInfo = true
        if (this.password === '') {
          this.passwordNull = true
        } else if (this.password.length < 2 || this.password.length > 6) {
          this.passwordLegal = true
        }
      },
      inputPassword: function () {
        this.isChangeInfo = true
        this.passwordNull = false
        this.passwordLegal = false
      },
      checkConfirmPW: function () {
        this.isChangeInfo = true
        if (this.password !== this.confirmPW) {
          this.confirmPwLegal = true
        }
      },
      inputConfirmPW: function () {
        this.isChangeInfo = true
        this.confirmPwLegal = false
      },
      cancelRegister: function () {
        this.$router.back(-1)
      },
      confirmRegister: function () {
        if (this.isChangeInfo === false) {
          this.passwordNull = true
          this.oldPasswordNull = true
          this.confirmPwLegal = true
        } else {
          this.checkOldPassword()
          this.checkPassword()
          this.checkConfirmPW()
          if (!this.passwordNull && !this.passwordLegal && !this.confirmPwLegal && !this.oldPasswordNull && !this.oldPasswordLegal) {
            let user = {
              id: this.$store.state.users.id,
              oldpassword: this.oldPassword,
              newPassword: this.password
            }
            axios.post('/api/checkedPw', user).then(({status, data}) => {
              if (data.code === 100) {
                this.$Message.success('密码重置成功,请重新登陆')
                this.$router.push('/login')
              } else if (data.code === 106) {
                this.$Message.error('对不起原密码错误')
                this.oldPassword = ''
              }
            })
          }
        }
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/backgroud.css";
  @import "../assets/css/register.css";
</style>
