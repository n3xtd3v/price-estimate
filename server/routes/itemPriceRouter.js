const router = require("express").Router();
const auth = require("../middleware/auth");
const itemPriceCtrl = require("../controllers/itemPriceCtrl");

router.get("/items/:itemType", itemPriceCtrl.getItemsPrice);

router.post("/item/search-log", auth, itemPriceCtrl.searchLog);

router.post("/items", auth, itemPriceCtrl.getItemsPriceWithFile);

module.exports = router;
