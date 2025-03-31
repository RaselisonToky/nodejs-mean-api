import { Router } from "express";
import supplierOrderController from "./supplierOrder.controller.js";

const router = new Router();

router.get("/", supplierOrderController.getAll);
router.get("/:id", supplierOrderController.getById);
router.post("/", supplierOrderController.create);
router.put("/:id", supplierOrderController.update);
router.delete("/:id", supplierOrderController.delete);
router.post("/search", supplierOrderController.search);

export default router;