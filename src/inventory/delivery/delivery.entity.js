
import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupplierOrder", required: true },
    delivery_date: { type: Date, default: Date.now },
    bon_livraison: { type: String, required: true },
    livreur: { type: String },
    details: [
        {
            part_id: { type: mongoose.Schema.Types.ObjectId, ref: "Piece", required: true },
            quantity: { type: Number, required: true },
            unit_price: { type: Number, required: true },
        }
    ],
    total_amount: { type: Number, required: true },

});

const Delivery = mongoose.model("Delivery", DeliverySchema);
export default Delivery
