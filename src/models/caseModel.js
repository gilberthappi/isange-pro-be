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
});
export const Case =mongoose.model("Case", caseSchema);


