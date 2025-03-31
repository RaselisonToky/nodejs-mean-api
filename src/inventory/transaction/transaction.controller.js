import transactionService from "./transaction.service.js";

class TransactionController {
  async getAll(req, res) {
    try {
      const transactions = await transactionService.getAll();
      res.status(200).json({
        success: true,
        data: transactions,
        rowCounts: transactions.length,
      });
    } catch (e) {
      res.status(400).json({
        message: "Erreur lors de la récupération des transactions",
        origin: e.message,
        timestamp: Date.now(),
      });
    }
  }

  async getById(req, res) {
    try {
      const transaction = await transactionService.getById(req.params.id);
      if (!transaction) return res.status(404).json({ message: "Transaction non trouvée" });
      res.status(200).json(transaction);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newTransaction = await transactionService.create(req.body);
      res.status(201).json(newTransaction);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedTransaction = await transactionService.update(req.params.id, req.body);
      if (!updatedTransaction) return res.status(404).json({ message: "Transaction non trouvée" });
      res.status(200).json(updatedTransaction);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedTransaction = await transactionService.delete(req.params.id);
      if (!deletedTransaction) return res.status(404).json({ message: "Transaction non trouvée" });
      res.status(200).json({ message: "Transaction supprimée avec succès" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async search(req, res) {
    try {
      const results = await transactionService.search(req.body);
      res.status(200).json({
        success: true,
        data: results,
        rowCounts: results.length,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new TransactionController();

