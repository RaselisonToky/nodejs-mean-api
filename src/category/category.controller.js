import categoryService from "./category.service.js";
import serviceService from "../service/service.service.js";

class CategoryController{
    async getAll(req, res){
        try{
            const category = await categoryService.getAll();
            res.json({
                success: true,
                data: category,
                count: category.length
            })
        }catch (error){
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des categories', error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const category = await categoryService.getById(req.params.id);
            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du category', error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newCategory = await categoryService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Category créée avec succès',
                data: newCategory
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la création du Category',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const updatedCategory = await categoryService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Category mise à jour avec succès',
                data: updatedCategory
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la mise à jour du category',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            await categoryService.deleteById(req.params.id);
            res.json({
                success: true,
                message: 'Category supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du category',
                error: error.message
            });
        }
    }

    async finishedServiceCountByCategory(req, res){
        try{
            const data = await categoryService.finishedServiceCountByCategory(req.query.startDate, req.query.endDate);
            res.json({
                success: true,
                data,
                count: data.length
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récuperation des services groupées par category',
                error: error.message
            })
        }
    }
}
export default new CategoryController();
