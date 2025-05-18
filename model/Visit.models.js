import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


//Recurrent or Visit Special
const visitSchema = new mongoose.Schema({
    weight: { type: Number },
    height: { type: Number },
    bloodSugar: { type: Number },
    bloodPressure: { type: String },
    prescription: { type: String },
    note: { type: String },
    examinedby: { type: String },
    followUpDate: { type: Date },
    CC: { type: String },
    conclusion: { type: String },
    // patientId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true }],   //ObjectID[]
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true } // Foreign key to Patient
}, { timestamps: true });

// Visit.plugin(mongooseAggregatePaginate)

// export const Visit = mongoose.model("Visit", visitSchema);

visitSchema.plugin(mongooseAggregatePaginate)

export const Visit = mongoose.model("Visit", visitSchema);