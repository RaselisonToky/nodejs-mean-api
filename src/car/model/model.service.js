import Model from "./model.entity.js";

class ModelService {
    async getAll(){
        return Model.find();
    }

    async getById(id){
        const model = Model.findById(id);
        if (!model){
            throw new Error("Marque non trouvée");
        }
        return model;
    }

    async create(modelData){
        const newCarModel = new Model(modelData);
        return await newCarModel.save();
    }

    async update(id, modelData){
        return Model.findByIdAndUpdate(id, modelData);
    }

    async deleteById(id){
        return Model.findByIdAndDelete(id);
    }
}
export default new ModelService();
