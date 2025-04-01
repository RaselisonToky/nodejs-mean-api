import mongoose from "mongoose";

// Modèle de catégorie de pièces
const PieceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

const PieceCategory = mongoose.model("PieceCategory", PieceCategorySchema);
export default PieceCategory;