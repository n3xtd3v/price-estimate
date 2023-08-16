const mssql = require("mssql");

const itemPriceCtrl = {
  getItemsPrice: async (req, res) => {
    try {
      const itemType = req.params.itemType;

      const items = await mssql.query`
        exec pMP_get_item_price_by_type_and_search ${itemType}
      `;

      return res.status(200).json({ items });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = itemPriceCtrl;
