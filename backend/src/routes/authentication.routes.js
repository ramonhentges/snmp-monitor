const router = require("express-promise-router")();
const authenticationController = require("../controllers/authentication.controller");

router.post("/login", authenticationController.login);

router.post("/logout", authenticationController.logout);

module.exports = router;