import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, default: 0 },
    estimateDuration: { type: Number, default: 0 }
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;

