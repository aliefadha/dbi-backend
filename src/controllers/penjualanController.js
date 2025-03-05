const CabangService = require("../services/cabangService");
const CustomIdGenerateService = require("../services/customIdGenerateService");
const PenjualanService = require("../services/penjualanService");  
  
class PenjualanController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generatePenjualanId();
      const penjualanData = {
        ...req.body,
        penjualan_id: newId
      }
      const penjualan = await PenjualanService.create(penjualanData);  
      res.status(201).json({  
        success: true,  
        data: penjualan,  
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
      const {bulan, tahun, cabang, toko_id} = req.query;
      const penjualans = await PenjualanService.getAll(bulan, tahun, cabang, toko_id);  
      res.status(200).json({  
        success: true,  
        data: penjualans,  
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
      const penjualan = await PenjualanService.getById(req.params.id);  
      if (!penjualan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualan,  
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

  static async getTimeFrequencyToko(req, res) {  
    try {  
      const {toko_id, cabang_id, startDate, endDate} = req.query;

      if (cabang_id) {
        await CabangService.cabangCheck(cabang_id, toko_id);
      }

      const penjualan = await PenjualanService.getTimeFrequencyToko(toko_id, startDate, endDate, cabang_id);  
      if (!penjualan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualan,  
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
      const penjualan = await PenjualanService.update(req.params.id, req.body);  
      if (!penjualan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualan,  
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
      const deleted = await PenjualanService.delete(req.params.id);  
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

  static async getInvoice(req, res) {  
    try {  
      const invoiceData = await PenjualanService.getInvoice(req.params.id);  
      if (!invoiceData) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      // return res.status(200).send(invoiceData);
      const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 12px;
                  width: 270px;
                  margin: 10px auto;
                  padding: 5px;
              }
              .receipt-container {
                  width: 100%;
                  white-space: pre-line;
              }
              .header {
                  text-align: center;
                  margin-bottom: 5px;
              }
              .store-logo {
                  width: 150px;
                  height: auto;
                  margin: 0 auto 2px;
                  display: block;
              }
              .divider {
                  overflow: hidden;
                  white-space: nowrap;
                  margin: 4px 0;
                  letter-spacing: 1px;
              }
              .items {
                  margin: 4px 0;
              }
              .item-line {
                  display: flex;
                  justify-content: space-between;
                  margin: 1px 0;
              }
              .item-code-name {
                  flex: 1;
              }
              .item-qty {
                  width: 30px;
                  text-align: right;
                  padding-right: 10px;
              }
              .item-price {
                  width: 60px;
                  text-align: right;
              }
              .totals {
                  margin: 4px 0;
              }
              .total-line {
                  display: flex;
                  justify-content: flex-end;
                  margin: 1px 0;
                  gap: 20px;
              }
              .total-label {
                  text-align: right;
              }
              .total-value {
                  width: 60px;
                  text-align: right;
              }
              .footer {
                  text-align: center;
                  margin-top: 4px;
                  font-size: 11px;
                  line-height: 1.2;
              }
              .store-info {
                  line-height: 1.2;
              }
          </style>
      </head>
      <body onload="window.print()">
          <div class="receipt-container">
              <div class="header">
                  <img src="${invoiceData.logoUrl}" alt="Store Logo" class="store-logo">
                  <div class="store-info">
                      <div>${invoiceData.address}</div>
                  </div>
              </div>

              <div class="divider">--------------------------------</div>

              <div class="items">
                  ${invoiceData.items.map(item => `
                      <div class="item-line">
                          <span class="item-code-name">${item.code}- ${item.name}</span>
                          <span class="item-qty">x ${item.qty}</span>
                          <span class="item-price">Rp${item.price ? item.price.toLocaleString() : '0'}</span>
                      </div>
                  `).join('')}
              </div>

              <div class="divider">--------------------------------</div>

              <div class="totals">
                  <div class="total-line">
                      <span class="total-label">Total Item</span>
                      <span class="total-value">${invoiceData.totalItems}</span>
                  </div>
                  <div class="total-line">
                      <span class="total-label">Qty</span>
                      <span class="total-value">${invoiceData.totalQty}</span>
                  </div>
                  <div class="total-line">
                      <span class="total-label">Subtotal</span>
                      <span class="total-value">Rp${invoiceData.subtotal ? invoiceData.subtotal.toLocaleString() : '0'}</span>
                  </div>
                  <div class="total-line">
                      <span class="total-label">Diskon Keseluruhan</span>
                      <span class="total-value">${invoiceData.discount}%</span>
                  </div>
                  <div class="total-line">
                      <span class="total-label">Pajak</span>
                      <span class="total-value">Rp${invoiceData.tax ? invoiceData.tax.toLocaleString() : '0'}</span>
                  </div>
                  <div class="total-line">
                      <span class="total-label">Total Penjualan</span>
                      <span class="total-value">Rp${invoiceData.total ? invoiceData.total.toLocaleString() : '0'}</span>
                  </div>
              </div>

              <div class="divider">--------------------------------</div>

              <div class="footer">
                  <div>${invoiceData.invoiceNumber} - ${invoiceData.date} - ${invoiceData.time}</div>
                  <div>Terimakasih Telah Berbelanja di Tatitatu!</div>
                  <div>Follow Us On Instagram ${invoiceData.instagram}</div>
              </div>
          </div>
      </body>
      </html>
    `;

    res.type('html');
    res.send(invoiceHtml);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
  }  
}
module.exports = PenjualanController;
