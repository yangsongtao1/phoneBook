<template>
    <div class="addGroupBackground">
      <div class="content">
        <aside class="title">{{$t('addgroups')}}</aside>
        <aside class="inputContent">
          <Input prefix="ios-browsers" :placeholder="$t('groupnametip')" class="addgroups" v-model="groupName"/>
          <p class="error" v-if="isErrorName">{{$t('groupnametip')}}</p>
          <div class="colorPicker">
            <ColorPicker v-model="groupColor"/>
            <p class="colorTip" :style="{'color': groupColor}">{{groupColor}}</p>
            <p class="error" v-if="isErrorColor">{{$t('choosecolor')}}</p>
          </div>
        </aside>
        <aside class="addGroupBtnGroup">
          <Button class="cancel" @click="cancelAddGroup">{{$t('cancel')}}</Button>
          <Button class="confirm" type="primary" @click="confirmGroup">{{$t('submit')}}</Button>
        </aside>
      </div>
    </div>
</template>

<script>
import axios from '../axios'
export default {
  name: "addgroup",
  data () {
    return {
      groupName: '',
      groupColor: '',
      isErrorName: false,
      isErrorColor: false
    }
  },
  watch: {
    groupName: function (val) {
      if (val !== '') {
        this.isErrorName = false
      } else {
        this.isErrorName = true
      }
    },
    groupColor: function (val) {
      console.log(val)
    }
  },
  methods: {
    cancelAddGroup () {
      this.$emit('cancelAddGroup')
    },
    confirmGroup () {
      if (this.groupName === '') {
        this.isErrorName = true
      } else {
        this.isErrorName = false
        if (this.groupColor === '') {
          this.isErrorColor = true
        } else {
          this.isErrorColor = false
          let groupInfo = {
            groupName: this.groupName,
            groupColor: this.groupColor,
            uid: this.$store.state.users.id
          }
          axios.post('/api/addGroup', groupInfo).then(({data}) => {
            console.log(data)
            if (data.code === 100) {
              this.$emit('confirmAddGroup')
            } else if (data.code === 113) {
              this.$Message.error(this.$t('repeatedGroup'))
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .addGroupBackground{
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }
  .addGroupBackground .content{
    position: absolute;
    background: #fff;
    width: 400px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .addGroupBackground .content .title{
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #000;
    text-align: center;
  }
  .addGroupBackground .content .inputContent{
    position: relative;
    width: 80%;
    padding-bottom: 30px;
    margin: 0 auto;
  }
  .addGroupBackground .content .inputContent .colorPicker{
    position: relative;
    text-align: left;
    margin-top: 30px;
  }
  .addGroupBackground .content .inputContent .colorPicker .colorTip{
    position: absolute;
    top: 8px;
    left: 70px;
  }
  .addGroupBackground .content .error{
    position: absolute;
    font-size: 10px;
    color: red;
    top: 36px;
    left: 0;
  }
</style>
