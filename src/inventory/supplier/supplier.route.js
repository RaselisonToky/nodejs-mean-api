import { Router } from "express";
import supplierController from "./supplier.controller.js";

const router = new Router();

router.get("/", supplierController.getAll);
router.get("/:id", supplierController.getById);
router.post("/", supplierController.create);
router.put("/:id", supplierController.update);
router.delete("/:id", supplierController.delete);
router.post("/search", supplierController.search);

export default router;