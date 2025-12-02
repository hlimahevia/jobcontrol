const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🔑 Necesarios para recuperar contraseña
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

}, { timestamps: true });

// Hash de la contraseña
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const plain = this.password;
  this.password = await bcrypt.hash(plain, 10);

  console.log('🧱 Nuevo hash para usuario:', this.email);
  console.log('   Contraseña en claro:', plain);
  console.log('   Hash generado:', this.password);

  next();
});

module.exports = mongoose.model('User', UserSchema);
