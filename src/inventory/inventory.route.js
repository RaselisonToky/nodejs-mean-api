import { Router } from "express";
import inventoryController from "./inventory.controller.js";

const router = new Router();

router.get("/", inventoryController.getAll);
router.get("/:id", inventoryController.getById);
router.post("/", inventoryController.create);
router.put("/:id", inventoryController.update);
router.delete("/:id", inventoryController.delete);
router.post("/search", inventoryController.search);

export default router;