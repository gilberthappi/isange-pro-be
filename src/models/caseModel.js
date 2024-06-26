import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseTitle: String,
  typeOfCase: String,
  status: String,
  dateOfIncident: String,
  location: String,
  photo: [String],
  documents: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRIBAccepted: { type: Boolean, default: false },
  isHospitalAccepted: { type: Boolean, default: false },
  description: {
    type: String,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  progress: String,
  assignedToRIB: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedToHospital: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  responseText: {
    type: String,
    default: null,
  },
  victim_name: String,
  victim_email: String,
  victim_phone: String,
  national_id: String,
  gender: String,
  risk_type: String,
  current_risk_level: String,
  interventions: String,
  isEmergency: { type: Boolean, default: false },
});

export const Case = mongoose.model("Case", caseSchema);
