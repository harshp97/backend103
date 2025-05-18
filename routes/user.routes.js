import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateProfession, checkInCookies, } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()


router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logoutUser").post(verifyJWT, logoutUser)

// end point where user can refresh its refresh rtoken
router.route("/refresh-token").post(refreshAccessToken)

//change password for logened user
router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword)

//get current user
router.route("/getcurrentUser").post(verifyJWT, getCurrentUser)

//update profession
router.route("/updateAccountProfession").post(verifyJWT, updateProfession)

router.route("/checkInCookies").post(checkInCookies)



export default router