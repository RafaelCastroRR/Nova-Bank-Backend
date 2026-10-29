import { config } from "dotenv";
config();

import mongoose from "mongoose";
import { hash } from "argon2";
import User from "./src/users/user.model.js";
import Account from "./src/accounts/account.model.js";
import Transaction from "./src/transactions/transaction.model.js";
import Product from "./src/products/product.model.js";

async function runSeed() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado con éxito a MongoDB.");

    const defaultPassword = await hash("Nova123!");

    // 1. Asegurar Admin
    let admin = await User.findOne({ username: "ADMINB" });
    if (!admin) {
      admin = await User.create({
        name: "Default Admin",
        username: "ADMINB",
        dpi: 1234567890123,
        address: "Oficina Central Nova Bank, Zona 10",
        phone: 55551234,
        email: "adminb@adminb.com",
        password: await hash("ADMINB"),
        monthlyIncome: 50000,
        role: "ADMIN_ROLE",
        status: true,
      });
      console.log("✅ Admin ADMINB creado.");
    }

    // 2. Crear Productos
    console.log("Creando productos financieros...");
    const productsData = [
      {
        name: "Tarjeta Nova Black Metal",
        description: "Tarjeta de crédito premium con 5% de cashback en compras internacionales y acceso a salas VIP.",
        type: "Product",
        enterprise: "Nova Bank Card Services",
        disscountPorcent: 15,
        originalPrice: 1500,
        profitPrice: 1275,
        img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
        status: true,
      },
      {
        name: "Préstamo Personal Inmediato",
        description: "Crédito pre-aprobado con tasa preferencial del 8.5% anual sin fiador.",
        type: "Service",
        enterprise: "Nova Créditos",
        disscountPorcent: 0,
        originalPrice: 500,
        profitPrice: 500,
        img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=60",
        status: true,
      },
      {
        name: "Seguro de Protección Total",
        description: "Cobertura completa contra fraudes cibernéticos, clonación y pérdida de fondos.",
        type: "Service",
        enterprise: "Nova Seguros S.A.",
        disscountPorcent: 10,
        originalPrice: 350,
        profitPrice: 315,
        img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60",
        status: true,
      },
      {
        name: "Inversión Plazo Fijo Platino",
        description: "Rendimiento garantizado del 7.2% trimestral con reinversión de utilidades.",
        type: "Service",
        enterprise: "Nova Inversiones",
        disscountPorcent: 0,
        originalPrice: 1000,
        profitPrice: 1000,
        img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60",
        status: true,
      },
    ];

    const savedProducts = [];
    for (const p of productsData) {
      let prod = await Product.findOne({ name: p.name });
      if (!prod) {
        prod = await Product.create(p);
        console.log(`✅ Producto creado: ${prod.name}`);
      }
      savedProducts.push(prod);
    }

    // 3. Crear Usuarios Clientes
    console.log("Creando usuarios clientes...");
    const clientsData = [
      {
        name: "Carlos Morales",
        username: "carlosm",
        dpi: 2450198420101,
        address: "Colonia Las Charcas, Zona 11, Guatemala",
        phone: 54123890,
        email: "carlos.morales@novabank.com",
        password: defaultPassword,
        monthlyIncome: 14500,
        role: "USER_ROLE",
        status: true,
        accountNo: 1002345671,
        accountType: "SAVINGS",
        balance: 18500.00,
      },
      {
        name: "Sofia Alvarez",
        username: "sofiaa",
        dpi: 3120489120101,
        address: "Carretera a El Salvador, Km 14.5",
        phone: 41239854,
        email: "sofia.alvarez@novabank.com",
        password: defaultPassword,
        monthlyIncome: 18000,
        role: "USER_ROLE",
        status: true,
        accountNo: 1002345672,
        accountType: "CHECKING",
        balance: 24350.50,
      },
      {
        name: "Mateo Castillo",
        username: "mateoc",
        dpi: 2890123450101,
        address: "Zona 14, La Cañada, Guatemala",
        phone: 59871234,
        email: "mateo.castillo@novabank.com",
        password: defaultPassword,
        monthlyIncome: 25000,
        role: "USER_ROLE",
        status: true,
        accountNo: 1002345673,
        accountType: "CHECKING",
        balance: 42000.00,
      },
      {
        name: "Elena Rodriguez",
        username: "elenar",
        dpi: 2198765430101,
        address: "Condominio El Frutal, Villa Nueva",
        phone: 48901254,
        email: "elena.rodriguez@novabank.com",
        password: defaultPassword,
        monthlyIncome: 9500,
        role: "USER_ROLE",
        status: true,
        accountNo: 1002345674,
        accountType: "SAVINGS",
        balance: 7850.25,
      },
    ];

    const userAccounts = [];

    for (const c of clientsData) {
      let user = await User.findOne({ username: c.username });
      if (!user) {
        user = await User.create({
          name: c.name,
          username: c.username,
          dpi: c.dpi,
          address: c.address,
          phone: c.phone,
          email: c.email,
          password: c.password,
          monthlyIncome: c.monthlyIncome,
          role: c.role,
          status: c.status,
        });
        console.log(`✅ Usuario creado: ${user.name} (${user.username})`);
      }

      let account = await Account.findOne({ user: user._id });
      if (!account) {
        account = await Account.create({
          accountNo: c.accountNo,
          user: user._id,
          balance: c.balance,
          verify: true,
          accountType: c.accountType,
          transactions: [],
        });
        console.log(`✅ Cuenta creada para ${user.name}: No. ${account.accountNo} - Saldo: Q${account.balance}`);
      }
      userAccounts.push({ user, account });
    }

    // 4. Agregar Favoritos cruzados
    console.log("Configurando lista de contactos favoritos...");
    for (let i = 0; i < userAccounts.length; i++) {
      const current = userAccounts[i];
      const otherAccounts = userAccounts.filter((_, idx) => idx !== i);
      const favList = otherAccounts.map(o => ({
        account: o.account._id,
        nickName: o.user.name.split(" ")[0],
      }));
      await User.findByIdAndUpdate(current.user._id, { favorites: favList });
    }
    console.log("✅ Contactos favoritos configurados.");

    // 5. Crear Transacciones y Datos de Gráficos (últimos 7 días)
    const existingTransactions = await Transaction.countDocuments();
    if (existingTransactions < 5) {
      console.log("Generando historial de transacciones bancarias...");

      const now = new Date();
      const createPastDate = (daysAgo, hoursAgo = 0) => {
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        d.setHours(d.getHours() - hoursAgo);
        return d;
      };

      const transactionsToCreate = [
        // Depósitos iniciales
        {
          type: "DEPOSIT",
          admin: admin._id,
          fromAccount: null,
          toAccount: userAccounts[0].account._id,
          toAccountModel: "Account",
          amount: 5000,
          description: "Depósito de Nómina Quincenal",
          createdAt: createPastDate(6, 2),
          status: true,
        },
        {
          type: "DEPOSIT",
          admin: admin._id,
          fromAccount: null,
          toAccount: userAccounts[1].account._id,
          toAccountModel: "Account",
          amount: 8500,
          description: "Abono en Ventanilla Agencia Central",
          createdAt: createPastDate(5, 4),
          status: true,
        },
        {
          type: "DEPOSIT",
          admin: admin._id,
          fromAccount: null,
          toAccount: userAccounts[2].account._id,
          toAccountModel: "Account",
          amount: 12000,
          description: "Transferencia Interbancaria ACH Entrante",
          createdAt: createPastDate(4, 1),
          status: true,
        },
        // Transferencias entre usuarios
        {
          type: "TRANSFER",
          admin: null,
          fromAccount: userAccounts[0].account._id,
          toAccount: userAccounts[1].account._id,
          toAccountModel: "Account",
          amount: 1250,
          description: "Pago cuota de alquiler",
          createdAt: createPastDate(4, 6),
          status: true,
        },
        {
          type: "TRANSFER",
          admin: null,
          fromAccount: userAccounts[1].account._id,
          toAccount: userAccounts[2].account._id,
          toAccountModel: "Account",
          amount: 800,
          description: "Reembolso cena de trabajo",
          createdAt: createPastDate(3, 3),
          status: true,
        },
        {
          type: "TRANSFER",
          admin: null,
          fromAccount: userAccounts[2].account._id,
          toAccount: userAccounts[3].account._id,
          toAccountModel: "Account",
          amount: 3200,
          description: "Honorarios profesionales de diseño",
          createdAt: createPastDate(2, 5),
          status: true,
        },
        {
          type: "TRANSFER",
          admin: null,
          fromAccount: userAccounts[3].account._id,
          toAccount: userAccounts[0].account._id,
          toAccountModel: "Account",
          amount: 450,
          description: "Abono de servicios compartidos",
          createdAt: createPastDate(1, 2),
          status: true,
        },
        {
          type: "TRANSFER",
          admin: null,
          fromAccount: userAccounts[0].account._id,
          toAccount: userAccounts[2].account._id,
          toAccountModel: "Account",
          amount: 950,
          description: "Pago de mensualidad gimnasio",
          createdAt: createPastDate(0, 3),
          status: true,
        },
        // Compras de productos
        {
          type: "PURCHASE",
          admin: null,
          fromAccount: userAccounts[2].account._id,
          toAccount: savedProducts[0]._id,
          toAccountModel: "Product",
          amount: 1275,
          description: "Adquisición Tarjeta Nova Black Metal",
          createdAt: createPastDate(2, 1),
          status: true,
        },
        {
          type: "PURCHASE",
          admin: null,
          fromAccount: userAccounts[1].account._id,
          toAccount: savedProducts[2]._id,
          toAccountModel: "Product",
          amount: 315,
          description: "Contratación Seguro Protección Total",
          createdAt: createPastDate(1, 8),
          status: true,
        },
      ];

      for (const t of transactionsToCreate) {
        const trans = await Transaction.create(t);

        // Asociar a cuentas
        if (t.fromAccount) {
          await Account.findByIdAndUpdate(t.fromAccount, {
            $push: { transactions: trans._id },
          });
        }
        if (t.toAccount && t.toAccountModel === "Account") {
          await Account.findByIdAndUpdate(t.toAccount, {
            $push: { transactions: trans._id },
          });
        }
        console.log(`✅ Transacción registrada: ${t.type} - Q${t.amount} (${t.description})`);
      }
    }

    console.log("\n=======================================================");
    console.log("🎉 SEED COMPLETADO CON ÉXITO");
    console.log("=======================================================");
    console.log("Usuarios disponibles para login (Contraseña para todos: Nova123!):");
    console.log("1. Carlos Morales:   usuario 'carlosm' | correo 'carlos.morales@novabank.com'");
    console.log("2. Sofia Alvarez:    usuario 'sofiaa'  | correo 'sofia.alvarez@novabank.com'");
    console.log("3. Mateo Castillo:   usuario 'mateoc'  | correo 'mateo.castillo@novabank.com'");
    console.log("4. Elena Rodriguez:  usuario 'elenar'  | correo 'elena.rodriguez@novabank.com'");
    console.log("Administrador General: usuario 'ADMINB' | contraseña 'ADMINB'");
    console.log("=======================================================");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seeding:", err);
    process.exit(1);
  }
}

runSeed();
