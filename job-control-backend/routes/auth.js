// /mnt/data/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registro
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

// Login
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

module.exports = router;
