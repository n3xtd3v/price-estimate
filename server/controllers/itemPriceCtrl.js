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

  searchLog: async (req, res) => {
    try {
      const { code } = req.body;
      const { UID } = req.user;

      console.log(code);

      await mssql.query`
        exec pMP_insert_search_log ${UID}, ${code}
      `;
      return res.status(200);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getItemsPriceWithFile: async (req, res) => {
    try {
      const { itemCodetoString } = req.body;

      const items = await mssql.query`
        exec pMP_get_item_price_by_file ${itemCodetoString}
      `;

      const itemsFixproperty = items.recordset.map((item) => {
        const {
          item_id,
          item_group_code,
          item_group_name_e,
          item_group_name_l,
          item_type_rcd,
          item_type_name_e,
          item_type_name_l,
          sub_item_type_name_e,
          item_name_l,
          uom_name_e,
          uom_name_l,
          ...itemFixproperty
        } = item;
        return itemFixproperty;
      });

      return res.status(200).json({ itemsFixproperty });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = itemPriceCtrl;
