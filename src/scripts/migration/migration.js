import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Role from '../../role/role.entity.js';
import User from '../../user/user.entity.js';
import bcrypt from "bcrypt";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database';

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connecté');
    }
}

async function closeDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('Connexion MongoDB fermée');
    }
}

async function createRoles() {
    const roles = ['USER', 'MECHANIC', 'ADMIN'];
    const roleDocs = {};

    for (const roleName of roles) {
        let role = await Role.findOne({ name: roleName });
        if (!role) {
            role = await Role.create({ name: roleName, description: `${roleName} role` });
            console.log(`Role ${roleName} créé`);
        }
        roleDocs[roleName] = role;
    }
    return roleDocs;
}

async function createAdminUser(roles) {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        await User.create({
            firstname: 'Admin',
            lastname: 'Manager',
            username: 'admin',
            email: 'admin@gmail.com',
            password: await bcrypt.hash('admin',10),
            roles: [roles['ADMIN']._id],
        });
        console.log('Utilisateur admin créé');
    } else {
        console.log('L’utilisateur admin existe déjà');
    }
}

async function runMigrations() {
    try {
        await connectDB();
        const roles = await createRoles();
        await createAdminUser(roles);
        console.log('Toutes les migrations ont été exécutées avec succès');
    } catch (error) {
        console.error("Erreur lors de la migration", error);
    } finally {
        await closeDB();
    }
}

runMigrations().then();
