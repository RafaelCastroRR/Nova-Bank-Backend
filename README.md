# 🏦 Nova-Bank Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Two--Factor%20Auth-blue?style=for-the-badge&logo=authy&logoColor=white" alt="2FA" />
</p>

## 📌 Descripción del Proyecto

API RESTful empresarial para la plataforma de banca en línea **Nova Bank**. Diseñada para gestionar operaciones bancarias seguras, transacciones monetarias en tiempo real, autenticación multifactor (2FA), control de balances y analíticas financieras.

> 🔗 **Repositorio Original:** [SantiagoContreras1/Bank-System](https://github.com/SantiagoContreras1/Bank-System)

---

## ✨ Características y Módulos Principales

- **Gestión de Cuentas:** Apertura y administración de cuentas bancarias (ahorro y monetarias/corrientes) con generación única de número de cuenta.
- **Transacciones Seguras:** Transferencias entre cuentas, depósitos, retiros y validación de fondos en tiempo real.
- **Autenticación en Dos Pasos (2FA):** Verificación de seguridad adicional para transacciones críticas y transferencias bancarias.
- **Control de Balances e Historial:** Registro auditable y detallado de cada movimiento con marcas temporales.
- **Catálogo de Productos:** Gestión de servicios financieros, créditos y productos bancarios.
- **Métricas y Estadísticas:** Módulo analítico para monitoreo de actividad bancaria y flujos de capital.
- **Autenticación & RBAC:** Control de acceso basado en roles (`ADMIN`, `USER`) con protección de endpoints mediante JWT.

---

## 🛠️ Tecnologías y Librerías

- **Entorno:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MongoDB con ODM Mongoose
- **Seguridad:** Cifrado de contraseñas, JWT (JSON Web Tokens), CORS, Helmet
- **Autenticación Multifactor:** Módulo 2FA integrado

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone git@github.com:RafaelCastroRR/Nova-Bank-Backend.git
cd Nova-Bank-Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
PORT=3000
URI_MONGO=mongodb+srv://<usuario>:<password>@cluster0.example.mongodb.net/Nova_Bank
JWT_SECRET=tu_secreto_seguro_jwt
```

### 4. Iniciar el servidor
```bash
# Modo desarrollo con nodemon
npm run dev

# Modo producción
npm start
```

---

## 📂 Estructura del Proyecto

```text
├── config/             # Configuración de base de datos y servidor
├── src/
│   ├── 2fa/            # Autenticación de doble factor para transacciones
│   ├── accounts/       # Gestión y tipos de cuentas bancarias
│   ├── auth/           # Login, registro y tokens JWT
│   ├── balance/        # Consultas de fondos y saldos disponibles
│   ├── helpers/        # Utilidades y formateadores
│   ├── middlewares/    # Validaciones, autenticación y manejo de errores
│   ├── products/       # Servicios y productos bancarios
│   ├── stats/          # Estadísticas y métricas financieras
│   ├── transactions/   # Depósitos, retiros y transferencias
│   └── users/          # Administración de perfiles y roles
├── index.js            # Punto de entrada de la aplicación
├── package.json
└── README.md
```

---

## 🔗 Frontend Asociado
Este backend interactúa con la interfaz web de **Nova Bank**:  
👉 **[Nova-Bank Frontend](https://github.com/RafaelCastroRR/Nova-Bank)**

---

## 📄 Licencia
Proyecto desarrollado con fines académicos y de demostración técnica.
