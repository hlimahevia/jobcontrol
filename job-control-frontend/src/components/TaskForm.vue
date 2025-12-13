<script setup>
import { ref, computed } from "vue";
import api from "@/services/api";

const emit = defineEmits(["task-saved"]);

const date = ref(new Date().toISOString().slice(0, 10));
const shiftNumber = ref("");
const area = ref("");
const task = ref("");
const startTime = ref("");
const endTime = ref("");
const hasIncident = ref(false);
const incidentDescription = ref("");

const loading = ref(false);
const error = ref("");
const success = ref(false);

/* ============================
   LISTA DE TAREAS POR ÁREA
============================ */
const taskOptions = {
  INBOUND: [
    "Line load Injection",
    "LP-Receive(corral)",
    "IB Tote Replen",
    "Receive Line Loader",
    "Decant Non-TI",
    "Transfer in Support",
    "Each-Receive",
    "IB Problem Solve",
    "Transferin Transport",
    "Receive Doc Crew",
    "Inbound Dock Clerk",
    "Item Prepped",
    "Prep Overbox",
    "Prep Sickering",
    "Prep Shrinkwarp",
    "Prep Other",
  ],

  RSP: [
    "Stow",
    "Stow pallet",
    "Pick",
    "Pick pallet",
    "Cart Builder",
    "Cart runner",
    "Empty totes",
    "Amnesty responder",
  ],

  OUTBOUND: [
    "Single no Slam",
    "M's",
    "Single Medium",
    "Bolsas",
    "AFE-Pack",
    "AFE-Induct",
    "AFE-Rebin",
    "Collector P.S AFE",
    "Zona KO P.S AFE",
    "P.S Mesa",
    "Slam Operator",
    "Volta",
    "SmartPack",
    "Pack to Rebin",
    "Pick to Rebin",
  ],

  SHIPPING: [
    "Auditor",
    "Cargas Perrito",
    "Flat Sorter",
    "Garitas",
    "Indoor Marshall",
    "Induction",
    "Outdoor Marshall",
    "Problem Solve",
    "Procurement",
    "Shipping Clerk",
    "Shipping Sorter",
    "Totes Negros",
    "Transhipment",
    "JP Carts",
  ],

  ICQA: ["ICQA"],

  INDIRECT: [
    "Single Medium",
    "Cart runner",
    "Apiladores",
    "Water Spider",
    "Indirect",
    "Other I",
  ],
};

/* Lista dinámica según área seleccionada */
const availableTasks = computed(() => {
  return taskOptions[area.value] || [];
});

/* Reset form */
const resetForm = () => {
  shiftNumber.value = "";
  area.value = "";
  task.value = "";
  startTime.value = "";
  endTime.value = "";
  hasIncident.value = false;
  incidentDescription.value = "";
};

const submitTask = async () => {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await api.post("/shifts", {
      date: date.value,
      shiftNumber: Number(shiftNumber.value),
      area: area.value,
      task: task.value,
      startTime: startTime.value,
      endTime: endTime.value,
      hasIncident: hasIncident.value,
      incidentDescription: incidentDescription.value || "",
    });

    success.value = true;
    emit("task-saved");
    resetForm();
  } catch (err) {
    error.value = err.response?.data?.message || "Error saving task.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="task-form-container">
    <h3>Register Task</h3>

    <form @submit.prevent="submitTask">
      <!-- Date -->
      <label>Date</label>
      <input type="date" v-model="date" required />

      <!-- Shift -->
      <label>Shift</label>
      <select v-model="shiftNumber" required>
        <option disabled value="">Select shift</option>
        <option value="1">Shift 1</option>
        <option value="2">Shift 2</option>
      </select>

      <!-- Area -->
      <label>Area</label>
      <select v-model="area" required>
        <option disabled value="">Select area</option>
        <option>INBOUND</option>
        <option>RSP</option>
        <option>OUTBOUND</option>
        <option>SHIPPING</option>
        <option>ICQA</option>
        <option>INDIRECT</option>
      </select>

      <!-- Task -->
      <label>Task</label>
      <select v-model="task" required>
        <option disabled value="">Select task</option>

        <option v-for="t in availableTasks" :key="t">
          {{ t }}
        </option>
      </select>

      <!-- Start Time -->
      <label>Start Time</label>
      <input type="time" v-model="startTime" required />

      <!-- End Time -->
      <label>End Time</label>
      <input type="time" v-model="endTime" required />

      <!-- Issue toggle -->
      <label class="checkbox-row">
        <input type="checkbox" v-model="hasIncident" />
        Has Issue
      </label>

      <input
        v-if="hasIncident"
        type="text"
        v-model="incidentDescription"
        placeholder="Describe the issue"
      />

      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Send" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Task saved successfully!</p>
    </form>
  </div>
</template>

<style scoped>
.task-form-container {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  margin-top: 15px;
  padding: 0.7rem;
  width: 100%;
  border: none;
  background: #4caf50;
  color: white;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #449d48;
}

.checkbox-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>
