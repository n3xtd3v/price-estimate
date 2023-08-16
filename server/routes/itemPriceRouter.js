const router = require("express").Router();
const auth = require("../middleware/auth");
const itemPriceCtrl = require("../controllers/itemPriceCtrl");

router.get("/items/:itemType", itemPriceCtrl.getItemsPrice);

module.exports = router;
