import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
    sheetTitle: {
        type: String,
        required: true,
    },
    data: {
        type: [[String]],
        required: true,
    },
});

export default mongoose.model("Sheet", sheetSchema);