import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType', required: true },
    price: { type: Number, default: 0 },
    estimateDuration: { type: Number, default: 0 }
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;

