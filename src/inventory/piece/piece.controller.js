import pieceService from "./piece.service.js";

class PieceController {
  async getAll(req, res) {
    try {
      console.log("Retrieving all pieces");
      const pieces = await pieceService.getAll();
      res.status(200).json({
        succes: true,
        data: pieces,
        rowCounts: pieces.length,
      });
    } catch (e) {
      res.status(400).json({
        message: "Erreur lors du récuperation des pieces",
        origin: e.message,
        timestamp: Date.now()
      });
    }
  }


  async getById(req, res) {
    try {
      const piece = await pieceService.getById(req.params.id);
      if (!piece) return res.status(404).json({ message: "Piece not found" });
      res.status(200).json(piece);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newPiece = await pieceService.create(req.body);
      res.status(201).json(newPiece);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedPiece = await pieceService.update(req.params.id, req.body);
      if (!updatedPiece) return res.status(404).json({ message: "Piece not found" });
      res.status(200).json(updatedPiece);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedPiece = await pieceService.delete(req.params.id);
      if (!deletedPiece) return res.status(404).json({ message: "Piece not found" });
      res.status(200).json({ message: "Piece deleted successfully" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new PieceController();
