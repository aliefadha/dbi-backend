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
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, role, user.email, roleName);
    } // finance
    else if(role == 2){
      let roleName = "Finance";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, role, user.email, roleName);
    } // manager
    else if(role == 3){
      let roleName = "Manager";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, role, user.email, roleName);
    } // spv
    else if(role == 4){
      let roleName = "SPV";
      let user = await Toko.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.toko_id, role, user.email, roleName);
    } // head gudang
    else if(role == 5){
      let roleName = "Head Gudang";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, role, user.email, roleName);
    } // admin gudang
    else if(role == 6){
      let roleName = "Admin Gudang";
      let user = await Authentication.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.authentication_id, role, user.email, roleName);
    } // kasir
    else if(role == 7){
      const roleName = "Kasir";
      let user = await Cabang.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");
      
      return this.generateToken(user.cabang_id, role, user.email, roleName);
    } // karyawan umum
    else if(role == 8){
      const roleName = "Karyawan Umum";
      let user = await Karyawan.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, role, user.email, roleName);
    }
    else if (role == 9) {
      const roleName = "Karyawan Logistik";
      let user = await Karyawan.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, role, user.email, roleName);
    }
    else if (role == 10) {
      const roleName = "Karyawan Produksi";
      let user = await Karyawan.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, role, user.email, roleName);
    }
    else if (role == 11) {
      const roleName = "Karyawan Transportasi";
      let user = await Karyawan.findOne({where: {email: email}});
      if(!user) throw new Error("Invalid email or password");
      let valid = compare(password, user.password);
      if(!valid) throw new Error("Invalid email or password");

      return this.generateToken(user.karyawan_id, role, user.email, roleName);
    }
  }
  
  static async generateToken(userId, roleId, userEmail, roleName) {
    const payload = {
        userId: userId,
        roleId: roleId,
        email: userEmail,
        role_name: roleName
    };
    // console.log(`JWT_SECRET_KEY: ${process.env.JWT_SECRET_KEY}`);
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    return {
        userId: userId,
        role_id: roleId,
        role_name: roleName,
        email: userEmail,
        token: token
    };
  }
}  
  
module.exports = AuthenticationService;  
