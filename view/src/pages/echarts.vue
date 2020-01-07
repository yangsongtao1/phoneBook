<template>
  <div class="echartPanel">
    <aside class="title">
      <Breadcrumb>
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline"></Icon> {{$t('home')}}
        </BreadcrumbItem>
        <BreadcrumbItem to="/charts">
          <Icon type="logo-buffer"></Icon> {{$t('chart')}}
        </BreadcrumbItem>
      </Breadcrumb>
    </aside>
    <aside class="Echars">
      <aside>
        <echart-temp chartsId="phoneChart" height="400px" width="100%" title="手机通讯录统计" :echartsData="phoneData" :colorList="phoneColorList" v-if="isShowPhoneEchart"/>
      </aside>
      <aside>
        <echart-temp chartsId="noteChart" height="400px" width="100%" title="记事本统计" :echartsData="noteData" :colorList="noteColorList" v-if="isShowNoteEchart"/>
      </aside>
    </aside>
  </div>
</template>

<script>
import axios from '../axios'
import echartTemp from '../components/echartsTemp'
export default {
  name: 'echarts',
  data () {
    return {
      isShowPhoneEchart: false,
      isShowNoteEchart: false,
      phoneColorList: [],
      noteColorList: ['#FF0000', '#6495ED', '#FFA500'],
      groups: [],
      phoneData: [],
      noteData: []
    }
  },
  created () {
    this.getPhoneData()
    this.getNoteData()
  },
  methods: {
    getPhoneData () {
      let i
      let tmp = {}
      axios.get('/api/grouplist', {params: {uid: this.$store.state.users.id }}).then(({status, data}) => {
        if (data.code === 100) {
          this.groups = data.group
          for (i = 0; i < this.groups.length; i++) {
            tmp.value = this.groups[i].number
            tmp.name = this.groups[i].groupName
            this.phoneColorList.push(this.groups[i].groupColor)
            this.phoneData.push(tmp)
            tmp = {}
          }
          this.isShowPhoneEchart = true
        }
      })
    },
    getNoteData () {
      let i
      let tmp = {}
      axios.get('/api/getNoteNumberByType').then(({status, data}) => {
        if (status === 200){
          if (data.code === 100) {
            for(i = 0; i < data.data.length; i++) {
              if (data.data[i]['类型'] === 'study') {
                tmp.value = data.data[i]['人数']
                tmp.name = '学习'
              } else if (data.data[i]['类型'] === 'work') {
                tmp.value = data.data[i]['人数']
                tmp.name = '工作'
              } else if (data.data[i]['类型'] === 'life') {
                tmp.value = data.data[i]['人数']
                tmp.name = '生活'
              }
              this.noteData.push(tmp)
              tmp = {}
            }
            this.isShowNoteEchart = true
          }
        }
      })
    }
  },
  components: {
    echartTemp
  }
}
</script>

<style scoped>
  .echartPanel{
    height: 100%;
  }
  .title {
    padding: 20px;
  }
  .Echars{
    height: calc(100% - 60px);
    overflow-y: auto;
  }
  .Echars aside{
    width: 49%;
    display: inline-block;
  }
</style>
