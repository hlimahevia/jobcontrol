# Job Control

**Job Control** es una aplicación web full stack desarrollada con Vue.js en el frontend y Node.js/Express en el backend, conectada a una base de datos MongoDB. Permite gestionar usuarios con funciones como:

- Registro
- Inicio de sesión
- Recuperación de contraseña
- Control de sesión con tokens JWT

---

## 📁 Estructura del Proyecto

JobControl/
├── frontend/ # Cliente con Vue 3 + Vite
└── backend/ # API con Express + MongoDB

yaml
Copiar código

---

## 🚀 Tecnologías

### Frontend
- Vue 3
- Vite
- Vue Router
- Axios
- Pinia (estado global)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Bcrypt (hashing)
- JSON Web Tokens (JWT)
- Nodemailer (emails)

---

## ⚙️ Instalación

### Clonar repositorio

```bash
git clone https://github.com/hlimahevia/job-control.git
cd job-control
Backend
bash
Copiar código
cd backend
npm install
Crear archivo .env:

ini
Copiar código
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-control
JWT_SECRET=mi_secreto_super_seguro
CLIENT_URL=http://localhost:5173
Iniciar backend:

bash
Copiar código
npm run dev
Frontend
bash
Copiar código
cd ../frontend
npm install
npm run dev
🧪 Funcionalidades
Registro y login con validación

JWT para autenticación

Recuperación de contraseña por correo

Panel tras login con rutas protegidas

👤 Autor
Héctor Lima Hevia
GitHub

🪪 Licencia
Este proyecto está bajo la licencia MIT.