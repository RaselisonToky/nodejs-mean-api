import carModelService from "./model.service.js";
import {validationResult} from "express-validator";

class ModelController {
    async getAll(req, res){
        try{
            const models = await carModelService.getAll();
            res.json({
                success: true,
                data: models,
                count: models.length
            })
        }catch (error){
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des models', error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const model = await carModelService.getById(req.params.id);
            res.json({
                success: true,
                data: model
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du model', error: error.message });
        }
    }

    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        try {
            const newModel = await carModelService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Model créée avec succès',
                data: newModel
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la création du model',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const updatedModel = await carModelService.update(req.params.id, req.body);
            if (!updatedModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Model non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Model mise à jour avec succès',
                data: updatedModel
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la mise à jour du model',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const deletedModel = await carModelService.deleteById(req.params.id);
            if (!deletedModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Model non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Model supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du model',
                error: error.message
            });
        }
    }
}
export default new ModelController();
