const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/signin", authCtrl.signin);

router.post("/refresh_token", authCtrl.generateAccessToken);

router.post("/signout", authCtrl.signout);

module.exports = router;
