<template>
  <div id="containers"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';

export default {
  name: 'EarthVisualization',
  mounted() {
    // 获取元素
    let dom = document.getElementById("containers");
    // 初始化echarts
    let myChart = echarts.init(dom);
    // 地球数据显示
    let ds = [{
        name: '网络安全法',
        point: [116.46, 39.92, 0],
        itemStyleColor: '#f00',
        labelText: '网络安全法•3000'
    }, {
        name: '预防网络侵害',
        point: [78.96288, 20.593684, 0],
        itemStyleColor: '#99CC66',
        labelText: '预防网络侵害•500'
    }, {
        name: '爬虫详解',
        point: [12.56738, 41.87194, 0],
        itemStyleColor: '#9999FF',
        labelText: '爬虫详解•200'
    }, {
        name: '网络攻防',
        point: [174.885971, -40.900557, 0],
        itemStyleColor: '#339966',
        labelText: '网络攻防•10'
    }, {
        name: 'sql注入',
        point: [-3.435973, 55.378051, 0],
        itemStyleColor: '#993366',
        labelText: 'sql注入•1000'
    }];

    // 点配置信息
    let series = ds.map(item => ({
      name: item.name,
      type: 'scatter3D',
      coordinateSystem: 'globe',
      blendMode: 'lighter',
      symbolSize: 16,
      itemStyle: {
        color: item.itemStyleColor,
        opacity: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)'
      },
      label: {
        show: true,
        position: 'left',
        formatter: item.labelText,
        textStyle: {
          color: '#fff',
          borderWidth: 0,
          borderColor: '#fff',
          fontFamily: 'sans-serif',
          fontSize: 18,
          fontWeight: 700
        }
      },
      data: [item.point]
    }));

    // 添加上面的配置项到地球上
    myChart.setOption({
      legend: {
        selectedMode: 'multiple',
        x: 'right',
        y: 'bottom',
        data: ds.map(item => item.name),
        padding: [0, 550, 140, 0],
        orient: 'vertical',
        textStyle: {
          color: '#fff'
        }
      },
      backgroundColor: '#058198',
      globe: {
        baseTexture: require('@/assets/img/qq.jpg'),
        shading: 'color',
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 3,
          autoRotateAfterStill: 2,
          rotateSensitivity: 2,
          targetCoord: [116.46, 39.92],
          maxDistance: 200,
          minDistance: 200
        }
      },
      series: series
    });
  }
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
}

#containers {
       width: 100%;
       height: 100vh; /* 或者设置为一个固定的高度，比如 500px */
   }
</style>