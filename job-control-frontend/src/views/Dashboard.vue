<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

import TaskForm from "@/components/TaskForm.vue";
import TaskList from "@/components/TaskList.vue";

import HoursByTask from "@/components/analytics/HoursByTask.vue";
import HoursByArea from "@/components/analytics/HoursByArea.vue";
import IssueRate from "@/components/analytics/IssueRate.vue";
import TopIssues from "@/components/analytics/TopIssues.vue";

/* ========================================================================
   GLOBAL DATA LOAD (shifts from the database)
========================================================================= */

const shifts = ref([]);              // todos los turnos cargados desde la BD
const today = new Date();
const todayISO = today.toISOString().slice(0, 10);

const fetchShifts = async () => {
  try {
    const res = await api.get("/shifts");
    shifts.value = res.data;
    applyTaskFilter();     // actualizar lista
    applyAnalyticsFilter(); // actualizar gráficos
  } catch (err) {
    console.error("Error loading shifts:", err);
  }
};

/* ========================================================================
   RECORDED TASKS FILTER (operational filter)
========================================================================= */

const filterDate = ref(todayISO);
const filteredTasks = ref([]);
const noDataTasks = ref("");

/* Filtrar solo las tareas para la lista */
const applyTaskFilter = () => {
  const selected = filterDate.value;
  const result = shifts.value.filter(s => {
    const d = new Date(s.date).toISOString().slice(0, 10);
    return d === selected;
  });

  filteredTasks.value = result;

  if (result.length === 0) {
    noDataTasks.value =
      selected === todayISO
        ? "No data available for today"
        : "No data available for this date";
  } else {
    noDataTasks.value = "";
  }
};

/* Rangos del filtro de la lista */
const filterTasksWeek = () => {
  const d = new Date();
  d.setDate(today.getDate() - 7);

  const result = shifts.value.filter(s => new Date(s.date) >= d);
  filteredTasks.value = result;
  noDataTasks.value = result.length ? "" : "No data available this week";
};

const filterTasksMonth = () => {
  const d = new Date();
  d.setMonth(today.getMonth() - 1);

  const result = shifts.value.filter(s => new Date(s.date) >= d);
  filteredTasks.value = result;
  noDataTasks.value = result.length ? "" : "No data available this month";
};

const filterTasksYear = () => {
  const d = new Date();
  d.setFullYear(today.getFullYear() - 1);

  const result = shifts.value.filter(s => new Date(s.date) >= d);
  filteredTasks.value = result;
  noDataTasks.value = result.length ? "" : "No data available this year";
};

const filterTasksAll = () => {
  filteredTasks.value = [...shifts.value];
  noDataTasks.value = filteredTasks.value.length ? "" : "No tasks available";
};

/* ========================================================================
   ANALYTICS FILTER (independent)
========================================================================= */

const analyticsRange = ref("day");  
const analyticsData = ref([]);

const applyAnalyticsFilter = () => {
  const now = new Date();
  const range = analyticsRange.value;

  let result = [];

  if (range === "day") {
    const todayStr = now.toISOString().slice(0, 10);
    result = shifts.value.filter(s => {
      return new Date(s.date).toISOString().slice(0, 10) === todayStr;
    });
  }

  if (range === "week") {
    const d = new Date();
    d.setDate(now.getDate() - 7);
    result = shifts.value.filter(s => new Date(s.date) >= d);
  }

  if (range === "month") {
    const d = new Date();
    d.setMonth(now.getMonth() - 1);
    result = shifts.value.filter(s => new Date(s.date) >= d);
  }

  if (range === "year") {
    const d = new Date();
    d.setFullYear(now.getFullYear() - 1);
    result = shifts.value.filter(s => new Date(s.date) >= d);
  }

  if (range === "all") {
    result = [...shifts.value];
  }

  analyticsData.value = result;
};

/* Cambiar rango analítico */
const setAnalyticsRange = (range) => {
  analyticsRange.value = range;
  applyAnalyticsFilter();

  if (!activeTab.value) {
    activeTab.value = "hoursByTask";
  }
};

/* ========================================================================
   ANALYTICS TABS
========================================================================= */

const activeTab = ref("hoursByTask");

const analyticsTitle = computed(() => {
  switch (activeTab.value) {
    case "hoursByTask":
      return "Total Hours by Task";
    case "hoursByArea":
      return "Total Hours by Area";
    case "issueRate":
      return "Issue Rate";
    case "topIssues":
      return "Top Tasks with Issues";
    default:
      return "";
  }
});


/* =========================================================================
   INITIAL LOAD
========================================================================== */

onMounted(async () => {
  await fetchShifts();
});
</script>

<template>
  <div class="dashboard-container">

    <h1>Job-Control</h1>

    <!-- ================================================================= -->
    <!-- RECORDED TASKS SECTION                                           -->
    <!-- ================================================================= -->

    <TaskForm @task-saved="fetchShifts" />

    <div class="filter-box">
      <h3>Recorded Tasks</h3>

      <label>Filter by date:</label>

      <div class="filter-row">
        <input type="date" v-model="filterDate" />
        <button @click="applyTaskFilter">Filter</button>
      </div>

      <div class="range-buttons">
        <button @click="filterTasksWeek">Week</button>
        <button @click="filterTasksMonth">Month</button>
        <button @click="filterTasksYear">Year</button>
        <button @click="filterTasksAll">All</button>
      </div>
    </div>

    <p v-if="noDataTasks" class="no-data">
      {{ noDataTasks }}
    </p>

    <TaskList :tasks="filteredTasks" @deleted="fetchShifts" />


    <!-- ================================================================= -->
    <!-- ANALYTICS DASHBOARD SECTION                                      -->
    <!-- ================================================================= -->

    <div class="analytics">
      <h2>Analytics Dashboard</h2>

      <div class="tabs">
        <button @click="activeTab='hoursByTask'" :class="{active: activeTab==='hoursByTask'}">Hours by Task</button>
        <button @click="activeTab='hoursByArea'" :class="{active: activeTab==='hoursByArea'}">Hours by Area</button>
        <button @click="activeTab='issueRate'" :class="{active: activeTab==='issueRate'}">Issue Rate</button>
        <button @click="activeTab='topIssues'" :class="{active: activeTab==='topIssues'}">Top Tasks with Issues</button>
      </div>

            <div class="analytics-range-buttons">
        <button :class="{active: analyticsRange==='day'}" @click="setAnalyticsRange('day')">Day</button>
        <button :class="{active: analyticsRange==='week'}" @click="setAnalyticsRange('week')">Week</button>
        <button :class="{active: analyticsRange==='month'}" @click="setAnalyticsRange('month')">Month</button>
        <button :class="{active: analyticsRange==='year'}" @click="setAnalyticsRange('year')">Year</button>
        <button :class="{active: analyticsRange==='all'}" @click="setAnalyticsRange('all')">All</button>
      </div>

      <div class="chart-section">
        <HoursByTask v-if="activeTab==='hoursByTask'" :tasks="analyticsData" />
        <HoursByArea v-if="activeTab==='hoursByArea'" :tasks="analyticsData" />
        <IssueRate v-if="activeTab==='issueRate'" :tasks="analyticsData" />
        <TopIssues v-if="activeTab==='topIssues'" :tasks="analyticsData" />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===========================
   STRUCTURE
=========================== */

.dashboard-container {
  max-width: 1200px;
  margin: auto;
  padding: 44px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ===========================
   HEADINGS
=========================== */

h1 {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1e293b;
}

h3 {
  font-size: 1.3rem;
  font-weight: 500;
  color: #334155;
}

/* ===========================
   CARD (Material Style)
=========================== */

.filter-box,
.analytics,
.task-card {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
}

/* ===========================
   INPUTS
=========================== */

input[type="date"],
input[type="text"],
select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 0.95rem;
  width: 100%;
  transition: all 0.2s ease;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}

/* ===========================
   BUTTONS
=========================== */

button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

button:hover {
  background: #2563eb;
}

button:active {
  background: #1d4ed8;
}

/* Buttons inside analytics range selector */
.analytics-range-buttons button,
.range-buttons button {
  background: #e2e8f0;
  color: #334155;
  margin-right: 8px;
  transition: all 0.15s;
}

.analytics-range-buttons button:hover,
.range-buttons button:hover {
  background: #cbd5e1;
}

.analytics-range-buttons button.active {
  background: #10b981;
  color: white;
}

/* ===========================
   FLEX STRUCTURES
=========================== */

.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.range-buttons,
.analytics-range-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

/* ===========================
   TABS FOR ANALYTICS
=========================== */

.tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.tabs button {
  background: #4c6286;
  border-radius: 8px;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
}

/* ===========================
   “NO DATA” Message
=========================== */

.no-data {
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  padding-top: 12px;
}

/* ===========================
   CHART AREA
=========================== */

.chart-section {
  margin-top: 25px;
}
</style>
