import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { saveNewVisit_R, saveNewVisit_D, getallVisitDetails_byPatientID, saveVisitData_Examine, saveNewVisitFour_R, deleteVisit, getVisitDetails_byVisitID, updateVisit } from "../controllers/visit.controller.js"


const router = Router()


router.route("/saveNewVisit_R").post(verifyJWT, saveNewVisit_R)
router.route("/saveNewVisit_D").post(verifyJWT, saveNewVisit_D)
router.route("/getallVisitDetails_byPatientID").post(verifyJWT, getallVisitDetails_byPatientID)


router.route("/saveVisitData_Examine").post(verifyJWT, saveVisitData_Examine)
router.route("/saveNewVisitFour_R").post(verifyJWT, saveNewVisitFour_R)
router.route("/deleteVisit").delete(verifyJWT, deleteVisit)


router.route("/getVisitDetails_byVisitID").post(verifyJWT, getVisitDetails_byVisitID)

router.route("/updateVisit").post(verifyJWT, updateVisit)



export default router


