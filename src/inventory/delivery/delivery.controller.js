import mongoose from 'mongoose';
import deliveryService from './delivery.service.js';
class DeliveryController {

    /**
     * Handle POST /deliveries
     */
    async createDelivery(req, res) {
        try {
            // Basic validation (more robust validation recommended)
            if (!req.body.order_id || !req.body.details || !Array.isArray(req.body.details) || req.body.details.length === 0) {
                return res.status(400).json({ success: false, message: "order_id and details array are required." });
            }
            const newDelivery = await deliveryService.create(req.body);
            res.status(201).json({ success: true, data: newDelivery });
        } catch (error) {
            console.error("Controller Error - createDelivery:", error);
            // Check for Mongoose validation errors
            if (error.name === 'ValidationError') {
                return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
            }
            res.status(500).json({ success: false, message: "Failed to create delivery.", error: error.message });
        }
    }

    /**
     * Handle GET /deliveries
     */
    async getAllDeliveries(req, res) {
        try {
            const result = await deliveryService.getAll(req.query); // Pass query params for pagination
            res.status(200).json({ success: true, ...result }); // Spread data and pagination
        } catch (error) {
            console.error("Controller Error - getAllDeliveries:", error);
            res.status(500).json({ success: false, message: "Failed to retrieve deliveries.", error: error.message });
        }
    }

    /**
     * Handle GET /deliveries/:id
     */
    async getDeliveryById(req, res) {
        try {
            const deliveryId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
                return res.status(400).json({ success: false, message: "Invalid Delivery ID format." });
            }

            const delivery = await deliveryService.getById(deliveryId);
            if (!delivery) {
                return res.status(404).json({ success: false, message: "Delivery not found." });
            }
            res.status(200).json({ success: true, data: delivery });
        } catch (error) {
            console.error("Controller Error - getDeliveryById:", error);
            if (error.name === 'CastError') { // Catch specific cast errors just in case
                return res.status(400).json({ success: false, message: `Invalid ID format: ${req.params.id}` });
            }
            res.status(500).json({ success: false, message: "Failed to retrieve delivery.", error: error.message });
        }
    }

    /**
     * Handle PUT /deliveries/:id
     */
    async updateDelivery(req, res) {
        try {
            const deliveryId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
                return res.status(400).json({ success: false, message: "Invalid Delivery ID format." });
            }
            // Prevent updating certain fields if necessary (e.g., order_id)
            // delete req.body.order_id;

            const updatedDelivery = await deliveryService.update(deliveryId, req.body);
            if (!updatedDelivery) {
                return res.status(404).json({ success: false, message: "Delivery not found." });
            }
            res.status(200).json({ success: true, data: updatedDelivery });
        } catch (error) {
            console.error("Controller Error - updateDelivery:", error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
            }
            res.status(500).json({ success: false, message: "Failed to update delivery.", error: error.message });
        }
    }

    /**
     * Handle DELETE /deliveries/:id
     */
    async deleteDelivery(req, res) {
        try {
            const deliveryId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
                return res.status(400).json({ success: false, message: "Invalid Delivery ID format." });
            }

            const deletedDelivery = await deliveryService.delete(deliveryId);
            if (!deletedDelivery) {
                return res.status(404).json({ success: false, message: "Delivery not found." });
            }
            // Send back confirmation or the deleted object
            res.status(200).json({ success: true, message: "Delivery deleted successfully.", data: deletedDelivery });
            // Or res.sendStatus(204); // No Content
        } catch (error) {
            console.error("Controller Error - deleteDelivery:", error);
            res.status(500).json({ success: false, message: "Failed to delete delivery.", error: error.message });
        }
    }
}

export default new DeliveryController();