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
  async search(criteria) {
    let query = {};

    if (criteria.name) query.name = new RegExp(criteria.name, "i");
    if (criteria.reference) query.reference = new RegExp(criteria.reference, "i");
    if (criteria.category_id) query.category_id = criteria.category_id;

    return await Piece.find(query).populate("category_id", "name");
  }
  async updateCmup(id, cmup) {
    return await Piece.findByIdAndUpdate(id, { $inc: { unit_price: cmup } }, { new: true });
  }

  async updateStock(id, quantity) {
    return await Piece.findByIdAndUpdate(id, { $inc: { stock_quantity: quantity } }, { new: true });
  }
}

export default new PieceService();
