const AddonsService = require("../services/addonsService");  
  
class AddonsController {  
  static async create(req, res) {  
    try {  
      const addons = await AddonsService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: addons,  
        message: "created successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  

  static async createRincian(req, res) {  
    try {  
      const addons = await AddonsService.createRincian(req.body);  
      res.status(201).json({  
        success: true,  
        data: addons,  
        message: "created successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  

  static async createPackaging(req, res) {  
    try {  
      const addons = await AddonsService.createPackaging(req.body);  
      res.status(201).json({  
        success: true,  
        data: addons,  
        message: "created successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }
  
  static async getAll(req, res) {  
    try {  
      const addonss = await AddonsService.getAll();  
      res.status(200).json({  
        success: true,  
        data: addonss,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }

  static async getAllRincian(req, res) {  
    try {  
      const addonss = await AddonsService.getAllRincian();  
      res.status(200).json({  
        success: true,  
        data: addonss,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }
  
  static async getAllPackaging(req, res) {  
    try {  
      const addonss = await AddonsService.getAllPackaging();  
      res.status(200).json({  
        success: true,  
        data: addonss,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async getById(req, res) {  
    try {  
      const addons = await AddonsService.getById(req.params.id);  
      if (!addons) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: addons,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async update(req, res) {  
    try {  
      const addons = await AddonsService.update(req.params.id, req.body);  
      if (!addons) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: addons,  
        message: "updated successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async delete(req, res) {  
    try {  
      const deleted = await AddonsService.delete(req.params.id);  
      if (!deleted) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: null,  
        message: "deleted successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
}  
  
module.exports = AddonsController;  
