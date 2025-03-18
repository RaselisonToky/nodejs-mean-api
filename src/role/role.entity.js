import mongoose from 'mongoose';

export const ROLES = {
    USER: 'USER',
    MECHANIC: 'MECHANIC',
    ADMIN: 'ADMIN',
};

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: Object.values(ROLES),
    },
    description: {
        type: String
    }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
