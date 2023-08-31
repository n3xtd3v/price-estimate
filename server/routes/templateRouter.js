const router = require("express").Router();
const auth = require("../middleware/auth");
const templateCtrl = require("../controllers/templateCtrl");

router.post("/template", auth, templateCtrl.postTemplate);

router.post("/print-template", auth, templateCtrl.postPrintTemplate);

router.get("/templates", auth, templateCtrl.getTemplatesByUID);

router.get("/template/:templateId", auth, templateCtrl.getTemplateItemsDetail);

router.delete("/template/:templateId", auth, templateCtrl.deleteTemplate);

module.exports = router;
