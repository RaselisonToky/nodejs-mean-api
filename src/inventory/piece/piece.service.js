import Piece from "./piece.entity.js";
class PieceService {
  async getAll() {
    return await Piece.find();
  }
  
  async getById(id) {
    return await Piece.findById(id);
  }

  async create(data) {
    return await Piece.create(data);
  }

  async update(id, data) {
    return await Piece.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Piece.findByIdAndDelete(id);
  }
}

export default new PieceService();
