<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: { type: Array, required: true }
});

/* ======================================================
   Contar tareas con issue y sin issue
====================================================== */
const issueStats = computed(() => {
  const total = props.tasks.length;
  const withIssue = props.tasks.filter(t => t.hasIncident).length;
  const withoutIssue = total - withIssue;

  // calcular porcentaje con redondeo
  const percent = total === 0 ? 0 : Number(((withIssue / total) * 100).toFixed(2));

  return {
    total,
    withIssue,
    withoutIssue,
    percent
  };
});

/* ======================================================
   Series para el gráfico donut
====================================================== */
const series = computed(() => [
  issueStats.value.withIssue,
  issueStats.value.withoutIssue
]);

/* ======================================================
   Opciones para ApexCharts
====================================================== */
const chartOptions = computed(() => ({
  chart: {
    type: "donut",
    height: 350
  },
  labels: ["With Issues", "Without Issues"],
  colors: ["#E91E63", "#4CAF50"],
  title: {
    text: `Issue Rate: ${issueStats.value.percent}%`,
    align: "center"
  },
  legend: {
    position: "bottom"
  },
  dataLabels: {
    formatter: (val) => `${val.toFixed(2)}%`  // redondeo en etiquetas
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(2)} tasks`  // redondeo en tooltip
    }
  }
}));
</script>

<template>
  <div v-if="issueStats.total > 0">
    <apexchart
      type="donut"
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
