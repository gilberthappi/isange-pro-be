import mongoose from "mongoose";
const contactSchema = mongoose.Schema({
    email: String,
    fullNames: String,
    subject: String,
    message: String,
    adminResponse: String,
    phoneNumber: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },

});
export const CONTACT =mongoose.model("contact", contactSchema);
