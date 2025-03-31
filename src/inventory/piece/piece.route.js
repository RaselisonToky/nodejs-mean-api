import { Router } from "express";
import pieceController from "./piece.controller.js";

const router = new Router();

router.get("/", pieceController.getAll);
router.get("/:id", pieceController.getById);
router.post("/", pieceController.create);
router.put("/:id", pieceController.update);
router.delete("/:id", pieceController.delete);

export default router;
