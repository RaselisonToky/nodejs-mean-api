import { Router } from "express";
import supplierOrderController from "./order.controller.js";

const router = new Router();

router.get("/", supplierOrderController.getAll);
router.post("/search", supplierOrderController.search);
router.get("/:id", supplierOrderController.getById);
router.post("/", supplierOrderController.create);
router.put("/:id", supplierOrderController.update);
router.delete("/:id", supplierOrderController.delete);

export default router;