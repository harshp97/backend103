import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


// pending
const pendingSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true, unique: true, },
    visit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Visit", required: true, index: true, unique: true, },

}, { timestamps: true });


pendingSchema.plugin(mongooseAggregatePaginate)
export const Pending = mongoose.model("Pending", pendingSchema);