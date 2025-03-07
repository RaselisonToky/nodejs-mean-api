import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.entity.js';
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

async function createUser(firstname, lastname, username, email, password, roles) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            roles
        });
        return await newUser.save();
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur dans le service:", error);
        throw error;
    }
}

async function authenticateUser(username, password) {
    try {
        const user = await User.findOne({ username }).populate('roles'); // Populate the roles array
        if (!user) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        return user;
    } catch (error) {
        console.error("Erreur lors de l'authentification dans le service:", error);
        throw error;
    }
}

function generateToken(user) {
    const payload = {
        userId: user._id,
        email: user.email,
        roles: user.roles.map(role => role.name)
    };
    const options = {
        expiresIn: '10h'
    };
    return jwt.sign(payload, jwtSecret, options);
}

export default {
    createUser,
    authenticateUser,
    generateToken
};
