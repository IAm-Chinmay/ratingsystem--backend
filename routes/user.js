const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.use(auth, allowRoles("normal"));

router.get("/stores", userController.getStores);

router.post("/rate", userController.submitRating);

router.put("/rate", userController.updateRating);

router.put("/update-password", userController.updatePassword);

module.exports = router;
