import {Router} from "express";
import taskController from "./task.controller.js";

const router = Router();

router.post('/', taskController.upsertMany);
router.get('/:id', taskController.findTasksByAppointmentId);

export default router;
