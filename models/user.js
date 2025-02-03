import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    spreadsheets: {
        type: [String], 
        required: false,
    },
});

export default mongoose.model("User", userSchema);