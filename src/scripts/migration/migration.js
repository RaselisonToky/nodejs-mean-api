import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
dotenv.config();

import Role from "../../role/role.entity.js";
import User from "../../user/user.entity.js";
import Service from "../../service/service.entity.js";
import Category from "../../category/category.entity.js";
import bcrypt from "bcrypt";
import { STATUS } from "../../appointment/appointment.entitiy.js";
import Brand from "../../car/brand/brand.entity.js";
import CarModel from "../../car/model/model.entity.js";
import Piece from "../../inventory/piece/piece.entity.js";
import Supplier from "../../inventory/supplier/supplier.entity.js";

<<<<<<< HEAD
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/your_database";
=======
const MONGO_URI = process.env.MONGO_URI ;
>>>>>>> 3d0e2fc99d6927677f82e5f0767749741fceb53b

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
        console.log(
          `Service ${serviceName} créé dans la catégorie ${categoryName}`,
        );
      }
    }
  }
}

async function createCarBrands() {
<<<<<<< HEAD
  const brandsData = ["Renault", "Peugeot", "Citroen", "Volkswagen", "Toyota"];
  const brandDocs = {};
=======
    const brandsData = [
        "Renault",
        "Peugeot",
        "Citroen",
        "Volkswagen",
        "Toyota",
        "BMW",
        "Mercedes-Benz",
        "Audi",
        "Ford",
        "Nissan",
        "Fiat",
        "Hyundai",
        "Kia",
        "Opel"
    ];
    const brandDocs = {};
>>>>>>> 3d0e2fc99d6927677f82e5f0767749741fceb53b

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
<<<<<<< HEAD
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
=======
    const carModelData = [];

    const modelsByBrand = {
        Renault: ["Clio (2019)", "Megane (2020)", "Captur (2021)", "Twingo (2022)", "Arkana (2023)"],
        Peugeot: ["208 (2020)", "308 (2021)", "2008 (2022)", "3008 (2023)", "5008 (2020)"],
        Citroen: ["C3 (2021)", "C4 (2022)", "C5 Aircross (2023)", "Berlingo (2020)", "C3 Aircross (2021)"],
        Volkswagen: ["Golf (2020)", "Polo (2021)", "Tiguan (2022)", "Passat (2023)", "Taigo (2021)"],
        Toyota: ["Yaris (2020)", "Corolla (2021)", "RAV4 (2022)", "C-HR (2023)", "Aygo X (2022)"],
        BMW: ["Série 3 (2021)", "Série 5 (2022)", "X3 (2023)", "X1 (2022)", "i4 (2022)"],
        "Mercedes-Benz": ["Classe C (2021)", "Classe E (2022)", "GLC (2023)", "Classe A (2022)", "GLB (2021)"],
        Audi: ["A3 (2020)", "A4 (2021)", "Q3 (2022)", "Q5 (2023)", "A1 (2022)"],
        Ford: ["Focus (2020)", "Fiesta (2021)", "Kuga (2022)", "Puma (2023)", "Mustang Mach-E (2021)"],
        Nissan: ["Qashqai (2021)", "Juke (2022)", "X-Trail (2023)", "Micra (2020)", "Leaf (2021)"],
        Fiat: ["500 (2021)", "Panda (2022)", "Tipo (2023)", "500X (2020)", "500L (2021)"],
        Hyundai: ["Tucson (2021)", "Kona (2022)", "i20 (2023)", "i10 (2020)", "Bayon (2021)"],
        Kia: ["Sportage (2021)", "Ceed (2022)", "Niro (2023)", "Picanto (2020)", "Stonic (2021)"],
        Opel: ["Corsa (2020)", "Astra (2021)", "Mokka (2022)", "Crossland (2023)", "Grandland (2021)"]
    };

    for (const brandName in brands) {
        const brandId = brands[brandName]._id;
        const models = modelsByBrand[brandName];
        for (const model of models) {
            const [modelName, releaseYearStr] = model.split(" (");
            const releaseYear = parseInt(releaseYearStr.slice(0, 4)); // Extract year from string
            carModelData.push({
                brand: brandId,
                name: modelName,
                releaseYear: releaseYear,
            });
        }
    }

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
>>>>>>> 3d0e2fc99d6927677f82e5f0767749741fceb53b
    }
    carModelDocs.push(carModel);
  }
  return carModelDocs;
}

async function createAppointments(adminUser, services) {
  const carModels = await CarModel.find();
  if (!carModels.length) {
    console.error(
      "Aucun modèle de voiture trouvé. Vérifiez la migration des marques et modèles.",
    );
    return;
  }

  const getRandomServices = (services, count) => {
    const shuffled = [...services].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const calculateTotals = (selectedServices) => {
    const totalDuration = selectedServices.reduce(
      (sum, service) => sum + service.estimateDuration,
      0,
    );
    const totalPrice = selectedServices.reduce(
      (sum, service) => sum + service.price,
      0,
    );
    return { totalDuration, totalPrice };
  };

  const generateRandomDate = () => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
    futureDate.setHours(Math.floor(Math.random() * 9) + 8, 0, 0, 0);
    return futureDate;
  };

  const generateLicensePlate = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let plate = "";
    for (let i = 0; i < 2; i++) {
      plate += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    plate += "-";
    for (let i = 0; i < 3; i++) {
      plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    plate += "-";
    for (let i = 0; i < 2; i++) {
      plate += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return plate;
  };

  const statuses = Object.values(STATUS);
  const Appointment = mongoose.model("Appointment");

  for (let i = 0; i < 10; i++) {
    const selectedCarModel =
      carModels[Math.floor(Math.random() * carModels.length)];
    const numberOfServices = Math.floor(Math.random() * 3) + 1; // 1 à 3 services
    const selectedServices = getRandomServices(services, numberOfServices);
    const { totalDuration, totalPrice } = calculateTotals(selectedServices);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await Appointment.create({
      name: "Raselison Toky",
      email: "toky@gmail.com",
      phone: "0343061615",
      carModel: selectedCarModel._id,
      licensePlate: generateLicensePlate(),
      services: selectedServices.map((service) => service._id),
      scheduleAt: generateRandomDate(),
      estimateDuration: totalDuration,
      estimatedPrice: totalPrice,
      status: status,
    });

    console.log(`Rendez-vous #${i + 1} créé avec statut ${status}`);
  }

<<<<<<< HEAD
  console.log("Tous les rendez-vous ont été créés");
=======
        return plate;
    };

    const statuses = Object.values(STATUS);
    const Appointment = mongoose.model("Appointment");

    for (let i = 0; i < 10; i++) {
        const selectedCarModel =
            carModels[Math.floor(Math.random() * carModels.length)];
        const numberOfServices = Math.floor(Math.random() * 3) + 1;
        const selectedServices = getRandomServices(services, numberOfServices);
        const { totalDuration, totalPrice } = calculateTotals(selectedServices);
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await Appointment.create({
            name: "Raselison Toky",
            email: "toky@gmail.com",
            phone: "0343061615",
            carModel: selectedCarModel._id,
            licensePlate: generateLicensePlate(),
            services: selectedServices.map((service) => service._id),
            scheduleAt: generateRandomDate(),
            estimateDuration: totalDuration,
            estimatedPrice: totalPrice,
            status: status,
        });

        console.log(`Rendez-vous #${i + 1} créé avec statut ${status}`);
    }

    console.log("Tous les rendez-vous ont été créés");
>>>>>>> 3d0e2fc99d6927677f82e5f0767749741fceb53b
}

const createPieces = async (numRecords = 10) => {
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

  for (let i = 0; i < numRecords; i++) {
    const partName = vehicleParts[i];
    await Piece.create({
      name: partName, // Nom de la pièce spécifique
      reference: faker.string.uuid(), // Référence unique pour chaque pièce
      description: faker.commerce.productDescription(), // Description générée aléatoirement
      unit_price: parseFloat(faker.commerce.price(10, 1000, 2)), // Prix entre 10 et 1000
      stock_quantity: faker.number.int({ min: 1, max: 50 }), // Quantité en stock
      alert_threshold: 5, // Seuil d'alerte pour stock faible
      last_updated: new Date(), // Date actuelle
    });
  }

  console.log(`${numRecords} pièces de véhicules créées avec succès !`);
};

const createFakePieces = async (numRecords = 10) => {
<<<<<<< HEAD
  const pieces = [];
  for (let i = 0; i < numRecords; i++) {
    const piece = new Piece({
      name: faker.commerce.productName(),
      reference: faker.string.uuid(),
      description: faker.commerce.productDescription(),
      unit_price: parseFloat(faker.commerce.price()),
      stock_quantity: faker.number.int({ min: 0, max: 100 }),
      alert_threshold: faker.number.int({ min: 1, max: 10 }),
      last_updated: faker.date.recent(),
    });
    pieces.push(piece);
  }
};

async function runMigrations() {
  try {
    await connectDB();
    const roles = await createRoles();
    const adminUser = await createAdminUser(roles);
    const categories = await createCategories();
    await createServices(categories);
    const brands = await createCarBrands();
    await createCarModels(brands);

    await createAppointments(adminUser, await Service.find());
    await createPieces();
    // await createSuppliers();
    // await createFakePieces();
    console.log("Toutes les migrations ont été exécutées avec succès");
  } catch (error) {
    console.error("Erreur lors de la migration", error);
  } finally {
    await closeDB();
  }
=======
    const pieces = [];
    for (let i = 0; i < numRecords; i++) {
        const piece = new Piece({
            name: faker.commerce.productName(),
            reference: faker.string.uuid(),
            description: faker.commerce.productDescription(),
            unit_price: parseFloat(faker.commerce.price()),
            stock_quantity: faker.number.int({ min: 0, max: 100 }),
            alert_threshold: faker.number.int({ min: 1, max: 10 }),
            supplier_id: mongoose.Types.ObjectId(),
            last_updated: faker.date.recent(),
        });
        pieces.push(piece);
    }
};

async function runMigrations() {
    try {
        await connectDB();
        const roles = await createRoles();
        const adminUser = await createAdminUser(roles);
        await createMechanics(roles);
        const categories = await createCategories();
        await createServices(categories);
        const brands = await createCarBrands();
        await createCarModels(brands);
        await createAppointments(adminUser, await Service.find());
        await createSuppliers();
        // await createFakePieces();
        console.log("Toutes les migrations ont été exécutées avec succès");
    } catch (error) {
        console.error("Erreur lors de la migration", error);
    } finally {
        await closeDB();
    }
>>>>>>> 3d0e2fc99d6927677f82e5f0767749741fceb53b
}

runMigrations().then();
