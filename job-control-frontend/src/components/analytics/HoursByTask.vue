<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: { type: Array, required: true }
});

/* ======================================================
   Convert HH:mm time to minutes
====================================================== */
const toMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/* ======================================================
   Calculate worked hours per task
====================================================== */
const taskHours = computed(() => {
  const map = {};

  props.tasks.forEach((t) => {
    const minutes = toMinutes(t.endTime) - toMinutes(t.startTime);
    const hours = minutes / 60;

    // redondeo a 2 decimales
    const rounded = Number(hours.toFixed(2));

    if (!map[t.task]) map[t.task] = 0;
    map[t.task] += rounded;
  });

  return map;
});

/* ======================================================
   ApexCharts series
====================================================== */
const series = computed(() => [
  {
    name: "Hours Worked",
    data: Object.values(taskHours.value),
  }
]);

/* ======================================================
   ApexCharts options
====================================================== */
const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      horizontal: false,
    }
  },
  xaxis: {
    categories: Object.keys(taskHours.value),
    labels: { style: { fontSize: "12px" } }
  },
  yaxis: {
    title: { text: "Hours" }
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(2)} h`   // redondeo en tooltip
    }
  },
  colors: ["#4CAF50", "#FFC107", "#03A9F4", "#E91E63", "#9C27B0"],
  title: {
    text: "Total Hours by Task",
    align: "center"
  }
}));
</script>

<template>
  <div v-if="Object.keys(taskHours).length > 0">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>

  <p v-else class="no-data-chart">
    No data available for this chart.
  </p>
</template>

<style scoped>
.no-data-chart {
  text-align: center;
  color: #777;
  padding: 20px 0;
}
</style>
