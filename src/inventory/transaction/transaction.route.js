import { Router } from "express";
import transactionController from "./transaction.controller.js";

const router = new Router();

router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.delete);
router.post("/search", transactionController.search);

export default router;