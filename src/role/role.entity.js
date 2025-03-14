import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['USER', 'MECHANIC', 'ADMIN']
    },
    description: {
        type: String
    }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
