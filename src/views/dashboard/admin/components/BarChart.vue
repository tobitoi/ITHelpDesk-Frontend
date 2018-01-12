<template>
      <div :class="className" :style="{height:height,width:width}"></div>


</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'
  const animationDuration = 6000
  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null,
      }
    },
    mounted() {
      this.getRestData();
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      getRestData(){
          this.api({
          url: "/tools/listToolsChart",
          method: "get"
        }).then(result => {
         this.initChart(result);
         this.list = result.list;
         this.totalCount = result.totalCount;
        });
      },
      initChart(restData) {
        let list=restData.list;
        let hostName=[];
        let status=[];
        let total=[];

        for(let i=0;i<list.length;i++){
          hostName[i]=list[i].host_name;
          status[i]=list[i].status;
          total[i] = list[i].total;
        }

        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: status,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{

            name: 'Tools Total',
            type: 'bar',
            barWidth: '60%',
            data: total,
            animationDuration,
            itemStyle: {
            normal: {
                color: function(params) {
                // build a color map as your need.
                    var colorList = [
                      '#f24343','#A2CBF1','#ccf6b6','#E87C25','#27727B',
                      '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                      '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                    ];
                return colorList[params.dataIndex]
               }
             }
           }
          }]
        })
      }
    }
  }
</script>
