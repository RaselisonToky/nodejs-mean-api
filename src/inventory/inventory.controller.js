import inventoryService from "./inventory.service.js";

class InventoryController {
  async getAll(req, res) {
    try {
      const inventories = await inventoryService.getAll();
      res.status(200).json({
        success: true,
        data: inventories,
        rowCounts: inventories.length,
      });
    } catch (e) {
      res.status(400).json({
        message: "Erreur lors de la récupération des inventaires",
        origin: e.message,
        timestamp: Date.now(),
      });
    }
  }

  async getById(req, res) {
    try {
      const inventory = await inventoryService.getById(req.params.id);
      if (!inventory) return res.status(404).json({ message: "Inventaire non trouvé" });
      res.status(200).json(inventory);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      // Calcul automatique de la différence si non fournie
      if (req.body.counted_quantity !== undefined && 
          req.body.recorded_quantity !== undefined && 
          req.body.difference === undefined) {
        req.body.difference = req.body.counted_quantity - req.body.recorded_quantity;
      }
      
      const newInventory = await inventoryService.create(req.body);
      res.status(201).json(newInventory);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      // Mise à jour automatique de la différence si les quantités sont modifiées
      if ((req.body.counted_quantity !== undefined || req.body.recorded_quantity !== undefined) && 
          req.body.difference === undefined) {
        const inventory = await inventoryService.getById(req.params.id);
        if (!inventory) return res.status(404).json({ message: "Inventaire non trouvé" });
        
        const counted = req.body.counted_quantity !== undefined ? 
                        req.body.counted_quantity : 
                        inventory.counted_quantity;
        
        const recorded = req.body.recorded_quantity !== undefined ? 
                         req.body.recorded_quantity : 
                         inventory.recorded_quantity;
        
        req.body.difference = counted - recorded;
      }
      
      const updatedInventory = await inventoryService.update(req.params.id, req.body);
      if (!updatedInventory) return res.status(404).json({ message: "Inventaire non trouvé" });
      res.status(200).json(updatedInventory);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedInventory = await inventoryService.delete(req.params.id);
      if (!deletedInventory) return res.status(404).json({ message: "Inventaire non trouvé" });
      res.status(200).json({ message: "Inventaire supprimé avec succès" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async search(req, res) {
    try {
      const results = await inventoryService.search(req.body);
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

export default new InventoryController();
