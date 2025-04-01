import pieceCategorieService from "./piece-categorie.service.js";
class PieceCategoryController {
    async getAll(req, res) {
        try {
            const categories = await pieceCategorieService.getAll();
            res.status(200).json(categories);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async getById(req, res) {
        try {
            const category = await pieceCategorieService.getById(req.params.id);
            if (!category) return res.status(404).json({ message: "Category not found" });
            res.status(200).json(category);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async create(req, res) {
        try {
            const newCategory = await pieceCategorieService.create(req.body);
            res.status(201).json(newCategory);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async update(req, res) {
        try {
            const updatedCategory = await pieceCategorieService.update(req.params.id, req.body);
            if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
            res.status(200).json(updatedCategory);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedCategory = await pieceCategorieService.delete(req.params.id);
            if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

export default new PieceCategoryController();