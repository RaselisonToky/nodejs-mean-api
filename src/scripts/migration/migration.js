import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
dotenv.config();

import Role from "../../role/role.entity.js";
import User from "../../user/user.entity.js";
import Service from "../../service/service.entity.js";
import Category from "../../category/category.entity.js"; // Catégorie pour les services
import PieceCategory from "../../inventory/piece/categories/piece-categorie.entity.js"
import bcrypt from "bcrypt";
import { STATUS } from "../../appointment/appointment.entitiy.js";
import Brand from "../../car/brand/brand.entity.js";
import CarModel from "../../car/model/model.entity.js";
import Piece from "../../inventory/piece/piece.entity.js";
import Supplier from "../../inventory/supplier/supplier.entity.js";
import SupplierOrder from "../../inventory/supplier/order/order.entity.js"
import Transaction from "../../inventory/transaction/transaction.entity.js";
import Inventory from "../../inventory/inventory.entity.js";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connecté");
  }
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("Connexion MongoDB fermée");
  }
}

async function createRoles() {
  const roles = ["USER", "MECHANIC", "ADMIN"];
  const roleDocs = {};

  for (const roleName of roles) {
    let role = await Role.findOne({ name: roleName });
    if (!role) {
      role = await Role.create({
        name: roleName,
        description: `${roleName} role`,
      });
      console.log(`Role ${roleName} créé`);
    }
    roleDocs[roleName] = role;
  }
  return roleDocs;
}

async function createAdminUser(roles) {
  let adminUser = await User.findOne({ username: "admin" });
  if (!adminUser) {
    adminUser = await User.create({
      firstname: "Admin",
      lastname: "Manager",
      username: "admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin", 10),
      roles: [roles["ADMIN"]._id],
    });
    console.log("Utilisateur admin créé");
  } else {
    console.log("L'utilisateur admin existe déjà");
  }
  return adminUser;
}

async function createMechanics(roles, numMechanics = 5) {
  const mechanicDocs = [];

  for (let i = 0; i < numMechanics; i++) {
    const username = `mechanic${i + 1}`;
    let mechanic = await User.findOne({ username: username });

    if (!mechanic) {
      mechanic = await User.create({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        username: username,
        email: `mechanic${i + 1}@gmail.com`,
        password: await bcrypt.hash("password", 10),
        roles: [roles["MECHANIC"]._id],
      });
      console.log(`Mécanicien ${username} créé`);
    }
    mechanicDocs.push(mechanic);
  }
  return mechanicDocs;
}

async function createCategories() {
  // Catégories pour les services
  const categoryData = [
    {
      name: "Embrayage",
      backgroundColor: "#e9ecef",
      borderColor: "#ced4da",
      color: "#343a40",
    },
    {
      name: "Suspension",
      backgroundColor: "#f8d7da",
      borderColor: "#f5c6cb",
      color: "#721c24",
    },
    {
      name: "Échappement",
      backgroundColor: "#fff3cd",
      borderColor: "#ffeeba",
      color: "#856404",
    },
    {
      name: "Démarrage et charge",
      backgroundColor: "#d1e7dd",
      borderColor: "#c3e6cb",
      color: "#155724",
    },
    {
      name: "Direction et transmission",
      backgroundColor: "#c6dafc",
      borderColor: "#b6cfd2",
      color: "#0c5460",
    },
    {
      name: "Géométrie",
      backgroundColor: "#e2dff3",
      borderColor: "#d4c5ef",
      color: "#491863",
    },
    {
      name: "Pneus et roues",
      backgroundColor: "#f0f0f0",
      borderColor: "#ccc",
      color: "#333",
    },
    {
      name: "Carrosserie",
      backgroundColor: "#fae0cf",
      borderColor: "#efd1b7",
      color: "#8a4b1e",
    },
    {
      name: "Vision",
      backgroundColor: "#e9ecef",
      borderColor: "#ced4da",
      color: "#343a40",
    },
    {
      name: "Climatisation",
      backgroundColor: "#d1e7dd",
      borderColor: "#c3e6cb",
      color: "#155724",
    },
  ];

  const categories = {};
  for (const catData of categoryData) {
    let category = await Category.findOne({ name: catData.name });
    if (!category) {
      category = await Category.create(catData);
      console.log(`Catégorie ${catData.name} créée`);
    }
    categories[catData.name] = category;
  }
  return categories;
}

async function createPieceCategories() {
  // Catégories pour les pièces (PieceCategories)
  const pieceCategoriesData = [
    { name: "Moteur", description: "Pièces relatives au moteur" },
    { name: "Transmission", description: "Pièces relatives à la transmission" },
    { name: "Freinage", description: "Pièces de freinage" },
    { name: "Suspension", description: "Pièces de suspension" },
    { name: "Éclairage", description: "Pièces d'éclairage" },
  ];

  const pieceCategories = [];
  for (const data of pieceCategoriesData) {
    let category = await PieceCategory.findOne({ name: data.name });
    if (!category) {
      category = await PieceCategory.create(data);
      console.log(`Catégorie de pièce ${data.name} créée`);
    }
    pieceCategories.push(category);
  }
  return pieceCategories;
}

async function createServices(categories) {
  const servicesData = {
    Embrayage: [
      "Remplacement embrayage",
      "Réglage embrayage",
      "Diagnostic embrayage",
      "Entretien embrayage",
      "Changement butée embrayage",
    ],
    Suspension: [
      "Changement amortisseurs",
      "Révision suspension",
      "Alignement suspension",
      "Réparation suspension",
      "Diagnostic suspension",
    ],
    Échappement: [
      "Réparation pot échappement",
      "Changement silencieux",
      "Diagnostic pollution",
      "Nettoyage catalyseur",
      "Installation ligne inox",
    ],
    "Démarrage et charge": [
      "Remplacement batterie",
      "Changement alternateur",
      "Diagnostic démarreur",
      "Réparation circuit électrique",
      "Recharge batterie",
    ],
    "Direction et transmission": [
      "Changement crémaillère",
      "Réglage direction assistée",
      "Réparation cardan",
      "Changement boîte de vitesse",
      "Diagnostic transmission",
    ],
    Géométrie: [
      "Parallélisme",
      "Réglage chasse-cambrure",
      "Diagnostic train roulant",
      "Correction géométrie",
      "Alignement essieu",
    ],
    "Pneus et roues": [
      "Montage pneus",
      "Équilibrage roues",
      "Réparation crevaison",
      "Gonflage azote",
      "Changement jantes",
    ],
    Carrosserie: [
      "Réparation pare-chocs",
      "Peinture voiture",
      "Débosselage sans peinture",
      "Remplacement portière",
      "Traitement anti-rouille",
    ],
    Vision: [
      "Changement pare-brise",
      "Réglage phares",
      "Traitement anti-pluie",
      "Pose films teintés",
      "Réparation essuie-glaces",
    ],
    Climatisation: [
      "Recharge climatisation",
      "Diagnostic climatisation",
      "Changement filtre habitacle",
      "Réparation compresseur",
      "Nettoyage circuit clim",
    ],
  };

  for (const [categoryName, services] of Object.entries(servicesData)) {
    for (const serviceName of services) {
      let existingService = await Service.findOne({ name: serviceName });
      if (!existingService) {
        await Service.create({
          name: serviceName,
          category: categories[categoryName]._id,
          price: Math.floor(Math.random() * 200) + 50,
          estimateDuration: Math.floor(Math.random() * 120) + 30,
        });
        console.log(`Service ${serviceName} créé dans la catégorie ${categoryName}`);
      }
    }
  }
}

async function createCarBrands() {
  const brandsData = ["Renault", "Peugeot", "Citroen", "Volkswagen", "Toyota"];
  const brandDocs = {};

  for (const brandName of brandsData) {
    let brand = await Brand.findOne({ name: brandName });
    if (!brand) {
      brand = await Brand.create({ name: brandName });
      console.log(`Marque ${brandName} créée`);
    }
    brandDocs[brandName] = brand;
  }
  return brandDocs;
}

async function createCarModels(brands) {
  const carModelData = [
    { brand: brands["Renault"]._id, name: "Clio", releaseYear: 2018 },
    { brand: brands["Peugeot"]._id, name: "308", releaseYear: 2019 },
    { brand: brands["Citroen"]._id, name: "C3", releaseYear: 2020 },
    { brand: brands["Volkswagen"]._id, name: "Golf", releaseYear: 2017 },
    { brand: brands["Toyota"]._id, name: "Yaris", releaseYear: 2021 },
  ];
  const carModelDocs = [];
  for (const car of carModelData) {
    let carModel = await CarModel.findOne({
      name: car.name,
      releaseYear: car.releaseYear,
    });
    if (!carModel) {
      carModel = await CarModel.create(car);
      console.log(`Modèle de voiture ${car.name} créé`);
    }
    carModelDocs.push(carModel);
  }
  return carModelDocs;
}

async function createAppointments(adminUser, services) {
  const carModels = await CarModel.find();
  if (!carModels.length) {
    console.error("Aucun modèle de voiture trouvé. Vérifiez la migration des marques et modèles.");
    return;
  }
  const generateRandomDateInMonths = () => {
    const year = new Date().getFullYear();
    const months = [3, 4, 5];
    const month = months[Math.floor(Math.random() * months.length)];
    let maxDay;
    if (month === 3 || month === 5) {
      maxDay = 30;
    } else if (month === 4) {
      maxDay = 31;
    }
    const day = Math.floor(Math.random() * maxDay) + 1;
    const hour = Math.floor(Math.random() * 9) + 8;
    return new Date(year, month, day, hour, 0, 0, 0);
  };
  const getRandomServices = (services, count) => {
    const shuffled = [...services].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  const calculateTotals = (selectedServices) => {
    const totalDuration = selectedServices.reduce(
        (sum, service) => sum + service.estimateDuration,
        0
    );
    const totalPrice = selectedServices.reduce(
        (sum, service) => sum + service.price,
        0
    );
    return { totalDuration, totalPrice };
  };
  const generateMadagascarLicensePlate = () => {
    const randomLetters = (length) => {
      let result = "";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return result;
    };
    const randomDigits = (length) => {
      let result = "";
      const digits = "0123456789";
      for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
      }
      return result;
    };
    return `${randomLetters(2)} ${randomDigits(4)} ${randomLetters(2)}`;
  };
  const generateMadagascarPhoneNumber = () => {
    const prefixes = ["032", "033", "034", "038"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = (length) => {
      let result = "";
      const digits = "0123456789";
      for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
      }
      return result;
    };
    const part1 = randomDigits(3);
    const part2 = randomDigits(3);
    return `${prefix} ${part1} ${part2}`;
  };
  const Appointment = mongoose.model("Appointment");
  for (let i = 0; i < 100; i++) {
    const selectedCarModel = carModels[Math.floor(Math.random() * carModels.length)];
    const numberOfServices = Math.floor(Math.random() * 3) + 1;
    const selectedServices = getRandomServices(services, numberOfServices);
    const { totalDuration, totalPrice } = calculateTotals(selectedServices);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const phone = generateMadagascarPhoneNumber();

    await Appointment.create({
      name: fullName,
      email: email,
      phone: phone,
      carModel: selectedCarModel._id,
      licensePlate: generateMadagascarLicensePlate(),
      services: selectedServices.map((service) => service._id),
      scheduleAt: generateRandomDateInMonths(),
      estimateDuration: totalDuration,
      estimatedPrice: totalPrice,
      status: STATUS.REQUESTED,
    });
    console.log(`Rendez-vous créé pour ${fullName} avec statut ${STATUS.REQUESTED}`);
  }
  console.log("200 rendez-vous ont été créés : 100 REQUESTED et 100 COMPLETED");
}



const createPieces = async (numRecords = 10, pieceCategories = []) => {
  // Liste de types de pièces de véhicule réalistes
  const vehicleParts = [
    "Courroie de distribution",
    "Disques de frein",
    "Amortisseurs",
    "Plaquettes de frein",
    "Alternateur",
    "Batterie",
    "Moteur",
    "Radiateur",
    "Embrayage",
    "Filtres à air",
  ];
  const pieces = [];
  for (let i = 0; i < numRecords; i++) {
    const partName = vehicleParts[i % vehicleParts.length];
    const piece = await Piece.create({
      name: partName,
      reference: faker.string.uuid(),
      description: faker.commerce.productDescription(),
      unit_price: parseFloat(faker.commerce.price(10, 1000, 2)),
      stock_quantity: faker.number.int({ min: 1, max: 50 }),
      alert_threshold: 5,
      last_updated: new Date(),
      pieceCategory: pieceCategories.length
        ? pieceCategories[Math.floor(Math.random() * pieceCategories.length)]._id
        : undefined,
    });
    pieces.push(piece);
  }
  console.log(`${numRecords} pièces de véhicules créées avec succès !`);
  return pieces;
};

async function createSuppliers(num = 5) {
  const suppliers = [];
  for (let i = 0; i < num; i++) {
    const supplier = await Supplier.create({
      name: faker.company.name(),
      contact: faker.phone.number(),
      address: faker.location.streetAddress(),
    });
    console.log(`Fournisseur ${supplier.name} créé`);
    suppliers.push(supplier);
  }
  return suppliers;
}

async function createSupplierOrders(suppliers, pieces, numOrders = 5) {
  const statuses = ["Pending", "Shipped", "Received", "Cancelled"];
  const orders = [];
  for (let i = 0; i < numOrders; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const numItems = faker.number.int({ min: 1, max: 3 });
    let items = [];
    for (let j = 0; j < numItems; j++) {
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      items.push({
        part_id: piece._id,
        quantity: faker.number.int({ min: 1, max: 20 }),
        unit_price: piece.unit_price,
      });
    }
    const order = await SupplierOrder.create({
      supplier_id: supplier._id,
      order_date: faker.date.recent(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: items,
    });
    console.log(`Commande fournisseur ${order._id} créée pour ${supplier.name}`);
    orders.push(order);
  }
  return orders;
}

async function createTransactions(pieces, supplierOrders, numTransactions = 10) {
  const types = ["IN", "OUT"];
  const transactions = [];
  for (let i = 0; i < numTransactions; i++) {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    let related_order_id = null;
    if (type === "IN" && supplierOrders.length > 0) {
      related_order_id = supplierOrders[Math.floor(Math.random() * supplierOrders.length)]._id;
    }
    const transaction = await Transaction.create({
      part_id: piece._id,
      type: type,
      quantity: faker.number.int({ min: 1, max: 10 }),
      transaction_date: faker.date.recent(),
      related_order_id: related_order_id,
    });
    console.log(`Transaction ${transaction.type} pour pièce ${piece.name} créée`);
    transactions.push(transaction);
  }
  return transactions;
}

async function createInventories(pieces) {
  const inventories = [];
  for (const piece of pieces) {
    const counted_quantity = faker.number.int({ min: 0, max: 100 });
    const recorded_quantity = piece.stock_quantity;
    const difference = counted_quantity - recorded_quantity;
    const inventory = await Inventory.create({
      part_id: piece._id,
      counted_quantity: counted_quantity,
      recorded_quantity: recorded_quantity,
      audit_date: faker.date.recent(),
      difference: difference,
    });
    console.log(`Inventaire créé pour pièce ${piece.name}`);
    inventories.push(inventory);
  }
  return inventories;
}

async function runMigrations() {
  try {
    await connectDB();
    const roles = await createRoles();
    const adminUser = await createAdminUser(roles);
    await createMechanics(roles);
    const categories = await createCategories();
    await createServices(categories);
    const pieceCategories = await createPieceCategories();
    const brands = await createCarBrands();
    await createCarModels(brands);
    await createAppointments(adminUser, await Service.find());

    const pieces = await createPieces(10, pieceCategories);
    const suppliers = await createSuppliers(5);
    const supplierOrders = await createSupplierOrders(suppliers, pieces, 5);
    await createTransactions(pieces, supplierOrders, 10);
    await createInventories(pieces);

    console.log("Toutes les migrations ont été exécutées avec succès");
  } catch (error) {
    console.error("Erreur lors de la migration", error);
  } finally {
    await closeDB();
  }
}

runMigrations().then();
