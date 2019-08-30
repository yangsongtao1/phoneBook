<template>
  <div class="backgroupImg login">
    <div class="centerPanel loginPanel">
      <p class="title">{{$t('webName')}}</p>
      <div class="Form">
        <aside class="aside">
          <input type="text" class="input" :placeholder="$t('inputusername')" v-model="username">
          <i class="iconfont icon-user icon"></i>
          <p class="Errortip" v-if="showUserNameTip">{{$t('usernameNotNull')}}</p>
        </aside>
        <aside class="aside">
          <input type="password" class="input" :placeholder="$t('inputpassword')" v-model="password">
          <i class="iconfont icon-passwd icon"></i>
          <p class="Errortip" v-if="showPassswordTip">{{$t('passwordNotNull')}}</p>
        </aside>
        <aside class="aside tip">
          <aside class="select">
            <input type="checkbox" name="vehicle" value="rememberMe" id="rememberMe"/> <label for="rememberMe" class="remLabel">{{$t('rememberPW')}}</label>
          </aside>
          <p class="forgetPw" @click="forgetPw">{{$t('forgetPw')}}？</p>
        </aside>
        <aside class="btnGrounp">
          <button class="leftBtn" @click="goRegister">{{$t('register')}}</button>
          <button class="rightBtn" @click="login">{{$t('login')}}</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '../axios'
  export default {
    name: "login",
    data () {
      return {
        username: '',
        password: '',
        showPassswordTip: false,
        showUserNameTip: false,
        rememberPw: ''
      }
    },
    watch: {
      username: function (val) {
        if (val === '') {
          this.showUserNameTip = true
        } else {
          this.showUserNameTip = false
        }
      },
      password: function (val) {
        if (val === '') {
          this.showPassswordTip = true
        } else {
          this.showPassswordTip = false
        }
      }
    },
    methods: {
      goRegister: function () {
        this.$router.push('/register')
      },
      forgetPw: function () {
        this.$router.push('/forgetPw')
      },
      login: function () {
        if (this.username === '') {
          this.showUserNameTip = true
        }
        if (this.password === '') {
          this.showPassswordTip = true
        }
        if (this.username !== '' && this.password !== '') {
          let user = {
            username: this.username,
            password: this.password
          }
          axios.post('/api/login', user).then(({data}) => {
              if (data.code === 104) {
                this.$Message.error(this.$t('noUser'));
              } else if (data.code === 105) {
                this.$Message.error(this.$t('errorUser'));
              } else {
                this.$Message.success(this.$t('loginSuccess'));
                this.$store.dispatch('userNameAddFun', user.username)
                this.$store.dispatch('tokenAddFun', data.token)
                this.$store.dispatch('idAddFun', data.user.id)
                this.$router.push('/')
              }
          })
        }
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/backgroud.css";
  @import "../assets/css/login.css";
</style>
