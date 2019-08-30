<template>
  <div class="person backgroupImg">
    <div class="personPanel centerPanel">
      <p class="title">{{$t('personalcenter')}}</p>
      <div class="Form">
        <aside>
          <label>{{$t('account')}}:</label>
          <span>{{this.$store.state.users.username}}</span>
        </aside>
        <aside>
          <label>{{$t('addemail')}}:</label>
          <span v-if="!changeEmail">{{nowEmail}}</span>
          <span v-else style="position: relative">
            <input type="text" class="inputEmail" v-model="email" @blur="checkEmail" @focus="inputEmail" :placeholder="$t('addemail')">
            <button class="sendBtn" @click="sendCode" :disabled="btnNotUse">{{$t('sendCode')}}({{time}})</button>
          </span>
        </aside>
        <aside v-if="emailNull || emailLegal && changeEmail">
          <label style="width: 49%"></label>
          <p class="tip" v-if="emailNull">{{$t('emailNotNull')}}</p>
          <p class="tip" v-if="emailLegal">{{$t('emailError')}}</p>
        </aside>
        <aside v-if="changeEmail">
          <label>{{$t('captcha')}}:</label>
          <span>
            <input type="text" class="inputEmail" @blur="checkCode" @focus="inputCode" :placeholder="$t('captcha')" v-model="code">
          </span>
        </aside>
        <aside v-if="codeNull || codeLegal && changeEmail">
          <label style="width: 49%"></label>
          <p class="tip" v-if="codeNull">{{$t('codeNotNUll')}}</p>
          <p class="tip" v-if="codeLegal">{{$t('codeError')}}</p>
        </aside>
        <aside>
          <label>{{$t('contactsGroup')}}:</label>
          <span>{{groupsList}}</span>
        </aside>
        <aside>
          <label>{{$t('generalContact')}}:</label>
          <span>{{getAllPersonNumber}} {{$t('person')}}</span>
        </aside>
        <aside class="btnGrounp" v-if="!changeEmail">
          <button @click="goBack" class="leftBtn">{{$t('goBack')}}</button>
          <button @click="changeInfo" class="rightBtn">{{$t('changeEmail')}}</button>
        </aside>
        <aside class="btnGrounp" v-else>
          <button @click="cancel" class="leftBtn">{{$t('cancel')}}</button>
          <button @click="confirmChange" class="rightBtn">{{$t('submit')}}</button>
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
      btnNotUse: false,
      changeEmail: false,
      emailNull: false,
      emailLegal: false,
      codeNull: false,
      codeLegal: false,
      isChangeInfo: false,
      nowEmail: '',
      email: '',
      code: '',
      groups: []
    }
  },
  mounted () {
    this.getGroupList()
    this.getUserEamil()
  },
  methods: {
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
    goBack: function () {
      this.$router.push('/')
    },
    changeInfo: function () {
      this.changeEmail = true
    },
    checkCode: function () {
      if (this.code === '') {
        this.codeNull = true
        this.codeLegal = false
      } else if (this.code.length !== 4) {
        this.codeNull = false
        this.codeLegal = true
      }
    },
    inputCode: function () {
      this.isChangeInfo = true
      this.codeNull = false
    },
    confirmChange: function () {
      this.checkEmail()
      this.checkCode()
      if (!this.codeNull && !this.codeLegal && !this.emailNull && !this.emailLegal) {
        let user = {
          email: this.email,
          id: this.$store.state.users.id,
          code: this.code,
          username: this.$store.state.users.username
        }
        axios.post('/api/changeEmail', user).then(({status, data}) => {
          console.log(status, data)
          if (data.code === 100) {
            this.$Message.success(data.msg)
            this.changeEmail = false
            this.getUserEamil()
          } else {
            this.$Message.error(data.msg)
          }
        })
      }
    },
    cancel: function () {
      this.changeEmail = false
      this.emailLegal = false
      this.emailNull = false
      this.codeLegal = false
      this.codeNull = false
    },
    sendCode: function () {
      this.checkEmail()
      if (this.emailLegal === false && this.emailNull === false) {
        let user = {
          username: this.$store.state.users.username,
          email: this.email
        }
        axios.post('/api/chengeEmailVerify', user).then(({status, data}) => {
          if (data.code === 100) {
            this.$Message.success(data.msg)
            this.btnNotUse = true
            let timer = setInterval(() => {
              this.time -= 1
              if (this.time === 0) {
                clearInterval(timer)
                this.btnNotUse = false
                this.time = 60
              }
            }, 1000)
          } else if (data.code === 108) {
            this.$Message.error(data.msg)
          } else {
            this.$Message.error(data.msg)
          }
        })
      }
    },
    getGroupList: function () {
      axios.get('/api/grouplist', {params: {uid: this.$store.state.users.id }}).then(({status, data}) => {
        if (data.code === 100) {
          this.groups = data.group
        }
      })
    },
    getUserEamil: function () {
      axios.get('/api/getUserEamil', {params: {id: this.$store.state.users.id}}).then(({status, data}) => {
        if (data.code === 100) {
          this.nowEmail = data.data
        }
      })
    }
  },
  computed: {
    getAllPersonNumber: function () {
      let i = 0
      let AllPerosnNumber = 0
      for (i = 0; i < this.groups.length; i++) {
        AllPerosnNumber += this.groups[i].number
      }
      return AllPerosnNumber
    },
    groupsList: function () {
      let grouplist
      grouplist = this.groups.map((item)=>{
        return item.groupName
      })
      return grouplist.join(',')
    }
  },
}
</script>

<style scoped>
  @import "../assets/css/backgroud.css";
  @import "../assets/css/person.css";
</style>
