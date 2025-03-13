import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.entity.js';
import dotenv from "dotenv";
import Role from "../role/role.entity.js";

dotenv.config();

class UserService {
    constructor() {
        this.saltRounds = 10;
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async getUsersByRole(roleName) {
        try {
            const role = await Role.findOne({ name: roleName });
            return await User.find({roles: role._id}).populate('roles');
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs par rôle:", error);
            throw error;
        }
    }

    async createUser(firstname, lastname, username, email, password, roles) {
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
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

    async authenticateUser(username, password) {
        try {
            const user = await User.findOne({ username }).populate('roles');
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

    generateToken(user) {
        const payload = {
            userId: user._id,
            email: user.email,
            roles: user.roles.map(role => role.name)
        };
        const options = {
            expiresIn: '10h'
        };
        return jwt.sign(payload, this.jwtSecret, options);
    }
}

export default new UserService();
