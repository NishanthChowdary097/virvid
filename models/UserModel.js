import mongoose, { Mongoose } from "mongoose";
import { type } from "os";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user','admin','legend'],
        default: 'user'
    },
    standard: {
        type: Number,
        default: 0
    },
    solved: [
        {
            contentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'content',
            },
            attempts: {
                type: Number,
                default: 0,
            },
            score: {
                type: Number,
                default: 0,
            },
            coinsGiven: {
                type: Boolean,
                default: false,
            },
        }
    ],
    wallet: {
        type: Number,
        default: 0
    },

})


export default mongoose.model('users', UserSchema);
