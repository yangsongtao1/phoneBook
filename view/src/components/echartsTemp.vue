<template>
  <div :id="chartsId" :style="{width: width, height: height}" ref="echartsTemp"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'echartsTemp',
  data () {
    return {
      charts: null
    }
  },
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    chartsId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    echartsData: {
      type: Array,
      required: true
    },
    colorList: {
      type: Array,
      required: true
    }
  },
  created() {
    this.$nextTick(()=> {
      this.initChart()
    })
  },
  watch: {
    echartsData: {
      handler (oldValue, newValue) {
        console.log(this.echartsData)
        this.charts.resize();
      },
      deep: true
    }
  },
  mounted () {
    let _this = this;
    console.log('asfaf')
    window.addEventListener("resize", function() {
      _this.charts.resize();
    });
  },
  methods: {
    initChart() {
      this.charts = echarts.init(this.$refs.echartsTemp);
      // 把配置和数据放这里
      let _this = this
      this.charts.setOption({
        title : {
          text: _this.title,
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series : [
          {
            name: _this.title,
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: _this.echartsData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal:{
                color:function(params) {
                  //自定义颜色
                  var colorList = _this.colorList
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
