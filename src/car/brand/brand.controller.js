import { validationResult } from 'express-validator';
import carBrandService from './brand.service.js';

class BrandController {
    async getAll(req, res) {
        try {
            const brands = await carBrandService.getAll();
            res.json({
                success: true,
                data: brands,
                count: brands.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des marques', error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const brand = await carBrandService.getById(req.params.id);
            if (!brand) {
                return res.json({ success: false, message: 'Marque non trouvée' });
            }
            res.json({
                success: true,
                data: brand
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la marque', error: error.message });
        }
    }

    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        try {
            const newBrand = await carBrandService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Marque créée avec succès',
                data: newBrand
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la création de la marque',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const updatedBrand = await carBrandService.update(req.params.id, req.body);
            if (!updatedBrand) {
                return res.status(404).json({
                    success: false,
                    message: 'Marque non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Marque mise à jour avec succès',
                data: updatedBrand
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la marque',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const deletedBrand = await carBrandService.deleteById(req.params.id);
            if (!deletedBrand) {
                return res.status(404).json({
                    success: false,
                    message: 'Marque non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Marque supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la marque',
                error: error.message
            });
        }
    }
}

export default new BrandController();
