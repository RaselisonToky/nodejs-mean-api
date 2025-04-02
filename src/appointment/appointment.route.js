import {Router} from "express";
import appointmentController from "./appointment.controller.js";

const router = Router();

router.post('/monitoring', appointmentController.getAll);
router.get('/between-dates', appointmentController.getAppointmentBetweenTwoDates);
router.get('/daily-revenue', appointmentController.getDailyRevenue);
router.get('/count-per-status', appointmentController.getAppointmentCountByStatus);
router.get('/available-time-slots/:filter_date', appointmentController.getAvailableTimeSlots);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);
export default router;
