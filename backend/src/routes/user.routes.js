const router = require("express-promise-router")();
const userController = require("../controllers/user.controller");

router.post("/user", userController.createUser);

router.get("/users", userController.listAllUsers);

router.get("/user/:id", userController.findUserById);

router.put("/user/:id", userController.updateUserById);

router.delete("/user/:id", userController.deleteUserById);

module.exports = router;
