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
    <h3 class="register-title">Register Task</h3>

    <form @submit.prevent="submitTask" class="task-form">

  <div class="form-grid">
    <!-- Date -->
    <div class="form-field">
      <label>Date</label>
      <input type="date" v-model="date" required />
    </div>

    <!-- Shift -->
    <div class="form-field">
      <label>Shift</label>
      <select v-model="shiftNumber" required>
        <option disabled value="">Select shift</option>
        <option value="1">Shift 1</option>
        <option value="2">Shift 2</option>
      </select>
    </div>

    <!-- Area -->
    <div class="form-field">
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
    </div>

    <!-- Task -->
    <div class="form-field">
      <label>Task</label>
      <select v-model="task" required>
        <option disabled value="">Select task</option>
        <option v-for="t in availableTasks" :key="t">
          {{ t }}
        </option>
      </select>
    </div>

    <!-- Start Time -->
    <div class="form-field">
      <label>Start Time</label>
      <input type="time" v-model="startTime" required />
    </div>

    <!-- End Time -->
    <div class="form-field">
      <label>End Time</label>
      <input type="time" v-model="endTime" required />
    </div>
  </div>

  <!-- FOOTER -->
  <div class="form-footer">
    <label class="checkbox-row">
      <input type="checkbox" v-model="hasIncident" />
      <span>Has Issue</span>
    </label>

    <input
      v-if="hasIncident"
      type="text"
      v-model="incidentDescription"
      placeholder="Describe the issue"
      class="issue-input"
    />

    <button type="submit" :disabled="loading" class="send-btn">
      {{ loading ? "Saving..." : "Send" }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Task saved successfully!</p>
  </div>

</form>
  </div>
</template>

<style scoped>
.task-form-container {
  background: #ffffff;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.register-title{
  padding-bottom: 20px;
}
/* GRID 2 COLUMNAS */
.task-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}

/* CAMPOS */
.form-field {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

/* INPUTS */
input,
select {
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

input:focus,
select:focus {
  border-color: #56ccf2;
  box-shadow: 0 0 0 3px rgba(86, 204, 242, 0.3);
}

/* FOOTER */
.form-footer {
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* CHECKBOX */
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

/* ISSUE INPUT */
.issue-input {
  width: 100%;
}

/* BOTÓN SEND */
.send-btn {
  align-self: center;
  margin-top: 10px;
  padding: 0.55rem 2.2rem;
  background: #6fcf97;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.send-btn:hover {
  background: #5bbf86;
}

/* MENSAJES */
.error {
  color: #eb5757;
  font-size: 0.9rem;
}

.success {
  color: #27ae60;
  font-size: 0.9rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

</style>
