import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { savePatient_R, saveNewPatient_D, getallPatientDetails, searchPby_id, searchPbyname, searchPbymobileNumber, searchPbyemail, searchPbydob, searchPby_visitstatus, updatePatient_status, deletePatient, updatePatient } from "../controllers/patient.controller.js"


const router = Router()


router.route("/saveNewPatient_R").post(verifyJWT, savePatient_R)
router.route("/saveNewPatient_D").post(verifyJWT, saveNewPatient_D)
router.route("/getallPatientDetails").post(verifyJWT, getallPatientDetails)

router.route("/searchPby_id").post(verifyJWT, searchPby_id)
router.route("/searchPbyname").post(verifyJWT, searchPbyname)
router.route("/searchPbymobileNumber").post(verifyJWT, searchPbymobileNumber)
router.route("/searchPbyemail").post(verifyJWT, searchPbyemail)
router.route("/searchPbydob").post(verifyJWT, searchPbydob)
router.route("/searchPby_visitstatus").post(verifyJWT, searchPby_visitstatus)

router.route("/deletePatient").delete(verifyJWT, deletePatient)




router.route("/updatePatient_status").post(verifyJWT, updatePatient_status)
router.route("/updatePatient").post(verifyJWT, updatePatient)






export default router