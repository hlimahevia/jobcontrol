const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  shiftNumber: { type: Number, enum: [1, 2], required: true },
  area: { type: String, required: true },
  task: { type: String, required: true },
  startTime: { type: String, required: true }, // "07:05"
  endTime: { type: String, required: true },   // "10:30"
  hasIncident: { type: Boolean, default: false },
  incidentDescription: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shift', ShiftSchema);
