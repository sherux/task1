const express = require("express");
const router = express.Router();
const User = require("../controller/usesr");
const auth = require("../controller/verifytoken");
const { uploadS3 } = require("../controller/fileupload");

router.get("/auth", auth, User.auth);
router.get("/all", User.getalldata);
router.get("/all/:id", User.getonedata);
router.post("/register", uploadS3.single("profile"), User.registerdata);
router.post("/login", User.logindata);
router.put("/update/:id", uploadS3.single("profile"), User.UpdateData);
router.delete("/delete/:id", uploadS3.single("profile"), User.DeleteData);
router.post("/forget-password", User.forgetpassword);
router.put("/Reset-password", User.resetpassword);

module.exports = router;
