import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
    part_id: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
    type: { type: String, enum: ["IN", "OUT"], required: true }, // IN = restock, OUT = used in repair
    quantity: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    related_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupplierOrder" }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
