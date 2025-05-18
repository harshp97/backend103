import mongoose from "mongoose";




// Permanent
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    mobileNumber: { type: String, required: true, index: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    email: { type: String },
    careOf: { type: String },
    address: { type: String },
    pastHistory: { type: String },
    familyHistory: { type: String },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visitstatus: { type: String, enum: ["visited", "notvisited"], default: "notvisited" },
    totalVisit: { type: Number, default: 0 },

    //  pvisitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Visit" }],   //ObjectID[]
    // this is removed and a Foreign key in visit model is added,, which is patient id (inside visit)
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);































// import mongoose from "mongoose";


// const patientSchema = new mongoose.Schema({
//     patientDetail: {
//         name: { type: String, required: true, index: true },
//         mobileNumber: { type: String, required: true, index: true },
//         dob: { type: String, required: true },
//         c_o: { type: String },
//         gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//         email: { type: String },
//         visitstatus: { type: String, enum: ["visited", "notvisited"], default: "notvisited" },
//         address: { type: String },
//         totalVisit: { type: Number, default: 0 },
//         createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         pasthistory: { type: String },
//         familyHistory: { type: String },
//         watchHistory: [{ type: Schema.Types.ObjectId, ref: "VisitHistory" }],          //ObjectID[]
//     }
// });





// export const Patient = mongoose.model("Patient", patientSchema);

// /*
// visitHistory: { type: mongoose.Schema.Types.ObjectId, ref: "VisitHistory" },   //ObjectID
//  */