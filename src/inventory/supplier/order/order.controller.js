import supplierOrderService from "./order.service.js";

class SupplierOrderController {
    async getAll(req, res) {
        try {
            const orders = await supplierOrderService.getAll();
            res.status(200).json({
                success: true,
                data: orders,
                rowCounts: orders.length,
            });
        } catch (e) {
            res.status(400).json({
                message: "Erreur lors de la récupération des commandes fournisseurs",
                origin: e.message,
                timestamp: Date.now(),
            });
        }
    }

    async getById(req, res) {
        try {
            const order = await supplierOrderService.getById(req.params.id);
            if (!order) return res.status(404).json({ message: "Commande fournisseur non trouvée" });
            res.status(200).json(order);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async create(req, res) {
        try {
            const newOrder = await supplierOrderService.create(req.body);
            res.status(201).json(newOrder);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async update(req, res) {
        try {
            const updatedOrder = await supplierOrderService.update(req.params.id, req.body);
            if (!updatedOrder) return res.status(404).json({ message: "Commande fournisseur non trouvée" });
            res.status(200).json(updatedOrder);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deletedOrder = await supplierOrderService.delete(req.params.id);
            if (!deletedOrder) return res.status(404).json({ message: "Commande fournisseur non trouvée" });
            res.status(200).json({ message: "Commande fournisseur supprimée avec succès" });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async search(req, res) {
        try {
            const results = await supplierOrderService.search(req.body);
            res.status(200).json({
                success: true,
                data: results,
                rowCounts: results.length,
            });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

export default new SupplierOrderController();
