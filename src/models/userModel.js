/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { boolean } from 'joi';
import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    // Common Fields
    name: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 255
    },
    phone: {
        type: String,
        required: false,
        min: 10,
        max: 15
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    confirmPassword: {
        type: String,
        required: false,
        min: 6,
        max: 255
    },
    photo: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    country: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    city: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    district: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    sector: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    cell: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    nationalID: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    role: {
        type: String,
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now,
    },
    userType: {
        type: String,
        enum: ['individual', 'organization', 'admin'],
        required: false,
      },
    
      // Additional Fields for Organization Clients
      registrationNumber: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 255,
      },
      industry: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 255,
      },
      contactPerson: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 255,
      },
      documents: {
        type: Array,
        required: false,
      },
      category: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    otpExpiresAt: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false
    },
});
    
    userSchema.plugin(mongoosePaginate);
    export const USER = mongoose.model('User', userSchema);