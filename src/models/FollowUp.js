import mongoose from 'mongoose';

const FollowUpSchema = new mongoose.Schema({
  victim_name: { type: String},
  gender: { type: String },
  doctor_name: { type: String},
  needed_aid: { type: String},
  next_appointment: { type: Date},
  action: { type: String},
}, {
  timestamps: true
});

export const FollowUp =mongoose.model("FollowUp", FollowUpSchema);

