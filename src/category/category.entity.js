import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    backgroundColor: { type: String, default: '#f0f0f0' },
    borderColor: { type: String, default: '#ccc' },
    color: { type: String, default: '#000' }
});

export const Category = mongoose.model('Category', CategorySchema);
export default Category;
