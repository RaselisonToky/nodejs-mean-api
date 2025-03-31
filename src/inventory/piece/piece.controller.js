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
}

export default new PieceController();
