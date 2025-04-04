import {Router} from "express";
import categoryController from "./category.controller.js";
import serviceController from "../service/service.controller.js";

const router = Router();

router.get('/', categoryController.getAll);
router.get('/grouped-by-category', categoryController.finishedServiceCountByCategory);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
