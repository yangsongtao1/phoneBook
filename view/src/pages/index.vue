<template>
  <div class="container">
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
      <Row type="flex">
        <i-col :span="spanLeft" class="layout-menu-left">
          <Menu theme="dark" width="auto" :active-name="routerName" @on-select="changeurl">
            <div class="layout-logo-left">
              <i class="iconfont icon-phoneBook headerIcon"></i>
              <span  v-if="!notShowTitle">{{$t('webName')}}</span>
            </div>
            <Menu-item name="list" :class="notShowTitle ? 'centerIcon' : ''">
              <i class="iconfont icon-list" :class="notShowTitle ? 'onlyIcon':''"></i>
              <span class="layout-text">{{$t('phoneBook')}}</span>
            </Menu-item>
            <Menu-item name="charts" :class="notShowTitle ? 'centerIcon' : ''" >
              <i class="iconfont icon-charts" :class="notShowTitle ? 'onlyIcon':''"></i>
              <span class="layout-text">{{ $t('chart') }}</span>
            </Menu-item>
          </Menu>
        </i-col>
        <i-col :span="spanRight">
          <div class="layout-header ivu-menu-dark">
            <i-button type="text" @click="toggleClick" class="shrinkButton">
              <i class="iconfont icon-shrink headerIcon"></i>
            </i-button>
            <aside class="useInfo">
              <p class="changeLan">{{btnName}}</p>
              <p class="userName">{{$t('welcome')}}{{this.$store.state.users.username}}</p>
              <Dropdown @on-click="HandlerMenuClick">
                <a href="javascript:void(0)" class="personSet">
                  {{$t('setting')}}
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="person">{{$t('personalcenter')}}</DropdownItem>
                  <DropdownItem name="changePW">{{$t('changePw')}}</DropdownItem>
                  <Dropdown placement="right-start">
                    <DropdownItem>
                      {{$t('setlanguage')}}
                      <Icon type="ios-arrow-forward"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                      <DropdownItem name="en">{{$t('english')}}</DropdownItem>
                      <DropdownItem name="zh">{{$t('chinese')}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <DropdownItem name="logout">{{$t('logout')}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </aside>
          </div>
          <div class="layout-content">
            <router-view v-if="reload"/>
          </div>
          <div class="layout-copy">
            2011-2016 &copy; TaoTaoPhoneBook
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      spanLeft: 5,
      spanRight: 19,
      notShowTitle: false,
      name: '',
      reload: true,
      routerName: '',
      screenWidth: document.body.clientWidth,
      btnName: 'ZH'
    }
  },
  computed: {
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24;
    }
  },
  mounted () {
    this.getLanguage()
    this.routerName = this.$route.path.split('/')[1]
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  watch: {
    screenWidth (val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        let that = this
        setTimeout(function () {
          that.timer = false
          if (that.screenWidth < 780) {
            that.closeNav()
          } else {
            that.showNav()
          }
        }, 400)
      }
    }
  },
  methods: {
    HandlerMenuClick (name) {
      if (name === 'en') {
        localStorage.setItem('locale', 'en')
        this.$router.go()
      } else if (name === 'zh') {
        localStorage.setItem('locale', 'zh')
        this.$router.go()
      } else if (name === 'person') {
        this.$router.push('/person')
      } else if (name === 'changePW') {
        this.$router.push('/changePw')
      } else if (name === 'logout') {
        this.$store.dispatch('tokenAddFun', '')
        this.$router.push('/login')
      }
    },
    toggleClick () {
      if (this.spanLeft === 5) {
        this.spanLeft = 2;
        this.spanRight = 22;
        this.notShowTitle = true
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
        this.notShowTitle = false
      }
    },
    closeNav () {
      this.spanLeft = 2;
      this.spanRight = 22;
      this.notShowTitle = true
    },
    showNav () {
      this.spanLeft = 5;
      this.spanRight = 19;
      this.notShowTitle = false
    },
    changeurl (val) {
      if (this.$route.path.indexOf(val) < 0) {
        this.$router.push('/' + val)
      } else {
        this.reload = false
        setTimeout(() => {
          this.reload = true
        },1)
      }
    },
    getLanguage () {
      let locale = localStorage.getItem('locale')
      if (locale) {
        if (locale === 'zh') {
          this.btnName = 'ZH'
        } else {
          this.btnName = 'EN'
        }
      } else {
        localStorage.setItem('locale', 'zh')
      }
    }
  }
}
</script>

<style scope>
  @import "../assets/css/index.css";
</style>
