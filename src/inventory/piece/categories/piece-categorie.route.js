import { Router } from "express";
import pieceCategorieController from "./piece-categorie.controller.js";

const router = new Router();

router.get("/", pieceCategorieController.getAll);
router.get("/:id", pieceCategorieController.getById);
router.post("/", pieceCategorieController.create);
router.put("/:id", pieceCategorieController.update);
router.delete("/:id", pieceCategorieController.delete);

export default router;
