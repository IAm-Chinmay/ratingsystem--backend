const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const storeOwnerController = require("../controllers/storeOwnerController");

router.use(auth, allowRoles("store_owner"));

router.get("/dashboard", storeOwnerController.getDashboard);

router.put("/update-password", storeOwnerController.updatePassword);

module.exports = router;
