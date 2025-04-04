import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
    part_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece",
        required: true,
    },
    type: { type: String, enum: ["IN", "OUT"], required: true }, // IN = restock, OUT = used in repair
    quantity: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    related_order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SupplierOrder",
    },
    prix_unitaire: { type: Number, required: true },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
