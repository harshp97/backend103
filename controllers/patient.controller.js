import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Patient } from "../model/patient.models.js"


const savePatient_R = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { name, mobileNumber, dob, gender, email, careOf, address, createdby, visitstatus, totalVisit } = req.body;

    // 2. Validate required fields
    if (!name || !mobileNumber || !dob || !gender) {
        throw new ApiError(400, "Name, mobile number, date of birth, and gender are required");
    }

    // 3. Validate the mobile number (you can reuse the validation from your schema)
    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
        throw new ApiError(400, "Invalid mobile number. Must be a 10-digit number.");
    }

    // 4. Parse the date of birth to ensure it's a valid Date object
    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) {
        throw new ApiError(400, "Invalid date of birth. Please use a valid date format.");
    }


    // 5. Create the new Patient document
    try {
        const newPatient = new Patient({
            name,
            mobileNumber,
            dob: parsedDob, // Use the parsed Date object
            gender,
            email,
            careOf,
            address,
            createdby,
            visitstatus,
            totalVisit,

        });

        // 6. Save the new Patient to the database
        const savedPatient_R = await newPatient.save();
        console.log(savePatient_R);

        // 7. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    savedPatient_R,
                    "Patient saved successfully"
                )
            );
    } catch (error) {
        console.error("Error saving patient:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate mobileNumber)
        // if (error.name === 'ValidationError') {
        //     //  const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "Failed to save patient");
    }
});


const saveNewPatient_D = asyncHandler(async (req, res) => {
    // 1. Extract data from the request body
    const { name, mobileNumber, dob, gender, email, careOf, address, createdby, visitstatus, totalVisit, pastHistory, familyHistory } = req.body;

    // 2. Validate required fields
    if (!name || !mobileNumber || !dob || !gender) {
        throw new ApiError(400, "d Name, mobile number, date of birth, and gender are required");
    }

    // 3. Validate the mobile number (you can reuse the validation from your schema)
    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
        throw new ApiError(400, "d Invalid mobile number. Must be a 10-digit number.");
    }

    // 4. Parse the date of birth to ensure it's a valid Date object
    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) {
        throw new ApiError(400, "d Invalid date of birth. Please use a valid date format.");
    }

    // 5. Create the new Patient document
    try {
        const newPatient = new Patient({
            name,
            mobileNumber,
            dob: parsedDob, // Use the parsed Date object
            gender,
            email,
            careOf,
            address,
            createdby,
            visitstatus,
            totalVisit,
            familyHistory,
            pastHistory,
        });

        // 6. Save the new Patient to the database
        const patientData = await newPatient.save();
        console.log(patientData);

        // 7. Return a success response
        return res
            .status(201)  // 201 Created (successful creation)
            .json(
                new ApiResponse(
                    201,  // Match the status code
                    patientData,
                    "d Patient saved successfully"
                )
            );
    } catch (error) {
        console.error("d Error saving patient:", error); // Log the error
        // Handle Mongoose validation errors (e.g., duplicate mobileNumber)
        // if (error.name === 'ValidationError') {
        //     //  const errors = Object.values(error.errors).map((err: any) => err.message); // Extract error messages
        //     throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        // }

        throw new ApiError(500, "d Failed to save patient");
    }
});


const getallPatientDetails = asyncHandler(async (req, res) => {
    try {
        const patients = await Patient.find({}); // Find all Patient documents
        //const patients = await Patient.find({}).populate('createdby', 'username email'); // Populate createdby with select specific fields.

        if (!patients || patients.length === 0) {
            return res
                .status(200) // Could also use 204 No Content
                .json(new ApiResponse(200, [], "No patients found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, patients, "All patients retrieved successfully"));

    } catch (error) {
        console.error("Error retrieving all patients:", error);
        throw new ApiError(500, "Failed to retrieve patients");
    }
});

const searchPby_id = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { _id } = req.body; // Destructure from req.body

    if (!_id) {
        throw new ApiError(400, "_id is required in the request body");
    }


    //findById(visitId)
    const patients = await Patient.find({ _id: _id }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first

    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this _id"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patient with specified _id retrieved successfully"));

});

const searchPbyname = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { name } = req.body; // Destructure from req.body

    if (!name) {
        throw new ApiError(400, "name is required in the request body");
    }


    // const patients = await Patient.find({ name: name }) // This is the key line - it returns ALL matching documents
    //     .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first

    // Use a regular expression for a case-insensitive, partial match search
    const patients = await Patient.find({
        name: { $regex: name, $options: 'i' } // The key line for flexible search
    })
        .sort({ updatedAt: -1 });

    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this name"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patient with specified name retrieved successfully"));

});

const searchPbymobileNumber = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { mobileNumber } = req.body; // Destructure from req.body

    if (!mobileNumber) {
        throw new ApiError(400, "mobileNumber is required in the request body");
    }

    console.log("\n mob ", mobileNumber);

    const patients = await Patient.find({ mobileNumber: mobileNumber }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first



    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this mobileNumber"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patient with specified mobileNumber retrieved successfully"));

});

const searchPbyemail = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { email } = req.body; // Destructure from req.body

    if (!email) {
        throw new ApiError(400, "email is required in the request body");
    }


    const patients = await Patient.find({ email: email }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first



    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this email"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patient with specified email retrieved successfully"));

});

const searchPbydob = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { dob } = req.body; // Destructure from req.body

    if (!dob) {
        throw new ApiError(400, "dob is required in the request body");
    }


    const patients = await Patient.find({ dob: dob }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first



    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this dob"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patient with specified dob retrieved successfully"));

});

const searchPby_visitstatus = asyncHandler(async (req, res) => {
    //const { _id } = req.body;
    // console.log("\n pid: ", req.body);

    const { visitstatus } = req.body; // Destructure from req.body

    if (!visitstatus) {
        throw new ApiError(400, "visitstatus is required in the request body");
    }


    const patients = await Patient.find({ visitstatus: visitstatus }) // This is the key line - it returns ALL matching documents
        .sort({ updatedAt: -1 }); // Optional: Sort by submission date, newest first



    if (!patients || patients.length === 0) {
        return res
            .status(200) // 204 No Content is also valid here
            .json(new ApiResponse(200, [], "No patient found for this visitstatus"));  // Empty array
    }

    return res
        .status(200)
        .json(new ApiResponse(200, patients, "Patients with specified visitstatus retrieved successfully"));

});




//upadte visit status after doc examine the patient
const updatePatient_status = asyncHandler(async (req, res) => {

    const { _id, visitstatus } = req.body
    console.log("ll- called here\n \n hiiediedii")

    if (!_id || !visitstatus) {
        throw new ApiError(400, "All fields are required")
    }

    const patient = await Patient.findByIdAndUpdate(
        _id,
        {
            $set: {
                visitstatus: visitstatus,
            }
        },
        { new: true }

    )

    return res
        .status(200)
        .json(new ApiResponse(200, patient, "patient status details updated successfully"))
});


//delete patient based on id
const deletePatient = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        throw new ApiError(400, "Patient ID is required");
    }

    try {
        //First Find the visit if you can find to delete then
        const patient = await Patient.findById(_id)

        if (!patient) {
            throw new ApiError(404, "such Patient in db not found");
        }

        const result = await Patient.deleteOne({ _id: _id });

        //This means we couldn't even find that element to remove
        // if (result.deletedCount === 0) {
        //     throw new ApiError(404, "Visit not found");
        // }

        return res
            .status(200)
            .json(new ApiResponse(200, result, "Patient deleted successfully"));
    } catch (error) {
        console.error("Error deleting patient:", error);
        throw new ApiError(500, "Failed to delete patient");
    }
});


const updatePatient = asyncHandler(async (req, res) => {
    const { _id, name, dob, gender, careOf, address, mobileNumber, email, familyHistory, pastHistory, visitstatus } = req.body;

    // 1.  Check if the patient id exist
    const patient = await Patient.findById(_id)

    if (!patient) {
        throw new ApiError(404, "Patient doesn't exist");
    }

    // 2. Build the update object (only include fields that are present in the request)
    const updateData = {}; // Initialize an empty object

    if (name) {
        updateData.name = name;
    }
    if (dob) {
        updateData.dob = dob;
    }
    if (gender) {
        updateData.gender = gender;
    }
    if (careOf) {
        updateData.careOf = careOf;
    }
    if (address) {
        updateData.address = address;
    }
    if (mobileNumber) {
        updateData.mobileNumber = mobileNumber;
    }
    if (email) {
        updateData.email = email;
    }
    if (pastHistory) {
        updateData.pastHistory = pastHistory;
    }
    if (familyHistory) {
        updateData.familyHistory = familyHistory;
    }
    if (visitstatus) {
        updateData.visitstatus = visitstatus
    }


    // Check if there is something to update
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields to update were provided.");
    }

    console.log("\n", updateData);

    // 3. Update the patient document
    const updatedPatient = await Patient.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true } // Return the modified document and run validators
    );

    if (!updatedPatient) {
        throw new ApiError(404, "Patient not found");
    }

    // 4. Return a success response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPatient, "Patient updated successfully"));
});


export {
    savePatient_R,
    saveNewPatient_D,

    getallPatientDetails,
    searchPby_id,
    searchPbyname,
    searchPbymobileNumber,
    searchPbyemail,
    searchPbydob,
    searchPby_visitstatus,

    updatePatient_status,
    deletePatient,
    updatePatient

}; // Export the function
