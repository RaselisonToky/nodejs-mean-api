import Piece from "./piece.entity.js";
class PieceService {
  async getAll() {
    return await Piece.find();
  }
}

export default new PieceService();
