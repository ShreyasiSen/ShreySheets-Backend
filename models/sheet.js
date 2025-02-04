import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
    userid : {
        type: String,
        required: false,
    },
    sheetTitle: {
        type: String,
        required: true,
    },
    data: {
        type: [[{value: String, isBold: Boolean, isItalic: Boolean}]],
        required: false,
    },
});

export default mongoose.model("Sheet", sheetSchema);