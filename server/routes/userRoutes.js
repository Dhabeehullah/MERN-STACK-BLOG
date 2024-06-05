const { Router } =require("express");
const {registerUser,loginUser,userProfile, editProfile, changeAvatar, getAuthors} = require("../controller/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/change-avatar",authMiddleware,changeAvatar)
router.get("/:id",userProfile)
router.get("/",getAuthors)
router.patch("/edit-profile",authMiddleware,editProfile)


module.exports =router 