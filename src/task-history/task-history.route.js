import {Router} from "express";
import taskHistoryController from "./task-history.controller.js";

const router = Router();

router.post('/', taskHistoryController.getAll)

export default router;
