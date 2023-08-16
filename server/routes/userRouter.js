const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");

router.get("/users", auth, userCtrl.getUsers);

router.patch("/users", auth, userCtrl.updateSwitchIsActive);

router.patch("/users/admin", auth, userCtrl.updateRoleAdmin);

router.patch("/users/supervisor", auth, userCtrl.updateRoleSupervisor);

router.patch("/users/staff", auth, userCtrl.updateRoleStaff);

module.exports = router;
