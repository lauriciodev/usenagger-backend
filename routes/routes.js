const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
//middleware;
const AdminAuth = require("../middleware/AdminAuth");

router.post("/user", AdminAuth, UserController.create);
router.get("/user", AdminAuth, UserController.getAllUsers);
router.get("/user/:id", AdminAuth, UserController.getById);
router.post("/users", AdminAuth, UserController.getUserByEmail);
router.put("/user", AdminAuth, UserController.edit);
router.post("/recover", AdminAuth, UserController.recoverPassword);
router.post("/password", AdminAuth, UserController.changePassword);
router.post("/login", UserController.login);
module.exports = router;
