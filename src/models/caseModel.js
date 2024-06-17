import { response } from "express";
import mongoose from "mongoose";
const caseSchema = mongoose.Schema({


    caseTitle: String,
    typeOfCase: String,
    status: String,
    dateOfIncident: String,
    location: String,
    photo: [String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isAccepted:{type:Boolean, default:false},
      description: {
        type: String,
        maxlength: 2000,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    progress: String,
    assignedTo: {
        type: String,
        default: null
    },
    responseText: {
        type: String,
        default: null
    },
    victim_name: String,
    victim_email: String,
    victim_phone: String,
    national_id: String,
    gender: String,
    risk_type: String,
    current_risk_level: String,
    interventions: String,

});
export const Case =mongoose.model("Case", caseSchema);


