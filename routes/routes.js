const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router.post("/user", UserController.create);
router.get("/user", UserController.getAllUsers);
router.get("/user/:id", UserController.getById);
router.post("/users", UserController.getUserByEmail);
router.put("/user", UserController.edit);
router.post("/recover", UserController.recoverPassword);
router.post("/password", UserController.changePassword);
module.exports = router;
