import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    part_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
        required: true,
    },
    counted_quantity: { type: Number, required: true },
    recorded_quantity: { type: Number, required: true },
    audit_date: { type: Date, default: Date.now },
    difference: { type: Number, required: true },
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
