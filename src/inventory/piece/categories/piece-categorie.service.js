import PieceCategory from "./piece-categorie.entity.js";
class PieceCategoryService {
    async getAll() {
        return await PieceCategory.find();
    }

    async getById(id) {
        return await PieceCategory.findById(id);
    }

    async create(data) {
        return await PieceCategory.create(data);
    }

    async update(id, data) {
        return await PieceCategory.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await PieceCategory.findByIdAndDelete(id);
    }
}

export default new PieceCategoryService();
