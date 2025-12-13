<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: { type: Array, required: true }
});

/* ==========================================================
   Agrupar tareas por nombre y contar incidencias
========================================================== */
const issueCounts = computed(() => {
  const map = {};

  props.tasks.forEach(t => {
    if (!t.hasIncident) return;  // solo tareas con incidencia

    if (!map[t.task]) {
      map[t.task] = 0;
    }
    map[t.task] += 1;
  });

  return map;
});

/* ==========================================================
   Preparar datos ordenados para el gráfico
========================================================== */
const sortedData = computed(() => {
  const entries = Object.entries(issueCounts.value);

  // ordenar de mayor a menor
  entries.sort((a, b) => b[1] - a[1]);

  return {
    labels: entries.map(e => e[0]),
    values: entries.map(e => e[1])
  };
});

/* ==========================================================
   Series para ApexCharts
========================================================== */
const series = computed(() => [
  {
    name: "Incidences",
    data: sortedData.value.values
  }
]);

/* ==========================================================
   Opciones del gráfico (horizontal bar)
========================================================== */
const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6
    }
  },
  xaxis: {
    categories: sortedData.value.labels,
    title: {
      text: "Incidences"
    }
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(2)} issues`  // redondeo a 2 decimales
    }
  },
  colors: ["#FF7043"],
  title: {
    text: "Top Tasks with Issues",
    align: "center"
  }
}));
</script>

<template>
  <div v-if="sortedData.labels.length > 0">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>

  <p v-else class="no-data-chart">
    No tasks with issues in this period.
  </p>
</template>

<style scoped>
.no-data-chart {
  text-align: center;
  color: #777;
  padding: 20px 0;
}
</style>
