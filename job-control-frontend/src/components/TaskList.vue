<template>
  <div class="task-list-container">

    <h3>Recorded tasks</h3>

    <!-- Si no hay tareas -->
    <p v-if="tasks.length === 0" class="no-tasks">No tasks registered yet.</p>

    <!-- Listado -->
    <div
      v-for="task in tasks"
      :key="task._id"
      class="task-card"
    >
      <!-- Fecha + Shift -->
      <div class="task-header">
        <span class="task-date">
          {{ formatDate(task.date) }} — 
          <span class="shift">Shift {{ task.shiftNumber }}</span>
        </span>

        <!-- Botón borrar -->
        <button class="delete-btn" @click="deleteTask(task._id)">
          🗑
        </button>
      </div>

      <!-- Tarea + Horas -->
      <div class="task-body">
        <div class="flex-between">
          <span class="task-name">{{ task.task }}</span>

          <!-- Badge área -->
          <span class="area-badge" :class="task.area">
            {{ task.area }}
          </span>
        </div>

        <div class="hours">
          {{ task.startTime }} → {{ task.endTime }}
        </div>

        <!-- Issue -->
        <div v-if="task.hasIncident" class="issue-block">
          ⚠ Issue: {{ task.incidentDescription || "No details provided" }}
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import api from "@/services/api";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleted"]);

/* Fecha bonita */
const formatDate = (dateString) => {
  return new Date(dateString).toISOString().slice(0, 10);
};

/* Eliminar tarea */
const deleteTask = async (id) => {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await api.delete(`/shifts/${id}`);
    emit("deleted");
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};
</script>

<style scoped>
.task-list-container {
  margin-top: 25px;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.no-tasks {
  color: #777;
  text-align: center;
  padding: 10px 0;
}

.task-card {
  background: #fafafa;
  border: 1px solid #ececec;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-date {
  font-weight: 600;
}

.shift {
  color: #4caf50;
  font-weight: bold;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d9534f;
  font-size: 20px;
}

.task-body {
  margin-top: 10px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-size: 1rem;
  font-weight: 600;
}

.hours {
  margin-top: 4px;
  font-size: 0.95rem;
  color: #444;
}

/* Área badges */
.area-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

/* colores por área */
.INBOUND { background: #3498db; }
.RSP { background: #e74c3c; }
.OUTBOUND { background: #f39c12; }
.SHIPPING { background: #2ecc71; }
.ICQA { background: #9b59b6; }
.INDIRECT { background: #7f8c8d; }

.issue-block {
  margin-top: 8px;
  background: #ffecec;
  border-left: 4px solid #e74c3c;
  padding: 6px 10px;
  font-size: 0.9rem;
  color: #b30000;
}
</style>
