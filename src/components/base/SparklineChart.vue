<template>
  <div class="chart-wrapper">
    <Chart class="sparkline" type="line" :data="chartData" :options="chartOptions" ref="chartRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import Chart from 'primevue/chart'
import { useTheme } from '@/utils/useTheme'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const { theme } = useTheme()
const chartRef = ref(null)
const chartData = ref()
const chartOptions = ref()

// Computed properties to get theme colors dynamically
const primaryColor = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--p-primary-color').trim()
})

const backgroundColor = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--p-background-lvl3').trim()
})

const borderColor = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--p-border-lvl2').trim()
})

const textColor = computed(() => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--p-text-secondary-color')
    .trim()
})

const borderRadius = computed(() => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--p-tooltip-border-radius')
    .trim()
})

// Function to update chart data and options
const updateChart = () => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()

  // Update the chart if it exists
  if (chartRef.value?.chart) {
    chartRef.value.chart.data = chartData.value
    chartRef.value.chart.options = chartOptions.value
    chartRef.value.chart.update()

    // Re-setup custom tooltip with new colors
    setupCustomTooltip()
  }
}

// Watch for theme changes
watch(theme, () => {
  // Use nextTick to ensure DOM is updated with new CSS variables
  nextTick(() => {
    updateChart()
  })
})

onMounted(async () => {
  updateChart()

  // Wait for chart to be fully rendered before setting up tooltip
  await nextTick()
  setTimeout(() => {
    if (chartRef.value?.chart) setupCustomTooltip()
  }, 300)
})

// Function to create a custom tooltip
const setupCustomTooltip = () => {
  const chart = chartRef.value.chart

  // Override the tooltip generation
  chart.options.plugins.tooltip.external = function (context) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip')

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'
      tooltipEl.innerHTML = '<div></div>'
      document.body.appendChild(tooltipEl)
    }

    // Hide if no tooltip
    const tooltipModel = context.tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = '0'
      return
    }

    // Set Text
    if (tooltipModel.body) {
      const bodyLines = tooltipModel.body.map((b) => b.lines)
      let innerHtml = '<div class="custom-tooltip">'

      bodyLines.forEach((body) => {
        // Split the label and value
        const parts = body[0].split('  ')
        if (parts.length === 2) {
          innerHtml += `
            <div class="tooltip-content">
              <span class="tooltip-label">${parts[0]}</span>
              <span class="tooltip-value">${parts[1]}</span>
            </div>
          `
        } else {
          innerHtml += `<div class="tooltip-content">${body}</div>`
        }
      })

      innerHtml += '</div>'
      tooltipEl.querySelector('div').innerHTML = innerHtml
    }

    // Position tooltip and make it visible
    const position = context.chart.canvas.getBoundingClientRect()

    // Apply all styles at once for better performance
    Object.assign(tooltipEl.style, {
      opacity: '1',
      position: 'absolute',
      left: position.left + tooltipModel.caretX + 'px',
      top: position.top + tooltipModel.caretY + 'px',
      pointerEvents: 'none',
      transform: 'translate(-50%, -150%)',
      backgroundColor: backgroundColor.value,
      color: textColor.value,
      borderRadius: borderRadius.value,
      padding: '0.25rem 0.5rem',
      border: `1px solid ${borderColor.value}`,
      fontSize: '0.75rem',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
      zIndex: '2',
    })

    // Apply styles to tooltip elements
    const tooltipValue = tooltipEl.querySelector('.tooltip-value')
    const tooltipContent = tooltipEl.querySelector('.tooltip-content')

    if (tooltipContent) {
      Object.assign(tooltipContent.style, {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.5rem',
        rowGap: '0.125rem' /* Vertical gap when items wrap */,
        columnGap: '0.5rem' /* Horizontal gap between items */,
      })
    }

    if (tooltipValue) {
      tooltipValue.style.color = primaryColor.value
      tooltipValue.style.fontWeight = 'bold'
    }
  }

  // Configure tooltip
  chart.options.plugins.tooltip.enabled = false
  chart.update()
}

const setChartData = () => ({
  labels: props.data.labels,
  datasets: [
    {
      data: props.data.values,
      borderColor: [primaryColor.value],
      borderWidth: 1,
      fill: true,
      backgroundColor: [primaryColor.value + '1A'],
    },
  ],
})

const setChartOptions = () => ({
  interaction: {
    intersect: false,
    mode: 'nearest',
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true, // Will be disabled in setupCustomTooltip
      mode: 'nearest',
      intersect: false,
      callbacks: {
        label: function (context) {
          return context.label + '  ' + context.formattedValue + ' ' + (props.data.unit || '')
        },
      },
    },
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
      hoverBorderWidth: 2,
      hoverBackgroundColor: backgroundColor.value,
    },
  },
  responsive: true,
  clip: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      suggestedMin: Math.min(...props.data.values) * 0.9,
      suggestedMax: Math.max(...props.data.values) * 1.1,
      beginAtZero: true,
      grace: '10%',
    },
  },
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sparkline {
  overflow: hidden;
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  max-height: 100%;
}

:deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
