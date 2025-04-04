import { Router } from "express";
import transactionController from "./transaction.controller.js";

const router = new Router();

router.get("/", transactionController.getAll);
router.get("/search", transactionController.search);
router.get("/:id", transactionController.getById);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.delete);

export default router;