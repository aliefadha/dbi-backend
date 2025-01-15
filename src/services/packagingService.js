const Packaging = require("../models/packaging");

class PackagingService {
    static async getAll() {
        return await Packaging.findAll();
    }

    static async getById(id){
        return await Packaging.findByPk(id);
    }

    static async getById(id) {
        return await Packaging.findByPk(id);
      }
    
      static async update(id, data) {
        const packaging = await Packaging.findByPk(id);
        if (!packaging) return null;
    
        Object.assign(packaging, data);
        await packaging.save();
    
        return packaging;
      }
    
      static async delete(id) {
        const packaging = await Packaging.findByPk(id);
        if (!packaging) return null;
        await packaging.destroy();
        return true;
      }
}

module.exports = PackagingService;