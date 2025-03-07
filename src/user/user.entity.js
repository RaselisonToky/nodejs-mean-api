import mongoose from 'mongoose';
import Role from "../role/role.entity.js";

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }],
});

const User = mongoose.model('User', userSchema);
export default User;
