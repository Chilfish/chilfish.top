<script setup lang="ts">
import type { ComposeOption } from 'echarts/core'
import type { HeatmapSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from 'echarts/components'

import {
  CalendarComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { HeatmapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

const props = defineProps<{
  data: HeatmapData[]
}>()

use([
  TooltipComponent,
  TitleComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer,
  CalendarComponent,
])

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | GridComponentOption
  | VisualMapComponentOption
  | HeatmapSeriesOption
>

interface HeatmapData {
  date: Date
  title: string
  url: string
  words: string
}

const initOptions = {
}

const style = computed(() => {
  return isDark.value
    ? {
        text: '#fff',
        background: '#0d1117',
      }
    : {
        text: '#000',
        background: '#f1f1f1',
      }
})

function range() {
  const windowWidth = window.innerWidth
  if (windowWidth >= 600)
    return todayToLastMonth(12)
  else if (windowWidth >= 400)
    return todayToLastMonth(6)
  else
    return todayToLastMonth(3)
}

const option = computed<EChartsOption>(() => ({
  tooltip: {
    formatter(params: any) {
      const value = params.value as [Date, number]
      const post = props.data.find(item => item.date === value[0])
      if (!post)
        return '无数据'

      const date = formatDate(value[0])
      return `${date} <br/> ${post.title} | ${post.words} 千字`
    },
  },
  visualMap: {
    min: 0,
    max: 10,
    type: 'piecewise',
    orient: 'horizontal',
    left: 'center',
    top: 32,
    splitNumber: 4,
    showLabel: true,
    itemGap: 20,
    text: ['千字', ''],
    textStyle: {
      color: style.value.text,
    },
    inRange: {
      color: ['#3388bb4c', '#3388bb'],
    },
  },
  calendar: {
    range: range().map(formatDate),
    top: 90,
    left: 20,
    right: 10,
    cellSize: 14,
    itemStyle: {
      color: style.value.background,
      borderWidth: 1.5,
      borderColor: isDark.value ? '#181818' : '#e9ecef',
      borderCap: 'round',
    },
    yearLabel: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.0)',
      },
    },
    monthLabel: {
      nameMap: 'ZH',
      fontSize: 10,
      color: style.value.text,
    },
    dayLabel: {
      nameMap: 'ZH',
      fontSize: 10,
      color: style.value.text,
    },
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: props.data.map(item => ([
      item.date,
      item.words,
    ])),
  },
}))

function onClick(e: any) {
  const value = e.value as [Date, number]
  const post = props.data.find(item => item.date === value[0])
  if (post)
    window.open(post.url)
}
</script>

<template>
  <div class="w-full center">
    <VChart
      class="chart center"
      :option="option"
      :init-options="initOptions"
      @click="onClick"
    />
  </div>
</template>

<style>
.chart {
  width: 800px;
  height: 220px;
  overflow-x: auto;
  max-width: 92vw;
}
</style>
