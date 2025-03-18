import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String },
    created_at: { type: Date, default: Date.now },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;
