<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: { type: Array, required: true }
});

/* ======================================================
   Convertir HH:mm a minutos
====================================================== */
const toMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/* ======================================================
   Calcular horas totales por área
====================================================== */
const areaHours = computed(() => {
  const map = {};

  props.tasks.forEach((t) => {
    const minutes = toMinutes(t.endTime) - toMinutes(t.startTime);
    const hours = minutes / 60;

    // redondeo a 2 decimales
    const rounded = Number(hours.toFixed(2));

    if (!map[t.area]) map[t.area] = 0;
    map[t.area] += rounded;
  });

  return map;
});

/* ======================================================
   Series para ApexCharts
====================================================== */
const series = computed(() => [
  {
    name: "Hours Worked",
    data: Object.values(areaHours.value)
  }
]);

/* ======================================================
   Opciones para ApexCharts
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
    categories: Object.keys(areaHours.value),
    labels: { style: { fontSize: "12px" } }
  },
  yaxis: {
    title: { text: "Hours" }
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(2)} h` // redondeo a 2 decimales
    }
  },
  colors: ["#03A9F4", "#E91E63", "#FFC107", "#4CAF50", "#9C27B0", "#FF5722"],
  title: {
    text: "Total Hours by Area",
    align: "center"
  }
}));
</script>

<template>
  <div v-if="Object.keys(areaHours).length > 0">
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
