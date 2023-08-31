const mssql = require("mssql");
const { resStatusMsg } = require("../utils/resStatusMsg");

const templateCtrl = {
  postTemplate: async (req, res) => {
    try {
      const { UID, PE_user_Status_flag, PE_user_role_Status_flag } = req.user;

      const template = req.body.template;
      const { templateName } = template;

      let itemsType = [];
      template.charges.forEach((charge) => {
        itemsType.push(`${charge.item_code}|${charge.qty}`);
      });

      const newItemsType = itemsType.join(",");

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return resStatusMsg(res, 400, {
          msg: "Access is not allowed, please contact supervisor!",
        });
      }

      const response = await mssql.query`
          exec pMP_PE_insert_template ${templateName},${newItemsType},${UID}
      `;

      if (response.recordset?.[0].text_error) {
        return resStatusMsg(res, 400, { msg: "Template name duplicate!" });
      }

      const templates = await mssql.query`
        exec pMP_get_PE_template ${UID}
      `;

      res.json({
        msg: "Template has been created.",
        templates: templates.recordset,
      });
    } catch (err) {
      return resStatusMsg(res, 500, { msg: err.message });
    }
  },

  getTemplatesByUID: async (req, res) => {
    try {
      const { UID, PE_user_Status_flag, PE_user_role_Status_flag } = req.user;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return resStatusMsg(res, 400, {
          msg: "Access is not allowed, please contact supervisor!",
        });
      }

      const templates = await mssql.query`
        exec pMP_get_PE_template ${UID}
      `;

      res.json({ templates: templates.recordset });
    } catch (err) {
      return resStatusMsg(res, 500, { msg: err.message });
    }
  },

  getTemplateItemsDetail: async (req, res) => {
    try {
      const { PE_user_Status_flag, PE_user_role_Status_flag } = req.user;

      const { templateId } = req.params;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return resStatusMsg(res, 400, {
          msg: "Access is not allowed, please contact supervisor!",
        });
      }

      const template = await mssql.query`
        exec pMP_get_PE_template_detail ${templateId}
      `;

      const newTemplates = [];

      for (i = 0; i < template.recordset.length; i++) {
        newTemplates.push({
          isEditValue: false,
          item_code: template.recordset[i].item_code,
          item_name_e: template.recordset[i].item_name_e,
          mph_ipd: template.recordset[i].MPH_IPD,
          mph_ipd_intl: template.recordset[i].MPH_IPD_INTL,
          mph_opd: template.recordset[i].MPH_OPD,
          mph_opd_intl: template.recordset[i].MPH_OPD_INTL,
          qty: template.recordset[i].qty,
        });
      }

      res.json({ templates: newTemplates });
    } catch (err) {
      return resStatusMsg(res, 500, { msg: err.message });
    }
  },

  deleteTemplate: async (req, res) => {
    try {
      const { UID, PE_user_Status_flag, PE_user_role_Status_flag } = req.user;

      const { templateId } = req.params;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return resStatusMsg(res, 400, {
          msg: "Access is not allowed, please contact supervisor!",
        });
      }

      await mssql.query`
        exec pMP_PE_inactive_tamplate ${templateId}, ${UID}
      `;

      const templates = await mssql.query`
        exec pMP_get_PE_template ${UID}
      `;

      res.json({
        msg: "Template has been deleted.",
        templates: templates.recordset,
      });
    } catch (err) {
      return resStatusMsg(res, 500, { msg: err.message });
    }
  },

  postPrintTemplate: async (req, res) => {
    try {
      const { UID, PE_user_Status_flag, PE_user_role_Status_flag } = req.user;

      const { HN } = req.body.newPrintTemplate;
      const charges = req.body.newPrintTemplate.charges;

      let itemsType = [];
      charges.forEach((charge) => {
        itemsType.push(`${charge.item_code}|${charge.qty}`);
      });

      const newItemsType = itemsType.join(",");

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return resStatusMsg(res, 400, {
          msg: "Access is not allowed, please contact supervisor!",
        });
      }

      const printTemplate = await mssql.query`
        exec pMP_PE_print ${HN}, ${newItemsType}, ${UID}
      `;

      res.json({
        printTemplateUID: printTemplate.recordset[0].PE_print_UID,
      });
    } catch (err) {
      return resStatusMsg(res, 500, { msg: err.message });
    }
  },
};

module.exports = templateCtrl;
