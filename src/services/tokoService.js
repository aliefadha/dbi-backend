const Toko = require("../models/toko");  
  
class TokoService {  
  static async create(data) {  
    try {
      const exsistingToko = await Toko.findOne({
        where: {
          email: data.email
        }
      })
      if (exsistingToko) {
        throw new Error("Email already exists");
      }
      const toko = await Toko.create(data);
      return toko;
    } catch (error) {
      throw error;
    }
  }  
  
  static async getAll() {  
    return await Toko.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await Toko.findOne({
      where: {
        toko_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const toko = await Toko.findByPk(id);  
    // const emailToko = await Toko.findOne({
    //   where: {
    //     email: data.email
    //   }
    // })
    // if(emailToko) throw new Error("Email already exists");
    if (!toko) return null;  
  
    Object.assign(toko, data);  
    await toko.save();  
  
    return toko;  
  }  
  
  static async delete(id) {  
    const toko = await Toko.findByPk(id);  
    if (!toko) return null;  
    await toko.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = TokoService;  
