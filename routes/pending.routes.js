import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { savePending, getPending_Pid, deletePending } from "../controllers/pending.controller.js"


const router = Router()


router.route("/savePending").post(verifyJWT, savePending)
router.route("/getPending_Pid").post(verifyJWT, getPending_Pid)

router.route("/deletePending").delete(verifyJWT, deletePending)



export default router