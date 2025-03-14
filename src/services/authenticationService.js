const Authentication = require("../models/authentication");  
const Cabang = require("../models/cabang");
const Karyawan = require("../models/karyawan");
const Toko = require("../models/toko");
const { compare } = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
  
class AuthenticationService {  
  static async login(email, password, role) {
    // owner
    if(role == 1){
      let roleName = "Owner";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, null, role, user.email, roleName, user.image);
    } // finance
    else if(role == 2){
      let roleName = "Finance";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, null, role, user.email, roleName, user.image);
    } // manager
    else if(role == 3){
      let roleName = "Manager";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, null, role, user.email, roleName, user.image);
    } // spv
    else if(role == 4){
      let roleName = "SPV";
      let user = await Toko.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.toko_id, null, role, user.email, roleName, user.image);
    } // head gudang
    else if(role == 5){
      let roleName = "Head Gudang";
      let user = await Toko.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.toko_id, null, role, user.email, roleName, user.image);
    } // admin gudang
    else if(role == 6){
      let roleName = "Admin Gudang";
      let user = await Cabang.findOne({where: {email: email}});
      let toko = await Toko.findOne({where: {toko_id: user.toko_id}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.cabang_id, null, role, user.email, roleName, toko.image);
    } // kasir
    else if(role == 7){
      const roleName = "Kasir";
      let user = await Cabang.findOne({where: {email: email}});
      let toko = await Toko.findOne({where: {toko_id: user.toko_id}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.cabang_id, user.toko_id, role, user.email, roleName, toko.image);
    } // karyawan umum
    else if(role == 8){
      const roleName = "Karyawan Umum";
      let user = await Karyawan.findOne({where: {email: email, jenis_karyawan: "Umum"}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, user.toko_id, role, user.email, roleName, user.image);
    }
    else if (role == 10) {
      const roleName = "Karyawan Produksi";
      let user = await Karyawan.findOne({where: {email: email, jenis_karyawan: "Produksi"}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, user.toko_id, role, user.email, roleName, user.image);
    }
    else if (role == 11) {
      const roleName = "Karyawan Transportasi";
      let user = await Karyawan.findOne({where: {email: email, jenis_karyawan: "Transportasi"}});
      if(!user) throw new Error("Invalid email or password");
      let valid = await compare(password, user.password); // Await the comparison
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, user.toko_id, role, user.email, roleName, user.image);
    }
  }
  
  static async generateToken(userId, toko_id, roleId, userEmail, roleName, image) {
    const payload = {
        userId: userId,
        roleId: roleId,
        email: userEmail,
        roleName: roleName
    };

    if (toko_id) {
        payload.tokoId = toko_id;
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    const response = {
        userId: userId,
        roleId: roleId,
        roleName: roleName,
        image: image,
        email: userEmail,
        token: token
    };

    if (toko_id) {
        response.tokoId = toko_id;
    }

    return response;
  }

  static async getById(id) {
    return await Authentication.findOne({ where: { authentication_id: id } });
  }

  static async update(id, data) {
    try {
        const authentication = await Authentication.findByPk(id);
        if (!authentication) return null;
        if (data.email) {
            const existingUser = await Authentication.findOne({ where: { email: data.email } });
            // return existingUser;
            if (existingUser && existingUser.authentication_id != id) {
                throw new Error('Email already exists');
            }
        }

        Object.assign(authentication, data);
        await authentication.save();
        return authentication;
    } catch (error) {
        throw error;
    }
  }

  static async getAll() {
    return await Authentication.findAll();
  }
}  
  
module.exports = AuthenticationService;