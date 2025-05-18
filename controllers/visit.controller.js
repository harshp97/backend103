import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Visit } from "../model/Visit.models.js"
import mongoose from "mongoose";


const saveNewVisit_R = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { weight, height, bloodSugar, bloodPressure, patientId, examinedby } = req.body;

    // 2. Validate required fields
    if (!patientId) {
        throw new ApiError(400, " patient ID are required");
    }

    // 3. Check if the patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new ApiError(400, "Invalid patient ID");
    }

    // 4. Create the new Visit document
    try {
        const newVisit = new Visit({
            weight,
            height,
            bloodSugar,
            bloodPressure,
            examinedby,
            patientId  // Set the patientId
        });

        // 5. Save the new Visit to the database
        const savedVisit = await newVisit.save();

        // 6. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedVisit,
                    "Visit saved successfully"
                )
            );
    } catch (error) {
        console.error("Error saving visit:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate )
        // if (error.name === 'ValidationError') {
        //     const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "Failed to save visit");
    }
});

const saveNewVisit_D = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { weight, height, bloodSugar, bloodPressure, patientId, prescription, note, examinedby, followUpDate, CC, conclusion } = req.body;

    // 2. Validate required fields
    if (!patientId) {
        throw new ApiError(400, "d patient ID are required");
    }

    // 3. Check if the patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new ApiError(400, "d Invalid patient ID");
    }

    // 4. Create the new Visit document
    try {
        const newVisit = new Visit({
            weight,
            height,
            bloodSugar,
            bloodPressure,
            patientId,  // Set the patientId

            prescription,
            note,
            examinedby,
            followUpDate,
            CC,
            conclusion
        });

        // 5. Save the new Visit to the database
        const savedVisit = await newVisit.save();

        // 6. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedVisit,
                    "d Visit d saved successfully"
                )
            );
    } catch (error) {
        console.error("d Error saving visitd:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate )
        // if (error.name === 'ValidationError') {
        //     const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "d Failed to save visitd");
    }
});

const getallVisitDetails_byPatientID = asyncHandler(async (req, res) => {
    //const { patientId } = req.body;
    // console.log("\n pid: ", req.body);

    const { patientId } = req.body; // Destructure from req.body

    if (!patientId) {
        throw new ApiError(400, "Weight is required in the request body");
    }


    const visits = await Visit.find({ patientId: patientId }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first

    if (!visits || visits.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No visits found for this pid"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, visits, "Visits with specified pid retrieved successfully"));

});

const saveVisitData_Examine = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { weight, height, bloodSugar, bloodPressure, patientId, prescription, note, examinedby, followUpDate, CC, conclusion } = req.body;

    // 2. Validate required fields
    if (!patientId) {
        throw new ApiError(400, "d patient ID are required");
    }

    // 3. Check if the patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new ApiError(400, "d Invalid patient ID");
    }

    // 4. Create the new Visit document
    try {
        const newVisit = new Visit({
            weight,
            height,
            bloodSugar,
            bloodPressure,
            patientId,  // Set the patientId

            prescription,
            note,
            examinedby,
            followUpDate,
            CC,
            conclusion
        });

        // 5. Save the new Visit to the database
        const savedVisit = await newVisit.save();

        // 6. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedVisit,
                    "d Visit d saved successfully"
                )
            );
    } catch (error) {
        console.error("d Error saving visitd:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate )
        // if (error.name === 'ValidationError') {
        //     const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "d Failed to save visitd");
    }
});

//save or create new visit id with only 4 fields w,h,bp,sug by recpt so later exam by doc based on pendings
const saveNewVisitFour_R = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { weight, height, bloodSugar, bloodPressure, patientId } = req.body;

    // 2. Validate required fields
    if (!patientId) {
        throw new ApiError(400, "r patient ID are required");
    }

    // 3. Check if the patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new ApiError(400, "r Invalid patient ID");
    }

    // 4. Create the new Visit document
    try {
        const newVisit = new Visit({
            weight,
            height,
            bloodSugar,
            bloodPressure,
            patientId,  // Set the patientId
        });

        // 5. Save the new Visit to the database
        const savedVisit = await newVisit.save();

        // 6. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedVisit,
                    "r Visit 4-datas saved successfully"
                )
            );
    } catch (error) {
        console.error("d Error saving 4 data of visit:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate )
        // if (error.name === 'ValidationError') {
        //     const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "d Failed to save visitd");
    }
});


//deleteVisit based on _id
const deleteVisit = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        throw new ApiError(400, "Visit ID is required");
    }

    try {
        //First Find the visit if you can find to delete then
        const visit = await Visit.findById(_id)

        if (!visit) {
            throw new ApiError(404, "such Visit in db not found");
        }

        const result = await Visit.deleteOne({ _id: _id });

        //This means we couldn't even find that element to remove
        // if (result.deletedCount === 0) {
        //     throw new ApiError(404, "Visit not found");
        // }

        return res
            .status(200)
            .json(new ApiResponse(200, result, "Visit deleted successfully"));
    } catch (error) {
        console.error("Error deleting visit:", error);
        throw new ApiError(500, "Failed to delete visit");
    }
});



const getVisitDetails_byVisitID = asyncHandler(async (req, res) => {
    const { _id } = req.body; // Destructure from req.body

    if (!_id) {
        throw new ApiError(400, "_id is required in the request body");
    }


    const visits = await Visit.find({ _id: _id }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first

    if (!visits || visits.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No visits found for this _id"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, visits, "Visits with specified _id retrieved successfully"));

});


//update visit
const updateVisit = asyncHandler(async (req, res) => {

    const { _id, prescription, note, examinedby, followUpDate, CC, conclusion } = req.body;

    if (!_id) {
        throw new ApiError(400, "_id is required in the request body");
    }

    // 1.  Check if the patient id exist
    const visit = await Visit.findById(_id)

    if (!visit) {
        throw new ApiError(404, "Visit Data doesn't exist");
    }

    // 2. Build the update object (only include fields that are present in the request)
    const updateData = {}; // Initialize an empty object

    if (prescription) {
        updateData.prescription = prescription;
    }
    if (note) {
        updateData.note = note;
    }
    if (examinedby) {
        updateData.examinedby = examinedby;
    }
    if (followUpDate) {
        updateData.followUpDate = followUpDate;
    }
    if (CC) {
        updateData.CC = CC;
    }
    if (conclusion) {
        updateData.conclusion = conclusion;
    }


    // Check if there is something to update
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields to update were provided.");
    }

    console.log("\n", updateData);

    // 3. Update the visit document
    const updatedVisit = await Visit.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true } // Return the modified document and run validators
    );

    if (!updatedVisit) {
        throw new ApiError(404, "Visit not found");
    }

    // 4. Return a success response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedVisit, "Patient updated successfully"));
});



export {
    saveNewVisit_R,
    saveNewVisit_D,
    getallVisitDetails_byPatientID,
    saveVisitData_Examine,
    saveNewVisitFour_R,
    deleteVisit,
    getVisitDetails_byVisitID,
    updateVisit,


}; // Export the function
