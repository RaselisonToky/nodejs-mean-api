import { Router } from 'express';
import deliveryController from './delivery.controller.js';

const router = Router();

// POST /api/deliveries - Create a new delivery
router.post('/', deliveryController.createDelivery);

// GET /api/deliveries - Get all deliveries (with pagination)
router.get('/', deliveryController.getAllDeliveries);

// GET /api/deliveries/:id - Get a single delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// PUT /api/deliveries/:id - Update a delivery by ID
router.put('/:id', deliveryController.updateDelivery);

// DELETE /api/deliveries/:id - Delete a delivery by ID
router.delete('/:id', deliveryController.deleteDelivery);

export default router;