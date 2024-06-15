import { response } from "express";
import mongoose from "mongoose";
const caseSchema = mongoose.Schema({


    caseTitle: String,
    typeOfCase: String,
    category: String,
    status: String,
    riskLevel: String,
    dateOfIncident: String,
    location: String,
    photo: [String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isAccepted:{type:Boolean, default:false},
    subscriptionStatus: {
        type: String,
      },
      subscriptionType: {
        type: String,
      },
      description: {
        type: String,
        maxlength: 2000,
      },
      duration: {
        type: String,
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
});
export const Case =mongoose.model("Case", caseSchema);


