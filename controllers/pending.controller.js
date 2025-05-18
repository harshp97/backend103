import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pending } from "../model/pending.models.js"
import mongoose from "mongoose";

const savePending = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { patient_id, visit_id } = req.body;

    //throw new ApiError(500, "Failed to save pending");

    // 2. Validate required fields
    if (!patient_id || !visit_id) {
        throw new ApiError(400, " patient ID | visit ID are required");
    }

    //no need
    // // 3. Check if the patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
        throw new ApiError(400, "Invalid patient ID");
    }
    if (!mongoose.Types.ObjectId.isValid(visit_id)) {
        throw new ApiError(400, "Invalid visit ID");
    }

    //check for uniqueness in pending schema basically already exist or not
    const existedPending = await Pending.findOne({
        $or: [{ patient_id }, { visit_id }]
    })

    if (existedPending) {
        throw new ApiError(409, "Patient already exists in pending list!!!")
    }


    // 4. Create the new Visit document
    try {
        const newPending = new Pending({
            patient_id,
            visit_id,
        });

        // 5. Save the new Visit to the database
        const savedPending = await newPending.save();

        // 6. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedPending,
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

        throw new ApiError(500, "Failed to save pending");
    }
});

const getPending_Pid = asyncHandler(async (req, res) => {

    const { patient_id } = req.body; // Destructure from req.body

    if (!patient_id) {
        throw new ApiError(400, "patient_id is required in the request body");
    }

    console.log("\n pid ", patient_id);

    const patient = await Pending.find({ patient_id: patient_id }) // This is the key line - it returns ALL matching documents
    //.sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first



    if (!patient || patient.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient_id found for this id"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patient, "Patient with specified patient_id retrieved successfully"));

});


const deletePending = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        throw new ApiError(400, "Pending ID is required");
    }

    try {
        //First Find the pending data; once got- delete then
        const pending = await Pending.findById(_id)

        if (!pending) {
            throw new ApiError(404, "such pending in db not found");
        }

        const result = await Pending.deleteOne({ _id: _id });

        return res
            .status(200)
            .json(new ApiResponse(200, result, "Pending deleted successfully"));

    } catch (error) {
        console.error("Error deleting pending:", error);
        throw new ApiError(500, "Failed to delete pending");
    }
});





export {
    savePending,
    getPending_Pid,
    deletePending
}; // Export the function
