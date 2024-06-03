import mongoose from "mongoose";
const eventSchema = mongoose.Schema({


    eventTitle: String,
    typeOfEvent: String,
    dateOfEvent: String,
    mainGuest: String,
    location: String,
    photo: [String],
    documents:[String],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    hostedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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
export const Event =mongoose.model("Event", eventSchema);


