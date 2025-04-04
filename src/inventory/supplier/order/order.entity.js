import { CANCELLED } from "dns";
import mongoose from "mongoose";

export const SUPPLIER_ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'PARTIALLY_DELIVERED',
    CANCELLED: 'CANCELLED',
    DELIVERED: 'DELIVERED',
};

const SupplierOrderSchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    order_date: { type: Date, default: Date.now },
    ticket_number: { type: String, required: true },
    items: [
        {
            part_id: { type: mongoose.Schema.Types.ObjectId, ref: "Piece", required: true },
            quantity: { type: Number, required: true },
            unit_price: { type: Number, required: true },
            delivered_quantity: { type: Number, default: 0 },
        }
    ],
    total_amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(SUPPLIER_ORDER_STATUS), default: SUPPLIER_ORDER_STATUS.PENDING },
});

const SupplierOrder = mongoose.model("SupplierOrder", SupplierOrderSchema);
export default SupplierOrder
