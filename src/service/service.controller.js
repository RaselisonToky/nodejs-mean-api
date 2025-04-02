import serviceService from "./service.service.js";

class ServiceController{
    async getAll(req, res){
        try{
            const services = await serviceService.getAll();
            res.json({
                success: true,
                data: services,
                count: services.length
            })
        }catch (error){
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des services', error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const service = await serviceService.getById(req.params.id);
            res.json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du service', error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newService = await serviceService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Service créée avec succès',
                data: newService
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la création du Service',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const updatedService = await serviceService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Service mise à jour avec succès',
                data: updatedService
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la mise à jour du service',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            await serviceService.deleteById(req.params.id);
            res.json({
                success: true,
                message: 'Service supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du service',
                error: error.message
            });
        }
    }
}


export default new ServiceController();
