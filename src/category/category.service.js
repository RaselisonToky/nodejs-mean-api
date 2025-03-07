import Category from "./category.entity.js";

class CategoryService{
    async getAll(){
        return Category.find();
    }

    async getById(id){
        const category = Category.findById(id);
        if (!category){
            throw new Error("Categorie non trouvée");
        }
        return category;
    }

    async create(categoryData){
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    }

    async update(id, categoryData){
        return Category.findByIdAndUpdate(id, categoryData);
    }

    async deleteById(id){
        return Category.findByIdAndDelete(id);
    }
}

export default new CategoryService();
