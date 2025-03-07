import Brand from './brand.entity.js';

class BrandService {
    async getAll()  {
        return Brand.find().sort({name: 1});
    }

    async getById(id) {
        return Brand.findById(id);
    }

    async create(brandData) {
        const newBrand = new Brand(brandData);
        return await newBrand.save();
    }

    async update(id, brandData){
        return Brand.findByIdAndUpdate(id, brandData);
    }

    async deleteById(id)  {
        return Brand.findByIdAndDelete(id);
    }
}

export default new BrandService();
