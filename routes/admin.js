const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

router.use(auth, allowRoles("admin"));

router.get("/dashboard", adminController.getDashboard);
router.post("/add-user", adminController.addUser);
router.post("/add-store", adminController.addStore);
router.get("/users", adminController.getUsers);
router.get("/stores", adminController.getStores);
router.get("/user/:id", adminController.getUserDetails);

module.exports = router;
