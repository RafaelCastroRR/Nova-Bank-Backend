import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./mongo.js";
import authRoutes from '../src/auth/auth.routes.js';
import accountRoutes from '../src/accounts/account.routes.js';
import userRoutes from '../src/users/user.routes.js';
import User from '../src/users/user.model.js';
import balanceRoutes from '../src/balance/balance.route.js';
import transactionRoutes from '../src/transactions/transaction.routes.js';
import twoFactorRoutes from '../src/2fa/2fa.routes.js';
import productRoutes from '../src/products/product.routes.js';
import statsRoutes from '../src/stats/stats.routes.js';
import { hash } from "argon2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../Nova-Bank/dist");

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(morgan('dev'));
  
  // Servir estáticos del Frontend de Nova-Bank
  app.use(express.static(frontendDistPath));
};

const routes = (app) => {
  app.use("/bankSystem/v1/auth", authRoutes);
  app.use("/bankSystem/v1/account", accountRoutes);
  app.use("/bankSystem/v1/user", userRoutes);
  app.use("/bankSystem/v1/balance", balanceRoutes);
  app.use("/bankSystem/v1/transaction", transactionRoutes);
  app.use("/bankSystem/v1/2fa", twoFactorRoutes);
  app.use("/bankSystem/v1/products", productRoutes);
  app.use("/bankSystem/v1/stats", statsRoutes);

  // Redireccionar rutas SPA del Frontend al index.html
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/bankSystem/v1")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
};

const conectarDb = async () => {
  try {
    await dbConnection();
    console.log('MongoDB | Conectado');
    await crearAdmin();
  } catch (error) {
    console.log('Error al conectarse a la DB:', error);
  }
};

export const initServer = () => {
  const app = express();
  const port = process.env.PORT || 3002;

  middlewares(app);
  routes(app);
  conectarDb();

  app.listen(port, () => {
    console.log(`🚀 Nova Bank (App + API) activo en puerto ${port}`);
  });
};

const crearAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'ADMINB' });

    if (!existingAdmin) {
      const hashedPassword = await hash('ADMINB');

      const admin = await User.create({
        name: 'Default Admin',
        username: 'ADMINB',
        dpi: 1234567890,
        address: 'Admin HQ',
        phone: 1234567890,
        email: 'adminb@adminb.com',
        password: hashedPassword,
        monthlyIncome: 999999,
        role: 'ADMIN_ROLE',
      });

      console.log('✅ Admin creado correctamente:', admin.username);
    } else {
      console.log('ℹ️ Admin ya existe');
    }
  } catch (error) {
    console.error(`❌ Error al crear admin: ${error.message}`);
  }
};
