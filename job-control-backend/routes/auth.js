const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

//
// ──────────────────────────────────────────────
//   🔐 REGISTRO DE USUARIO
// ──────────────────────────────────────────────
//
router.post("/register", async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  try {
    if (!nombre || !apellidos || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const newUser = new User({
      nombre,
      apellidos,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

//
// ──────────────────────────────────────────────
//   🔑 LOGIN
// ──────────────────────────────────────────────
//
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son obligatorios" });
    }

    console.log("📥 Datos recibidos en /login:", req.body);

    const user = await User.findOne({ email });
    console.log("🔍 Usuario encontrado:", user);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✔️ Contraseña coincide?:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
      },
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

//
// ──────────────────────────────────────────────
//   🔄 RECUPERAR CONTRASEÑA - ENVÍO DE EMAIL
// ──────────────────────────────────────────────
//
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    console.log("📥 Solicitud para recuperar contraseña:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${user.nombre},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;

    await sendEmail(
      user.email,
      "Recuperación de contraseña - Job-Control",
      html
    );

    console.log("📧 Email enviado correctamente a:", user.email);

    res.json({ message: "Correo enviado. Revisa tu bandeja de entrada." });
  } catch (err) {
    console.error("Error en forgot-password:", err);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

//
// ──────────────────────────────────────────────
//   🔁 RESET PASSWORD - CAMBIAR CONTRASEÑA
// ──────────────────────────────────────────────
//
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    console.log("🔑 Solicitud para reset-password con token:", token);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Token inválido o expirado");
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Validación de seguridad
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 6 caracteres, un número y un símbolo",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log("🔐 Contraseña actualizada para:", user.email);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error en reset-password:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
