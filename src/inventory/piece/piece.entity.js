import mongoose from "mongoose";
const PieceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, unique: true, required: true },
  description: { type: String },
  unit_price: { type: Number, required: true },
  stock_quantity: { type: Number, required: true, default: 0 },
  alert_threshold: { type: Number, default: 5 }, // Alert when stock is low
  last_updated: { type: Date, default: Date.now },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "PieceCategory" },
});

const Piece = mongoose.model("Piece", PieceSchema);
export default Piece;
