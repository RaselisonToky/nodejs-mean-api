import mongoose from "mongoose";


const SupplierOrderSchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    order_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Shipped", "Received", "Cancelled"], default: "Pending" },
    items: [
        {
            part_id: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
            quantity: { type: Number, required: true },
            unit_price: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model("SupplierOrder", SupplierOrderSchema);
