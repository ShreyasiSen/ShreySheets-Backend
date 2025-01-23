import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    spreadsheets: {
        type: [String], 
        required: false,
    },
});

export default mongoose.model("User", userSchema);