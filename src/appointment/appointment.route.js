import {Router} from "express";
import appointmentController from "./appointment.controller.js";

const router = Router();

router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);
router.get('/available-time-slots/:filter_date', appointmentController.getAvailableTimeSlots)

export default router;
